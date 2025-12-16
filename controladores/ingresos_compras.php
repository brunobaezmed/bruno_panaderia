<?php
require_once '../conexion/db.php';

if (isset($_POST['listar'])) {
    listar();
}

if (isset($_POST['guardar'])) {
    guardar($_POST['guardar']);
}

if (isset($_POST['obtener'])) {
    obtener($_POST['obtener']);
}

if (isset($_POST['obtener_detalle'])) {
    obtener_detalle($_POST['obtener_detalle']);
}

if (isset($_POST['anular'])) {
    anular($_POST['anular']);
}

if (isset($_POST['buscar'])) {
    buscar($_POST['buscar']);
}

function listar() {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT ic.id_ingreso, p.nombre_apellido, ic.fecha_ingreso, ic.total_compra, ic.observacion, ic.estado
           FROM ingresos_compras ic
           INNER JOIN proveedores p ON ic.id_proveedor = p.id_proveedor
       ORDER BY ic.id_ingreso DESC;"
    );
    $query->execute();
    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}

function guardar($lista) {
    $json_datos = json_decode($lista, true);
    $base_datos = new DB();
    $pdo = null;
    
    try {
        // Obtener la conexión PDO y usar la misma instancia durante toda la transacción
        $pdo = $base_datos->conectar();
        // Iniciar transacción
        $pdo->beginTransaction();
        
        // Insertar cabecera
        $query_cabecera = $pdo->prepare(
            "INSERT INTO ingresos_compras (id_proveedor, fecha_ingreso, total_compra, observacion, estado)
             VALUES (:id_proveedor, :fecha_ingreso, :total_compra, :observacion, :estado);"
        );
        $query_cabecera->execute([
            'id_proveedor' => $json_datos['id_proveedor'],
            'fecha_ingreso' => $json_datos['fecha_ingreso'],
            'total_compra' => $json_datos['total_compra'],
            'observacion' => !empty($json_datos['observacion']) ? $json_datos['observacion'] : null,
            'estado' => 'ACTIVO',
        ]);
        
        $id_ingreso = $pdo->lastInsertId();
        
        // Insertar detalles
        if (!empty($json_datos['detalles']) && is_array($json_datos['detalles'])) {
            $query_detalle = $pdo->prepare(
                "INSERT INTO detalle_ingreso (id_ingreso, id_producto, cantidad, precio_compra)
                 VALUES (:id_ingreso, :id_producto, :cantidad, :precio_compra);"
            );
            
            foreach ($json_datos['detalles'] as $detalle) {
                $query_detalle->execute([
                    'id_ingreso' => $id_ingreso,
                    'id_producto' => $detalle['id_producto'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_compra' => $detalle['precio_compra'],
                ]);
            }
        }
        
        // Actualizar total en cabecera
        // Use distinct named parameters because PDO with ATTR_EMULATE_PREPARES = false
        // (native prepares) doesn't support reusing the same named placeholder twice.
        $query_total = $pdo->prepare(
            "UPDATE ingresos_compras SET total_compra = (
                SELECT COALESCE(SUM(subtotal), 0) FROM detalle_ingreso WHERE id_ingreso = :id_ingreso_sub
            ) WHERE id_ingreso = :id_ingreso;"
        );
        $query_total->execute(['id_ingreso_sub' => $id_ingreso, 'id_ingreso' => $id_ingreso]);
        
        $pdo->commit();
        
        echo json_encode(['ok' => true, 'id' => $id_ingreso]);
    } catch (Exception $e) {
        if ($pdo && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        echo json_encode(['ok' => false, 'msg' => 'Error: ' . $e->getMessage()]);
    }
}

function obtener($id) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT ic.id_ingreso, ic.id_proveedor, p.nombre_apellido, ic.fecha_ingreso, ic.total_compra, ic.observacion, ic.estado
           FROM ingresos_compras ic
           INNER JOIN proveedores p ON ic.id_proveedor = p.id_proveedor
          WHERE ic.id_ingreso = :id
          LIMIT 1;"
    );
    $query->execute(['id' => $id]);
    if ($query->rowCount()) {
        print_r(json_encode($query->fetch(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}

function obtener_detalle($id_ingreso) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT di.id_detalle, di.id_ingreso, di.id_producto, pr.nombre_producto, di.cantidad, di.precio_compra, di.subtotal
           FROM detalle_ingreso di
           INNER JOIN productos pr ON di.id_producto = pr.id_producto
          WHERE di.id_ingreso = :id_ingreso
       ORDER BY di.id_detalle;"
    );
    $query->execute(['id_ingreso' => $id_ingreso]);
    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}

function anular($id) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "UPDATE ingresos_compras SET estado = 'ANULADO' WHERE id_ingreso = :id;"
    );
    $query->execute(['id' => $id]);
}

function buscar($texto) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT ic.id_ingreso, p.nombre_apellido, ic.fecha_ingreso, ic.total_compra, ic.observacion, ic.estado
           FROM ingresos_compras ic
           INNER JOIN proveedores p ON ic.id_proveedor = p.id_proveedor
          WHERE CONCAT(ic.id_ingreso, ' ', p.nombre_apellido, ' ', ic.fecha_ingreso, ' ', ic.estado) LIKE :texto
       ORDER BY ic.id_ingreso DESC
          LIMIT 50;"
    );
    $query->execute(['texto' => "%$texto%"]);
    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}
?>

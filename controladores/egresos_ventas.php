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
    // Alias DB columns to the names used by the frontend (`fecha_egreso`, `total_egreso`)
    $query = $base_datos->conectar()->prepare(
        "SELECT ev.id_egreso, c.nombre_cliente, ev.fecha_venta AS fecha_egreso, ev.total_venta AS total_egreso, ev.observacion, ev.estado
           FROM egresos_ventas ev
           INNER JOIN clientes c ON ev.id_cliente = c.id_cliente
       ORDER BY ev.id_egreso DESC;"
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
        $pdo = $base_datos->conectar();
        $pdo->beginTransaction();

        // Insert using actual DB column names (`fecha_venta`, `total_venta`) but keep
        // parameter names from the frontend for clarity.
        $query_cabecera = $pdo->prepare(
            "INSERT INTO egresos_ventas (id_cliente, fecha_venta, total_venta, observacion, estado)
             VALUES (:id_cliente, :fecha_egreso, :total_egreso, :observacion, :estado);"
        );
        $query_cabecera->execute([
            'id_cliente' => $json_datos['id_cliente'],
            'fecha_egreso' => $json_datos['fecha_egreso'],
            'total_egreso' => $json_datos['total_egreso'],
            'observacion' => !empty($json_datos['observacion']) ? $json_datos['observacion'] : null,
            'estado' => 'ACTIVO',
        ]);

        $id_egreso = $pdo->lastInsertId();

        if (!empty($json_datos['detalles']) && is_array($json_datos['detalles'])) {
            // detalle_egreso uses column `precio_venta` and `id_detalle_egreso` as PK
            $query_detalle = $pdo->prepare(
                "INSERT INTO detalle_egreso (id_egreso, id_producto, cantidad, precio_venta)
                 VALUES (:id_egreso, :id_producto, :cantidad, :precio_unitario);"
            );
            foreach ($json_datos['detalles'] as $detalle) {
                $query_detalle->execute([
                    'id_egreso' => $id_egreso,
                    'id_producto' => $detalle['id_producto'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
                ]);
            }
        }

        // Update using actual column `total_venta` but keep returning API field names
        $query_total = $pdo->prepare(
            "UPDATE egresos_ventas SET total_venta = (
                SELECT COALESCE(SUM(subtotal), 0) FROM detalle_egreso WHERE id_egreso = :id_egreso_sub
            ) WHERE id_egreso = :id_egreso;"
        );
        $query_total->execute(['id_egreso_sub' => $id_egreso, 'id_egreso' => $id_egreso]);

        $pdo->commit();
        echo json_encode(['ok' => true, 'id' => $id_egreso]);
    } catch (Exception $e) {
        if ($pdo && $pdo->inTransaction()) $pdo->rollBack();
        echo json_encode(['ok' => false, 'msg' => 'Error: ' . $e->getMessage()]);
    }
}

function obtener($id) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT ev.id_egreso, ev.id_cliente, c.nombre_cliente, ev.fecha_venta AS fecha_egreso, ev.total_venta AS total_egreso, ev.observacion, ev.estado
           FROM egresos_ventas ev
           INNER JOIN clientes c ON ev.id_cliente = c.id_cliente
          WHERE ev.id_egreso = :id
          LIMIT 1;"
    );
    $query->execute(['id' => $id]);
    if ($query->rowCount()) {
        print_r(json_encode($query->fetch(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}

function obtener_detalle($id_egreso) {
    $base_datos = new DB();
     // Return fields aliased to match frontend expectations (`id_detalle`, `precio_unitario`)
     $query = $base_datos->conectar()->prepare(
          "SELECT de.id_detalle_egreso AS id_detalle, de.id_egreso, de.id_producto, pr.nombre_producto, de.cantidad, de.precio_venta AS precio_unitario, de.subtotal
              FROM detalle_egreso de
              INNER JOIN productos pr ON de.id_producto = pr.id_producto
             WHERE de.id_egreso = :id_egreso
         ORDER BY de.id_detalle_egreso;"
     );
    $query->execute(['id_egreso' => $id_egreso]);
    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}

function anular($id) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "UPDATE egresos_ventas SET estado = 'ANULADO' WHERE id_egreso = :id;"
    );
    $query->execute(['id' => $id]);
}

function buscar($texto) {
    $base_datos = new DB();
     $query = $base_datos->conectar()->prepare(
          "SELECT ev.id_egreso, c.nombre_cliente, ev.fecha_venta AS fecha_egreso, ev.total_venta AS total_egreso, ev.observacion, ev.estado
              FROM egresos_ventas ev
              INNER JOIN clientes c ON ev.id_cliente = c.id_cliente
             WHERE CONCAT(ev.id_egreso, ' ', c.nombre_cliente, ' ', ev.fecha_venta, ' ', ev.estado) LIKE :texto
         ORDER BY ev.id_egreso DESC
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

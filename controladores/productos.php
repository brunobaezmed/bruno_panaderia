<?php
require_once '../conexion/db.php';

if (isset($_POST['listar'])) {
    listar();
}

if (isset($_POST['guardar'])) {
    guardar($_POST['guardar']);
}

if (isset($_POST['actualizar'])) {
    actualizar($_POST['actualizar']);
}

if (isset($_POST['id'])) {
    obtener_por_id($_POST['id']);
}

if (isset($_POST['eliminar'])) {
    eliminar($_POST['eliminar']);
}

if (isset($_POST['buscar'])) {
    buscar($_POST['buscar']);
}

if (isset($_POST['leer_activos'])) {
    leer_activos();
}

function listar() {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT id_producto, nombre_producto, descripcion, unidad_medida, stock_actual, stock_minimo, precio_unitario, estado
           FROM productos
       ORDER BY id_producto DESC;"
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
    try {
        $query = $base_datos->conectar()->prepare(
            "INSERT INTO productos (nombre_producto, descripcion, unidad_medida, stock_actual, stock_minimo, precio_unitario, estado)
             VALUES (:nombre_producto, :descripcion, :unidad_medida, :stock_actual, :stock_minimo, :precio_unitario, :estado);"
        );
        $params = [
            'nombre_producto' => $json_datos['nombre_producto'],
            'descripcion' => !empty($json_datos['descripcion']) ? $json_datos['descripcion'] : null,
            'unidad_medida' => !empty($json_datos['unidad_medida']) ? $json_datos['unidad_medida'] : null,
            'stock_actual' => isset($json_datos['stock_actual']) ? $json_datos['stock_actual'] : 0,
            'stock_minimo' => isset($json_datos['stock_minimo']) ? $json_datos['stock_minimo'] : 0,
            'precio_unitario' => $json_datos['precio_unitario'],
            'estado' => $json_datos['estado'],
        ];
        $query->execute($params);
        echo json_encode(['ok' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'msg' => $e->getMessage()]);
    }
}

function actualizar($lista) {
    $json_datos = json_decode($lista, true);
    $base_datos = new DB();
    try {
        $query = $base_datos->conectar()->prepare(
            "UPDATE productos
                SET nombre_producto = :nombre_producto,
                    descripcion = :descripcion,
                    unidad_medida = :unidad_medida,
                    stock_actual = :stock_actual,
                    stock_minimo = :stock_minimo,
                    precio_unitario = :precio_unitario,
                    estado = :estado
              WHERE id_producto = :id_producto;"
        );
        $params = [
            'id_producto' => $json_datos['id_producto'],
            'nombre_producto' => $json_datos['nombre_producto'],
            'descripcion' => !empty($json_datos['descripcion']) ? $json_datos['descripcion'] : null,
            'unidad_medida' => !empty($json_datos['unidad_medida']) ? $json_datos['unidad_medida'] : null,
            'stock_actual' => isset($json_datos['stock_actual']) ? $json_datos['stock_actual'] : 0,
            'stock_minimo' => isset($json_datos['stock_minimo']) ? $json_datos['stock_minimo'] : 0,
            'precio_unitario' => $json_datos['precio_unitario'],
            'estado' => $json_datos['estado'],
        ];
        $query->execute($params);
        echo json_encode(['ok' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'msg' => $e->getMessage()]);
    }
}

function obtener_por_id($id) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT id_producto, nombre_producto, descripcion, unidad_medida, stock_actual, stock_minimo, precio_unitario, estado
           FROM productos
          WHERE id_producto = :id
          LIMIT 1;"
    );
    $query->execute(['id' => $id]);
    if ($query->rowCount()) {
        print_r(json_encode($query->fetch(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}

function eliminar($id) {
    try {
        $base_datos = new DB();
        $query = $base_datos->conectar()->prepare(
            "UPDATE productos SET estado = 'INACTIVO' WHERE id_producto = :id;"
        );
        $query->execute(['id' => $id]);
        echo json_encode(['ok' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'msg' => $e->getMessage()]);
    }
}

function buscar($texto) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT id_producto, nombre_producto, descripcion, unidad_medida, stock_actual, stock_minimo, precio_unitario, estado
           FROM productos
          WHERE CONCAT(nombre_producto, ' ', COALESCE(descripcion, ''), ' ', COALESCE(unidad_medida, ''), ' ', COALESCE(estado, ''), ' ', id_producto) LIKE :texto
       ORDER BY id_producto DESC
          LIMIT 50;"
    );
    $query->execute(['texto' => "%$texto%"]);
    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}

function leer_activos() {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT id_producto, nombre_producto
           FROM productos
          WHERE estado = 'ACTIVO'
       ORDER BY nombre_producto;"
    );
    $query->execute();
    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}
?>

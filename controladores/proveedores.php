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
        "SELECT id_proveedor, nombre_apellido, telefono, direccion, email, estado, ruc, razon_social
           FROM proveedores
       ORDER BY id_proveedor DESC;"
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
            "INSERT INTO proveedores (nombre_apellido, telefono, direccion, email, estado, ruc, razon_social)
             VALUES (:nombre_apellido, :telefono, :direccion, :email, :estado, :ruc, :razon_social);"
        );
        $params = [
            'nombre_apellido' => $json_datos['nombre_apellido'],
            'telefono' => !empty($json_datos['telefono']) ? $json_datos['telefono'] : null,
            'direccion' => !empty($json_datos['direccion']) ? $json_datos['direccion'] : null,
            'email' => !empty($json_datos['email']) ? $json_datos['email'] : null,
            'estado' => $json_datos['estado'],
            'ruc' => $json_datos['ruc'],
            'razon_social' => $json_datos['razon_social'],
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
            "UPDATE proveedores
                SET nombre_apellido = :nombre_apellido,
                    telefono = :telefono,
                    direccion = :direccion,
                    email = :email,
                    estado = :estado,
                    ruc = :ruc,
                    razon_social = :razon_social
              WHERE id_proveedor = :id_proveedor;"
        );
        $params = [
            'id_proveedor' => $json_datos['id_proveedor'],
            'nombre_apellido' => $json_datos['nombre_apellido'],
            'telefono' => !empty($json_datos['telefono']) ? $json_datos['telefono'] : null,
            'direccion' => !empty($json_datos['direccion']) ? $json_datos['direccion'] : null,
            'email' => !empty($json_datos['email']) ? $json_datos['email'] : null,
            'estado' => $json_datos['estado'],
            'ruc' => $json_datos['ruc'],
            'razon_social' => $json_datos['razon_social'],
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
        "SELECT id_proveedor, nombre_apellido, telefono, direccion, email, estado, ruc, razon_social
           FROM proveedores
          WHERE id_proveedor = :id
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
            "UPDATE proveedores SET estado = 'INACTIVO' WHERE id_proveedor = :id;"
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
        "SELECT id_proveedor, nombre_apellido, telefono, direccion, email, estado, ruc, razon_social
           FROM proveedores
          WHERE CONCAT(nombre_apellido, ' ', COALESCE(telefono, ''), ' ', COALESCE(direccion, ''), ' ', COALESCE(email, ''), ' ', COALESCE(estado, ''), ' ', COALESCE(ruc, ''), ' ', COALESCE(razon_social, '')) LIKE :texto
       ORDER BY id_proveedor DESC
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
        "SELECT id_proveedor, nombre_apellido
           FROM proveedores
          WHERE estado = 'ACTIVO'
       ORDER BY nombre_apellido;"
    );
    $query->execute();
    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}
?>

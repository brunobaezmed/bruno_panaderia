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
        "SELECT id_cliente, nombre_cliente, telefono, direccion, email, estado
           FROM clientes
       ORDER BY id_cliente DESC;"
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
    $query = $base_datos->conectar()->prepare(
        "INSERT INTO clientes (nombre_cliente, telefono, direccion, email, estado)
         VALUES (:nombre_cliente, :telefono, :direccion, :email, :estado);"
    );
    $params = [
        'nombre_cliente' => $json_datos['nombre_cliente'],
        'telefono' => !empty($json_datos['telefono']) ? $json_datos['telefono'] : null,
        'direccion' => !empty($json_datos['direccion']) ? $json_datos['direccion'] : null,
        'email' => !empty($json_datos['email']) ? $json_datos['email'] : null,
        'estado' => $json_datos['estado'],
    ];
    $query->execute($params);
}

function actualizar($lista) {
    $json_datos = json_decode($lista, true);
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "UPDATE clientes
            SET nombre_cliente = :nombre_cliente,
                telefono = :telefono,
                direccion = :direccion,
                email = :email,
                estado = :estado
          WHERE id_cliente = :id_cliente;"
    );
    $params = [
        'id_cliente' => $json_datos['id_cliente'],
        'nombre_cliente' => $json_datos['nombre_cliente'],
        'telefono' => !empty($json_datos['telefono']) ? $json_datos['telefono'] : null,
        'direccion' => !empty($json_datos['direccion']) ? $json_datos['direccion'] : null,
        'email' => !empty($json_datos['email']) ? $json_datos['email'] : null,
        'estado' => $json_datos['estado'],
    ];
    $query->execute($params);
}

function obtener_por_id($id) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT id_cliente, nombre_cliente, telefono, direccion, email, estado
           FROM clientes
          WHERE id_cliente = :id
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
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "UPDATE clientes SET estado = 'INACTIVO' WHERE id_cliente = :id;"
    );
    $query->execute(['id' => $id]);
}

function buscar($texto) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT id_cliente, nombre_cliente, telefono, direccion, email, estado
           FROM clientes
          WHERE CONCAT(nombre_cliente, ' ', COALESCE(telefono, ''), ' ', COALESCE(direccion, ''), ' ', COALESCE(email, ''), ' ', COALESCE(estado, ''), ' ', id_cliente) LIKE :texto
       ORDER BY id_cliente DESC
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
        "SELECT id_cliente, nombre_cliente
           FROM clientes
          WHERE estado = 'ACTIVO'
       ORDER BY nombre_cliente;"
    );
    $query->execute();
    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}
?>

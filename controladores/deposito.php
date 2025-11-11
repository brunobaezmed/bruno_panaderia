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
        "SELECT id_deposito, nombre_deposito, ubicacion, estado
           FROM depositos
       ORDER BY id_deposito DESC;"
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
        "INSERT INTO depositos (nombre_deposito, ubicacion, estado)
         VALUES (:nombre_deposito, :ubicacion, :estado);"
    );
    $params = [
        'nombre_deposito' => $json_datos['nombre_deposito'],
        'ubicacion' => !empty($json_datos['ubicacion']) ? $json_datos['ubicacion'] : null,
        'estado' => $json_datos['estado'],
    ];
    $query->execute($params);
}

function actualizar($lista) {
    $json_datos = json_decode($lista, true);
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "UPDATE depositos
            SET nombre_deposito = :nombre_deposito,
                ubicacion = :ubicacion,
                estado = :estado
          WHERE id_deposito = :id_deposito;"
    );
    $params = [
        'id_deposito' => $json_datos['id_deposito'],
        'nombre_deposito' => $json_datos['nombre_deposito'],
        'ubicacion' => !empty($json_datos['ubicacion']) ? $json_datos['ubicacion'] : null,
        'estado' => $json_datos['estado'],
    ];
    $query->execute($params);
}

function obtener_por_id($id) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT id_deposito, nombre_deposito, ubicacion, estado
           FROM depositos
          WHERE id_deposito = :id
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
        "UPDATE depositos SET estado = 'INACTIVO' WHERE id_deposito = :id;"
    );
    $query->execute(['id' => $id]);
}

function buscar($texto) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT id_deposito, nombre_deposito, ubicacion, estado
           FROM depositos
          WHERE CONCAT(nombre_deposito, ' ', COALESCE(ubicacion, ''), ' ', COALESCE(estado, ''), ' ', id_deposito) LIKE :texto
       ORDER BY id_deposito DESC
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
        "SELECT id_deposito, nombre_deposito
           FROM depositos
          WHERE estado = 'ACTIVO'
       ORDER BY nombre_deposito;"
    );
    $query->execute();
    if ($query->rowCount()) {
        print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ)));
    } else {
        echo '0';
    }
}
?>

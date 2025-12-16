<?php
require_once '../conexion/db.php';

if (isset($_POST['listar'])) { listar(); }
if (isset($_POST['guardar'])) { guardar($_POST['guardar']); }
if (isset($_POST['obtener'])) { obtener($_POST['obtener']); }
if (isset($_POST['obtener_detalle'])) { obtener_detalle($_POST['obtener_detalle']); }
if (isset($_POST['anular'])) { anular($_POST['anular']); }
if (isset($_POST['buscar'])) { buscar($_POST['buscar']); }

function listar() {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT a.id_ajuste, d.nombre_deposito, a.fecha_ajuste, a.tipo_ajuste, a.motivo, a.responsable, a.estado
           FROM ajustes_stock a
           INNER JOIN depositos d ON a.id_deposito = d.id_deposito
       ORDER BY a.id_ajuste DESC;"
    );
    $query->execute();
    if ($query->rowCount()) { print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ))); } 
    else { echo '0'; }
}

function guardar($lista) {
    $json_datos = json_decode($lista, true);
    $base_datos = new DB();
    $pdo = null;
    try {
        $pdo = $base_datos->conectar();
        $pdo->beginTransaction();

        $query_cabecera = $pdo->prepare(
            "INSERT INTO ajustes_stock (id_deposito, fecha_ajuste, tipo_ajuste, motivo, responsable, estado)
             VALUES (:id_deposito, :fecha_ajuste, :tipo_ajuste, :motivo, :responsable, :estado);"
        );
        $query_cabecera->execute([
            'id_deposito' => $json_datos['id_deposito'],
            'fecha_ajuste' => $json_datos['fecha_ajuste'],
            'tipo_ajuste' => $json_datos['tipo_ajuste'],
            'motivo' => !empty($json_datos['motivo']) ? $json_datos['motivo'] : null,
            'responsable' => !empty($json_datos['responsable']) ? $json_datos['responsable'] : null,
            'estado' => 'ACTIVO',
        ]);

        $id_ajuste = $pdo->lastInsertId();

        if (!empty($json_datos['detalles']) && is_array($json_datos['detalles'])) {
            $query_detalle = $pdo->prepare(
                "INSERT INTO detalle_ajuste (id_ajuste, id_producto, cantidad)
                 VALUES (:id_ajuste, :id_producto, :cantidad);"
            );
            foreach ($json_datos['detalles'] as $detalle) {
                $query_detalle->execute([
                    'id_ajuste' => $id_ajuste,
                    'id_producto' => $detalle['id_producto'],
                    'cantidad' => $detalle['cantidad'],
                ]);
            }
        }
        $pdo->commit();
        echo json_encode(['ok' => true, 'id' => $id_ajuste]);
    } catch (Exception $e) {
        if ($pdo && $pdo->inTransaction()) $pdo->rollBack();
        echo json_encode(['ok' => false, 'msg' => 'Error: ' . $e->getMessage()]);
    }
}

function obtener($id) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT a.id_ajuste, a.id_deposito, d.nombre_deposito, a.fecha_ajuste, a.tipo_ajuste, a.motivo, a.responsable, a.estado
           FROM ajustes_stock a
           INNER JOIN depositos d ON a.id_deposito = d.id_deposito
          WHERE a.id_ajuste = :id
          LIMIT 1;"
    );
    $query->execute(['id' => $id]);
    if ($query->rowCount()) { print_r(json_encode($query->fetch(PDO::FETCH_OBJ))); } 
    else { echo '0'; }
}

function obtener_detalle($id_ajuste) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT da.id_detalle_ajuste AS id_detalle, da.id_ajuste, da.id_producto, p.nombre_producto, da.cantidad
           FROM detalle_ajuste da
           INNER JOIN productos p ON da.id_producto = p.id_producto
          WHERE da.id_ajuste = :id_ajuste
       ORDER BY da.id_detalle_ajuste;"
    );
    $query->execute(['id_ajuste' => $id_ajuste]);
    if ($query->rowCount()) { print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ))); } 
    else { echo '0'; }
}

function anular($id) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "UPDATE ajustes_stock SET estado = 'ANULADO' WHERE id_ajuste = :id;"
    );
    $query->execute(['id' => $id]);
}

function buscar($texto) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT a.id_ajuste, d.nombre_deposito, a.fecha_ajuste, a.tipo_ajuste, a.motivo, a.responsable, a.estado
           FROM ajustes_stock a
           INNER JOIN depositos d ON a.id_deposito = d.id_deposito
          WHERE CONCAT(a.id_ajuste, ' ', d.nombre_deposito, ' ', a.tipo_ajuste, ' ', a.fecha_ajuste) LIKE :texto
       ORDER BY a.id_ajuste DESC
          LIMIT 50;"
    );
    $query->execute(['texto' => "%$texto%"]);
    if ($query->rowCount()) { print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ))); } 
    else { echo '0'; }
}
?>

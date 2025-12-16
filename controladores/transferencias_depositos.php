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
        "SELECT t.id_transferencia, do.nombre_deposito AS deposito_origen, dd.nombre_deposito AS deposito_destino, t.fecha_transferencia, t.observacion
           FROM transferencias t
           INNER JOIN depositos do ON t.id_origen = do.id_deposito
           INNER JOIN depositos dd ON t.id_destino = dd.id_deposito
       ORDER BY t.id_transferencia DESC;"
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
            "INSERT INTO transferencias (id_origen, id_destino, fecha_transferencia, observacion)
             VALUES (:id_origen, :id_destino, :fecha_transferencia, :observacion);"
        );
        $query_cabecera->execute([
            'id_origen' => $json_datos['id_origen'],
            'id_destino' => $json_datos['id_destino'],
            'fecha_transferencia' => $json_datos['fecha_transferencia'],
            'observacion' => !empty($json_datos['observacion']) ? $json_datos['observacion'] : null,
        ]);

        $id_transferencia = $pdo->lastInsertId();

        if (!empty($json_datos['detalles']) && is_array($json_datos['detalles'])) {
            $query_detalle = $pdo->prepare(
                "INSERT INTO detalle_transferencia (id_transferencia, id_producto, cantidad)
                 VALUES (:id_transferencia, :id_producto, :cantidad);"
            );
            foreach ($json_datos['detalles'] as $detalle) {
                $query_detalle->execute([
                    'id_transferencia' => $id_transferencia,
                    'id_producto' => $detalle['id_producto'],
                    'cantidad' => $detalle['cantidad'],
                ]);
            }
        }
        $pdo->commit();
        echo json_encode(['ok' => true, 'id' => $id_transferencia]);
    } catch (Exception $e) {
        if ($pdo && $pdo->inTransaction()) $pdo->rollBack();
        echo json_encode(['ok' => false, 'msg' => 'Error: ' . $e->getMessage()]);
    }
}

function obtener($id) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT t.id_transferencia, t.id_origen, t.id_destino, do.nombre_deposito AS deposito_origen, dd.nombre_deposito AS deposito_destino, t.fecha_transferencia, t.observacion
           FROM transferencias t
           INNER JOIN depositos do ON t.id_origen = do.id_deposito
           INNER JOIN depositos dd ON t.id_destino = dd.id_deposito
          WHERE t.id_transferencia = :id
          LIMIT 1;"
    );
    $query->execute(['id' => $id]);
    if ($query->rowCount()) { print_r(json_encode($query->fetch(PDO::FETCH_OBJ))); } 
    else { echo '0'; }
}

function obtener_detalle($id_transferencia) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT dt.id_detalle_transferencia AS id_detalle, dt.id_transferencia, dt.id_producto, pr.nombre_producto, dt.cantidad
           FROM detalle_transferencia dt
           INNER JOIN productos pr ON dt.id_producto = pr.id_producto
          WHERE dt.id_transferencia = :id_transferencia
       ORDER BY dt.id_detalle_transferencia;"
    );
    $query->execute(['id_transferencia' => $id_transferencia]);
    if ($query->rowCount()) { print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ))); } 
    else { echo '0'; }
}

function anular($id) {
    // No hay estado en `transferencias`, solo se pueden eliminar lógicamente.
    // Por ahora, se deja como placeholder. En producción, añadir columna `estado`.
}

function buscar($texto) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT t.id_transferencia, do.nombre_deposito AS deposito_origen, dd.nombre_deposito AS deposito_destino, t.fecha_transferencia, t.observacion
           FROM transferencias t
           INNER JOIN depositos do ON t.id_origen = do.id_deposito
           INNER JOIN depositos dd ON t.id_destino = dd.id_deposito
          WHERE CONCAT(t.id_transferencia, ' ', do.nombre_deposito, ' ', dd.nombre_deposito, ' ', t.fecha_transferencia) LIKE :texto
       ORDER BY t.id_transferencia DESC
          LIMIT 50;"
    );
    $query->execute(['texto' => "%$texto%"]);
    if ($query->rowCount()) { print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ))); } 
    else { echo '0'; }
}
?>

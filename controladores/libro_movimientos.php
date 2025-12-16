<?php
require_once '../conexion/db.php';

if (isset($_POST['listar'])) { listar(); }
if (isset($_POST['listar_filtros'])) { listar_filtros($_POST); }
if (isset($_POST['buscar'])) { buscar($_POST['buscar']); }

function listar() {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT lm.id_movimiento, lm.fecha, lm.tipo_movimiento, p.nombre_producto, d.nombre_deposito, lm.cantidad, lm.referencia, lm.observacion
           FROM libro_movimientos lm
           INNER JOIN productos p ON lm.id_producto = p.id_producto
           LEFT JOIN depositos d ON lm.id_deposito = d.id_deposito
       ORDER BY lm.id_movimiento DESC
          LIMIT 1000;"
    );
    $query->execute();
    if ($query->rowCount()) { print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ))); } 
    else { echo '0'; }
}

function listar_filtros($params) {
    $base_datos = new DB();
    $tipo_movimiento = !empty($params['tipo_movimiento']) ? $params['tipo_movimiento'] : null;
    $id_deposito = !empty($params['id_deposito']) ? $params['id_deposito'] : null;
    $id_producto = !empty($params['id_producto']) ? $params['id_producto'] : null;
    $fecha_desde = !empty($params['fecha_desde']) ? $params['fecha_desde'] : null;
    $fecha_hasta = !empty($params['fecha_hasta']) ? $params['fecha_hasta'] : null;

    $where_conditions = [];
    $params_array = [];

    if ($tipo_movimiento) {
        $where_conditions[] = "lm.tipo_movimiento = :tipo_movimiento";
        $params_array['tipo_movimiento'] = $tipo_movimiento;
    }
    if ($id_deposito) {
        $where_conditions[] = "lm.id_deposito = :id_deposito";
        $params_array['id_deposito'] = $id_deposito;
    }
    if ($id_producto) {
        $where_conditions[] = "lm.id_producto = :id_producto";
        $params_array['id_producto'] = $id_producto;
    }
    if ($fecha_desde) {
        $where_conditions[] = "lm.fecha >= :fecha_desde";
        $params_array['fecha_desde'] = $fecha_desde;
    }
    if ($fecha_hasta) {
        $where_conditions[] = "lm.fecha <= :fecha_hasta";
        $params_array['fecha_hasta'] = $fecha_hasta;
    }

    $where_clause = !empty($where_conditions) ? "WHERE " . implode(" AND ", $where_conditions) : "";

    $sql = "SELECT lm.id_movimiento, lm.fecha, lm.tipo_movimiento, p.nombre_producto, d.nombre_deposito, lm.cantidad, lm.referencia, lm.observacion
               FROM libro_movimientos lm
               INNER JOIN productos p ON lm.id_producto = p.id_producto
               LEFT JOIN depositos d ON lm.id_deposito = d.id_deposito
               $where_clause
           ORDER BY lm.id_movimiento DESC
              LIMIT 2000;";

    $query = $base_datos->conectar()->prepare($sql);
    $query->execute($params_array);
    
    if ($query->rowCount()) { print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ))); } 
    else { echo '0'; }
}

function buscar($texto) {
    $base_datos = new DB();
    $query = $base_datos->conectar()->prepare(
        "SELECT lm.id_movimiento, lm.fecha, lm.tipo_movimiento, p.nombre_producto, d.nombre_deposito, lm.cantidad, lm.referencia, lm.observacion
           FROM libro_movimientos lm
           INNER JOIN productos p ON lm.id_producto = p.id_producto
           LEFT JOIN depositos d ON lm.id_deposito = d.id_deposito
          WHERE CONCAT(lm.id_movimiento, ' ', lm.tipo_movimiento, ' ', p.nombre_producto, ' ', COALESCE(lm.referencia, ''), ' ', COALESCE(lm.observacion, '')) LIKE :texto
       ORDER BY lm.id_movimiento DESC
          LIMIT 1000;"
    );
    $query->execute(['texto' => "%$texto%"]);
    if ($query->rowCount()) { print_r(json_encode($query->fetchAll(PDO::FETCH_OBJ))); } 
    else { echo '0'; }
}
?>

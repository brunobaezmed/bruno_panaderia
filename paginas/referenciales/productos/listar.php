<?php
// Parcial que renderiza la tabla de productos
require_once __DIR__ . '/../../../conexion/db.php';
$productos = [];
$errorProd = null;
try {
    $db = new DB();
    $pdo = $db->conectar();
    $stmt = $pdo->query("SELECT id_producto, nombre_producto, descripcion, unidad_medida, stock_actual, stock_minimo, precio_unitario, estado FROM productos ORDER BY id_producto ASC");
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $errorProd = $e->getMessage();
}
?>

<div class="container-fluid card" style="padding: 30px;">
    <div class="row">
        <div class="col-md-8">
            <h3>Lista de Productos</h3>
        </div>
        <div class="col-md-4 text-end">
            <button class="btn btn-primary" onclick="mostrarAgregarProducto(); return false;"><i class="fa fa-plus"></i> Agregar</button>
        </div>
        <div class="col-md-12">
            <hr>
        </div>
        <div class="col-md-12">
            <label for="b_productos">Búsqueda</label>
            <input type="text" class="form-control" id="b_productos" placeholder="Ingrese datos para buscar">
        </div>
        <div class="col-md-12" style="margin-top: 30px;">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Unidad</th>
                            <th>Stock</th>
                            <th>Stock Mínimo</th>
                            <th>Precio</th>
                            <th>Estado</th>
                            <th class="text-end">Operaciones</th>
                        </tr>
                    </thead>
                    <tbody id="productos_tb">
                    <?php if ($errorProd): ?>
                        <tr><td colspan="9" class="text-center text-danger">Error cargando productos: <?php echo htmlspecialchars($errorProd); ?></td></tr>
                    <?php elseif (empty($productos)): ?>
                        <tr><td colspan="9" class="text-center">No hay registros</td></tr>
                    <?php else: ?>
                        <?php foreach ($productos as $item): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($item['id_producto']); ?></td>
                                <td><?php echo htmlspecialchars($item['nombre_producto']); ?></td>
                                <td><?php echo htmlspecialchars($item['descripcion'] ?? ''); ?></td>
                                <td><?php echo htmlspecialchars($item['unidad_medida'] ?? ''); ?></td>
                                <td><?php echo htmlspecialchars($item['stock_actual']); ?></td>
                                <td><?php echo htmlspecialchars($item['stock_minimo']); ?></td>
                                <td><?php echo htmlspecialchars($item['precio_unitario']); ?></td>
                                <td><span class="badge bg-<?php echo ($item['estado'] === 'ACTIVO') ? 'success' : 'danger'; ?>"><?php echo htmlspecialchars($item['estado']); ?></span></td>
                                <td class="text-end">
                                    <button class="btn btn-warning editar-producto"><i data-feather="edit"></i></button>
                                    <button class="btn btn-danger eliminar-producto"><i data-feather="trash"></i></button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php
// Parcial que renderiza la tabla de proveedores (se puede obtener por AJAX con dameContenido)
require_once __DIR__ . '/../../../conexion/db.php';
$proveedores = [];
$errorProv = null;
try {
    $db = new DB();
    $pdo = $db->conectar();
    $stmt = $pdo->query("SELECT id_proveedor, nombre_apellido, telefono, direccion, email, estado, ruc, razon_social FROM proveedores ORDER BY id_proveedor ASC");
    $proveedores = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $errorProv = $e->getMessage();
}
?>

<div class="container-fluid card" style="padding: 30px;">
    <div class="row">
        <div class="col-md-8">
            <h3>Lista de Proveedores</h3>
        </div>
        <div class="col-md-4 text-end">
            <button class="btn btn-primary" onclick="mostrarAgregarProveedor(); return false;"><i class="fa fa-plus"></i> Agregar</button>
        </div>
        <div class="col-md-12">
            <hr>
        </div>
        <div class="col-md-12">
            <label for="b_proveedores">Búsqueda</label>
            <input type="text" class="form-control" id="b_proveedores" placeholder="Ingrese datos para buscar">
        </div>
        <div class="col-md-12" style="margin-top: 30px;">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>RUC</th>
                            <th>Razón Social</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Dirección</th>
                            <th>Estado</th>
                            <th class="text-end">Operaciones</th>
                        </tr>
                    </thead>
                    <tbody id="proveedores_tb">
                    <?php if ($errorProv): ?>
                        <tr><td colspan="9" class="text-center text-danger">Error cargando proveedores: <?php echo htmlspecialchars($errorProv); ?></td></tr>
                    <?php elseif (empty($proveedores)): ?>
                        <tr><td colspan="9" class="text-center">No hay registros</td></tr>
                    <?php else: ?>
                        <?php foreach ($proveedores as $item): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($item['id_proveedor']); ?></td>
                                <td><?php echo htmlspecialchars($item['nombre_apellido']); ?></td>
                                <td><?php echo htmlspecialchars($item['ruc']); ?></td>
                                <td><?php echo htmlspecialchars($item['razon_social']); ?></td>
                                <td><?php echo htmlspecialchars($item['telefono'] ?? ''); ?></td>
                                <td><?php echo htmlspecialchars($item['email'] ?? ''); ?></td>
                                <td><?php echo htmlspecialchars($item['direccion'] ?? ''); ?></td>
                                <td><span class="badge bg-<?php echo ($item['estado'] === 'ACTIVO') ? 'success' : 'danger'; ?>"><?php echo htmlspecialchars($item['estado']); ?></span></td>
                                <td class="text-end">
                                    <button class="btn btn-warning editar-proveedor"><i data-feather="edit"></i></button>
                                    <button class="btn btn-danger eliminar-proveedor"><i data-feather="trash"></i></button>
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

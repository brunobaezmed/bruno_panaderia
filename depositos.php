<?php
// Página independiente para listar depósitos (renderizado por servidor)
require_once __DIR__ . '/conexion/db.php';
$depositos = [];
$errorDep = null;
try {
    $db = new DB();
    $pdo = $db->conectar();
    $stmt = $pdo->query("SELECT id_deposito, nombre_deposito, ubicacion, estado FROM depositos ORDER BY id_deposito ASC");
    $depositos = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $errorDep = $e->getMessage();
}
?>

<div class="container-fluid card" style="padding: 30px;">
    <div class="row">
        <div class="col-md-8">
            <h3>Lista de Depósitos (Página independiente)</h3>
        </div>
        <div class="col-md-4 text-end">
            <button class="btn btn-primary" onclick="mostrarAgregarDeposito(); return false;"><i class="fa fa-plus"></i> Agregar</button>
        </div>
        <div class="col-md-12">
            <hr>
        </div>
        <div class="col-md-12">
            <label for="b_deposito">Búsqueda</label>
            <input type="text" class="form-control" id="b_deposito" placeholder="Ingrese datos para buscar">
        </div>
        <div class="col-md-12" style="margin-top: 30px;">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Ubicación</th>
                            <th>Estado</th>
                            <th class="text-end">Operaciones</th>
                        </tr>
                    </thead>
                    <tbody id="deposito_tb">
                    <?php if ($errorDep): ?>
                        <tr><td colspan="5" class="text-center text-danger">Error cargando depósitos: <?php echo htmlspecialchars($errorDep); ?></td></tr>
                    <?php elseif (empty($depositos)): ?>
                        <tr><td colspan="5" class="text-center">No hay registros</td></tr>
                    <?php else: ?>
                        <?php foreach ($depositos as $item): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($item['id_deposito']); ?></td>
                                <td><?php echo htmlspecialchars($item['nombre_deposito']); ?></td>
                                <td><?php echo htmlspecialchars($item['ubicacion'] ?? ''); ?></td>
                                <td><span class="badge bg-<?php echo ($item['estado'] === 'ACTIVO') ? 'success' : 'danger'; ?>"><?php echo htmlspecialchars($item['estado']); ?></span></td>
                                <td class="text-end">
                                    <button class="btn btn-warning editar-deposito"><i data-feather="edit"></i></button>
                                    <button class="btn btn-danger eliminar-deposito"><i data-feather="trash"></i></button>
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

<div class="card">
    <div class="card-body">
        <div class="row mb-3">
            <div class="col-md-6">
                <h5>Listado de Ajustes de Stock</h5>
            </div>
            <div class="col-md-6 text-end">
                <button class="btn btn-primary" onclick="mostrarAgregarAjuste();">Nuevo Ajuste</button>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Depósito</th>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Motivo</th>
                        <th>Estado</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody id="ajustes_tb"></tbody>
            </table>
        </div>
    </div>
</div>

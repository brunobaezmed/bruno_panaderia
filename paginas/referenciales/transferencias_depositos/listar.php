<div class="card">
    <div class="card-body">
        <div class="row mb-3">
            <div class="col-md-6">
                <h5>Listado de Transferencias entre Depósitos</h5>
            </div>
            <div class="col-md-6 text-end">
                <button class="btn btn-primary" onclick="mostrarAgregarTransferencia();">Nueva Transferencia</button>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Origen</th>
                        <th>Destino</th>
                        <th>Fecha</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody id="transferencias_tb"></tbody>
            </table>
        </div>
    </div>
</div>

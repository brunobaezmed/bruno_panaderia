<div class="card">
    <div class="card-body">
        <div class="row mb-3">
            <div class="col-md-6">
                <h5>Listado de Egresos por Ventas</h5>
            </div>
            <div class="col-md-6 text-end">
                <button class="btn btn-primary" onclick="mostrarAgregarEgreso();">Nuevo Egreso</button>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody id="egresos_tb"></tbody>
            </table>
        </div>
    </div>
</div>

<div class="container-fluid card" style="padding: 30px;">
    <div class="row">
        <div class="col-md-8">
            <h3>Ingresos por Compra</h3>
        </div>
        <div class="col-md-4 text-end">
            <button class="btn btn-primary" onclick="mostrarAgregarIngreso(); return false;"><i class="fa fa-plus"></i> Nuevo Ingreso</button>
        </div>
        <div class="col-md-12">
            <hr>
        </div>
        <div class="col-md-12">
            <label for="b_ingreso">Búsqueda</label>
            <input type="text" class="form-control" id="b_ingreso" placeholder="Ingrese datos para buscar (ID, Proveedor, Fecha, Estado)">
        </div>
        <div class="col-md-12" style="margin-top: 30px;">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Proveedor</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th class="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="ingresos_tb"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>

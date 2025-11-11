<div class="container-fluid card" style="padding: 30px;">
    <div class="row">
        <div class="col-md-8">
            <h3>Lista de Depósitos</h3>
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
                    <tbody id="deposito_tb"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>
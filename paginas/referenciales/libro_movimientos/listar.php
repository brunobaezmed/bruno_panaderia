<div class="card">
    <div class="card-body">
        <h5 class="mb-3">Libro de Movimientos</h5>
        
        <div class="row mb-3">
            <div class="col-md-2">
                <label>Tipo de Movimiento</label>
                <select id="filtro_tipo" class="form-control form-control-sm">
                    <option value="">Todos</option>
                    <option value="Ingreso">Ingreso</option>
                    <option value="Egreso">Egreso</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Ajuste">Ajuste</option>
                </select>
            </div>
            <div class="col-md-2">
                <label>Depósito</label>
                <select id="filtro_deposito" class="form-control form-control-sm"></select>
            </div>
            <div class="col-md-2">
                <label>Producto</label>
                <select id="filtro_producto" class="form-control form-control-sm"></select>
            </div>
            <div class="col-md-2">
                <label>Desde</label>
                <input type="date" id="filtro_fecha_desde" class="form-control form-control-sm" />
            </div>
            <div class="col-md-2">
                <label>Hasta</label>
                <input type="date" id="filtro_fecha_hasta" class="form-control form-control-sm" />
            </div>
            <div class="col-md-2 d-flex align-items-end">
                <button class="btn btn-primary btn-sm w-100" onclick="aplicarFiltros();">Filtrar</button>
                <button class="btn btn-secondary btn-sm w-100 ms-1" onclick="limpiarFiltros();">Limpiar</button>
            </div>
        </div>

        <div class="mb-3">
            <input type="text" id="buscar_movimiento" class="form-control" placeholder="Buscar por ID, tipo, producto, referencia..." onkeyup="buscarMovimiento()" />
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Producto</th>
                        <th>Depósito</th>
                        <th>Cantidad</th>
                        <th>Referencia</th>
                        <th>Observación</th>
                    </tr>
                </thead>
                <tbody id="movimientos_tb"></tbody>
            </table>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-body">
        <h5>Nuevo Ajuste de Stock</h5>
        <div class="row mb-3">
            <div class="col-md-4">
                <label>Depósito</label>
                <select id="ajuste_deposito" class="form-control"></select>
            </div>
            <div class="col-md-4">
                <label>Fecha</label>
                <input type="date" id="ajuste_fecha" class="form-control" />
            </div>
            <div class="col-md-4">
                <label>Tipo de Ajuste</label>
                <select id="ajuste_tipo" class="form-control">
                    <option value="">Selecciona tipo</option>
                    <option value="Aumento">Aumento</option>
                    <option value="Disminución">Disminución</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="col-md-8">
                <div class="input-group mb-3">
                    <select id="ajuste_producto" class="form-control"></select>
                    <input type="number" id="ajuste_cantidad" class="form-control" placeholder="Cantidad">
                    <button class="btn btn-secondary" type="button" onclick="agregarDetalleAjuste();">Agregar</button>
                </div>
                <table class="table">
                    <thead>
                        <tr><th>Producto</th><th>Cantidad</th><th></th></tr>
                    </thead>
                    <tbody id="detalle_ajustes_tb"></tbody>
                </table>
            </div>
            <div class="col-md-4">
                <label>Motivo</label>
                <textarea id="ajuste_motivo" class="form-control" rows="3"></textarea>
                <label class="mt-2">Responsable</label>
                <input type="text" id="ajuste_responsable" class="form-control" placeholder="Nombre del responsable">
                <div class="mt-3">
                    <button class="btn btn-primary" onclick="guardarAjuste();">Guardar</button>
                    <button class="btn btn-secondary" onclick="cancelarAjuste();">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</div>

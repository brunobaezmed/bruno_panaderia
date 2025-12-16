<div class="card">
    <div class="card-body">
        <h5>Nueva Transferencia entre Depósitos</h5>
        <div class="row mb-3">
            <div class="col-md-4">
                <label>Depósito Origen</label>
                <select id="transferencia_origen" class="form-control"></select>
            </div>
            <div class="col-md-4">
                <label>Depósito Destino</label>
                <select id="transferencia_destino" class="form-control"></select>
            </div>
            <div class="col-md-4">
                <label>Fecha</label>
                <input type="date" id="transferencia_fecha" class="form-control" />
            </div>
        </div>

        <div class="row">
            <div class="col-md-8">
                <div class="input-group mb-3">
                    <select id="transferencia_producto" class="form-control"></select>
                    <input type="number" id="transferencia_cantidad" class="form-control" placeholder="Cantidad">
                    <button class="btn btn-secondary" type="button" onclick="agregarDetalleTransferencia();">Agregar</button>
                </div>
                <table class="table">
                    <thead>
                        <tr><th>Producto</th><th>Cantidad</th><th></th></tr>
                    </thead>
                    <tbody id="detalle_transferencias_tb"></tbody>
                </table>
            </div>
            <div class="col-md-4">
                <label>Observación</label>
                <textarea id="transferencia_observacion" class="form-control" rows="6"></textarea>
                <div class="mt-3">
                    <button class="btn btn-primary" onclick="guardarTransferencia();">Guardar</button>
                    <button class="btn btn-secondary" onclick="cancelarTransferencia();">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</div>

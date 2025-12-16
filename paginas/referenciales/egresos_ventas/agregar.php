<div class="card">
    <div class="card-body">
        <h5>Nuevo Egreso por Venta</h5>
        <div class="row mb-3">
            <div class="col-md-4">
                <label>Cliente</label>
                <select id="egreso_cliente" class="form-control"></select>
            </div>
            <div class="col-md-4">
                <label>Fecha</label>
                <input type="date" id="egreso_fecha" class="form-control" />
            </div>
            <div class="col-md-4">
                <label>Total</label>
                <input type="text" id="egreso_total" class="form-control" readonly />
            </div>
        </div>

        <div class="row">
            <div class="col-md-8">
                <div class="input-group mb-3">
                    <select id="egreso_producto" class="form-control"></select>
                    <input type="number" id="egreso_cantidad" class="form-control" placeholder="Cantidad">
                    <input type="number" id="egreso_precio" class="form-control" placeholder="Precio Unitario">
                    <button class="btn btn-secondary" type="button" onclick="agregarDetalleEgreso();">Agregar</button>
                </div>
                <table class="table">
                    <thead>
                        <tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th><th></th></tr>
                    </thead>
                    <tbody id="detalle_egresos_tb"></tbody>
                </table>
            </div>
            <div class="col-md-4">
                <label>Observación</label>
                <textarea id="egreso_observacion" class="form-control" rows="6"></textarea>
                <div class="mt-3">
                    <button class="btn btn-primary" onclick="guardarEgreso();">Guardar</button>
                    <button class="btn btn-secondary" onclick="cancelarEgreso();">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</div>

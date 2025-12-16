<div class="container-fluid card" style="padding: 30px;">
    <div class="row g-3">
        <div class="col-md-12">
            <h3>Nuevo Ingreso por Compra</h3>
            <hr>
        </div>

        <!-- CABECERA -->
        <div class="col-md-6">
            <label for="ingreso_proveedor" class="form-label">Proveedor *</label>
            <select id="ingreso_proveedor" class="form-select">
                <option value="0">Selecciona un Proveedor</option>
            </select>
        </div>

        <div class="col-md-6">
            <label for="ingreso_fecha" class="form-label">Fecha *</label>
            <input type="date" class="form-control" id="ingreso_fecha">
        </div>

        <div class="col-md-12">
            <label for="ingreso_observacion" class="form-label">Observación</label>
            <textarea id="ingreso_observacion" class="form-control" rows="2" placeholder="Ingrese observaciones..."></textarea>
        </div>

        <!-- DETALLE -->
        <div class="col-md-12">
            <h5>Detalle de Productos</h5>
            <hr>
        </div>

        <div class="col-md-4">
            <label for="ingreso_producto" class="form-label">Producto *</label>
            <select id="ingreso_producto" class="form-select">
                <option value="0">Selecciona un Producto</option>
            </select>
        </div>

        <div class="col-md-2">
            <label for="ingreso_cantidad" class="form-label">Cantidad *</label>
            <input type="number" class="form-control" id="ingreso_cantidad" placeholder="0" min="1">
        </div>

        <div class="col-md-3">
            <label for="ingreso_precio" class="form-label">Precio Unitario *</label>
            <input type="number" class="form-control" id="ingreso_precio" placeholder="0.00" step="0.01" min="0">
        </div>

        <div class="col-md-3 d-flex align-items-end">
            <button class="btn btn-success w-100" onclick="agregarDetalleIngreso(); return false;"><i class="fa fa-plus"></i> Agregar</button>
        </div>

        <!-- TABLA DETALLE -->
        <div class="col-md-12" style="margin-top: 20px;">
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                            <th class="text-end">Eliminar</th>
                        </tr>
                    </thead>
                    <tbody id="detalle_ingresos_tb"></tbody>
                </table>
            </div>
        </div>

        <!-- TOTAL -->
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-6"></div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="ingreso_total" class="form-label"><strong>Total</strong></label>
                        <input type="text" class="form-control" id="ingreso_total" value="0.00" readonly>
                    </div>
                </div>
            </div>
        </div>

        <!-- BOTONES -->
        <div class="col-md-12 text-end">
            <button class="btn btn-secondary" onclick="cancelarIngreso(); return false;">Cancelar</button>
            <button class="btn btn-primary" onclick="guardarIngreso(); return false;">Guardar Ingreso</button>
        </div>
    </div>
</div>

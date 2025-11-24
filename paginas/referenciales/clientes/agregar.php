<div class="container-fluid card" style="padding: 30px;">
    <div class="row g-3">
        <div class="col-md-12">
            <h3 id="cliente_form_titulo">Nuevo Cliente</h3>
        </div>
        <div class="col-md-12">
            <hr>
        </div>
        <input type="hidden" id="id_cliente" value="0">
        <div class="col-md-12">
            <label for="cliente_nombre" class="form-label">Nombre *</label>
            <input type="text" class="form-control" id="cliente_nombre" placeholder="Nombre del cliente">
        </div>
        <div class="col-md-6">
            <label for="cliente_telefono" class="form-label">Teléfono</label>
            <input type="text" class="form-control" id="cliente_telefono" placeholder="Teléfono">
        </div>
        <div class="col-md-6">
            <label for="cliente_email" class="form-label">Email</label>
            <input type="email" class="form-control" id="cliente_email" placeholder="Correo electrónico">
        </div>
        <div class="col-md-12">
            <label for="cliente_direccion" class="form-label">Dirección</label>
            <textarea id="cliente_direccion" class="form-control" rows="3" placeholder="Dirección del cliente"></textarea>
        </div>
        <div class="col-md-12">
            <label for="cliente_estado" class="form-label">Estado *</label>
            <select id="cliente_estado" class="form-select">
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
            </select>
        </div>
        <div class="col-md-12 text-end">
            <button class="btn btn-secondary" onclick="cancelarCliente(); return false;">Cancelar</button>
            <button class="btn btn-primary" onclick="guardarCliente(); return false;">Guardar</button>
        </div>
    </div>
</div>
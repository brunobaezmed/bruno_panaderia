<div class="container-fluid card" style="padding: 30px;">
    <div class="row g-3">
        <div class="col-md-12">
            <h3 id="proveedor_form_titulo">Nuevo Proveedor</h3>
        </div>
        <div class="col-md-12">
            <hr>
        </div>
        <input type="hidden" id="id_proveedor" value="0">
        <div class="col-md-12">
            <label for="proveedor_nombre_apellido" class="form-label">Nombre / Apellido *</label>
            <input type="text" class="form-control" id="proveedor_nombre_apellido" placeholder="Nombre completo">
        </div>
        <div class="col-md-6">
            <label for="proveedor_ruc" class="form-label">RUC *</label>
            <input type="text" class="form-control" id="proveedor_ruc" placeholder="RUC">
        </div>
        <div class="col-md-6">
            <label for="proveedor_razon_social" class="form-label">Razón Social *</label>
            <input type="text" class="form-control" id="proveedor_razon_social" placeholder="Razón social">
        </div>
        <div class="col-md-6">
            <label for="proveedor_telefono" class="form-label">Teléfono</label>
            <input type="text" class="form-control" id="proveedor_telefono" placeholder="Teléfono">
        </div>
        <div class="col-md-6">
            <label for="proveedor_email" class="form-label">Email</label>
            <input type="email" class="form-control" id="proveedor_email" placeholder="Correo electrónico">
        </div>
        <div class="col-md-12">
            <label for="proveedor_direccion" class="form-label">Dirección</label>
            <textarea id="proveedor_direccion" class="form-control" rows="3" placeholder="Dirección del proveedor"></textarea>
        </div>
        <div class="col-md-12">
            <label for="proveedor_estado" class="form-label">Estado *</label>
            <select id="proveedor_estado" class="form-select">
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
            </select>
        </div>
        <div class="col-md-12 text-end">
            <button class="btn btn-secondary" onclick="cancelarProveedor(); return false;">Cancelar</button>
            <button class="btn btn-primary" onclick="guardarProveedor(); return false;">Guardar</button>
        </div>
    </div>
</div>

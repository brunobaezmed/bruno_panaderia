<div class="container-fluid card" style="padding: 30px;">
    <div class="row g-3">
        <div class="col-md-12">
            <h3 id="deposito_form_titulo">Nuevo Depósito</h3>
        </div>
        <div class="col-md-12">
            <hr>
        </div>
        <input type="hidden" id="id_deposito" value="0">
        <div class="col-md-6">
            <label for="deposito_nombre" class="form-label">Nombre *</label>
            <input type="text" class="form-control" id="deposito_nombre" placeholder="Nombre del depósito">
        </div>
        <div class="col-md-6">
            <label for="deposito_estado" class="form-label">Estado *</label>
            <select id="deposito_estado" class="form-select">
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
            </select>
        </div>
        <div class="col-md-12">
            <label for="deposito_ubicacion" class="form-label">Ubicación</label>
            <textarea id="deposito_ubicacion" class="form-control" rows="3" placeholder="Ubicación del depósito"></textarea>
        </div>
        <div class="col-md-12 text-end">
            <button class="btn btn-secondary" onclick="cancelarDeposito(); return false;">Cancelar</button>
            <button class="btn btn-primary" onclick="guardarDeposito(); return false;">Guardar</button>
        </div>
    </div>
</div>
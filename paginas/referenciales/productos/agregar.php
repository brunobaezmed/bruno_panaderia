<div class="container-fluid card" style="padding: 30px;">
    <div class="row g-3">
        <div class="col-md-12">
            <h3 id="producto_form_titulo">Nuevo Producto</h3>
        </div>
        <div class="col-md-12">
            <hr>
        </div>
        <input type="hidden" id="id_producto" value="0">
        <div class="col-md-12">
            <label for="producto_nombre" class="form-label">Nombre *</label>
            <input type="text" class="form-control" id="producto_nombre" placeholder="Nombre del producto">
        </div>
        <div class="col-md-12">
            <label for="producto_descripcion" class="form-label">Descripción</label>
            <textarea id="producto_descripcion" class="form-control" rows="3" placeholder="Descripción"></textarea>
        </div>
        <div class="col-md-4">
            <label for="producto_unidad" class="form-label">Unidad</label>
            <input type="text" class="form-control" id="producto_unidad" placeholder="Unidad de medida">
        </div>
        <div class="col-md-2">
            <label for="producto_stock_actual" class="form-label">Stock</label>
            <input type="number" class="form-control" id="producto_stock_actual" value="0">
        </div>
        <div class="col-md-2">
            <label for="producto_stock_minimo" class="form-label">Stock Mínimo</label>
            <input type="number" class="form-control" id="producto_stock_minimo" value="10">
        </div>
        <div class="col-md-4">
            <label for="producto_precio" class="form-label">Precio Unitario *</label>
            <input type="number" class="form-control" id="producto_precio" placeholder="Precio">
        </div>
        <div class="col-md-12">
            <label for="producto_estado" class="form-label">Estado *</label>
            <select id="producto_estado" class="form-select">
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
            </select>
        </div>
        <div class="col-md-12 text-end">
            <button class="btn btn-secondary" onclick="cancelarProducto(); return false;">Cancelar</button>
            <button class="btn btn-primary" onclick="guardarProducto(); return false;">Guardar</button>
        </div>
    </div>
</div>

function mostrarAjusteStock() {
    let contenido = dameContenido("paginas/referenciales/ajuste_stock/listar.php");
    $(".contenido-principal").html(contenido);
    cargarTablaAjustes();
}

function mostrarAgregarAjuste() {
    let contenido = dameContenido("paginas/referenciales/ajuste_stock/agregar.php");
    $(".contenido-principal").html(contenido);
    cargarListaDepositos("#ajuste_deposito");
    cargarListaProductos("#ajuste_producto");
    dameFechaActual("ajuste_fecha");
}

function cargarTablaAjustes() {
    let datos = ejecutarAjax("controladores/ajuste_stock.php", "listar=1");
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='7' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_ajuste}</td>`;
            fila += `<td>${item.nombre_deposito}</td>`;
            fila += `<td>${item.fecha_ajuste}</td>`;
            fila += `<td><span class="badge bg-${item.tipo_ajuste === "Aumento" ? "success" : "danger"}">${item.tipo_ajuste}</span></td>`;
            fila += `<td>${item.motivo ? item.motivo : '-'}</td>`;
            fila += `<td><span class="badge bg-${item.estado === "ACTIVO" ? "success" : "danger"}">${item.estado}</span></td>`;
            fila += `<td class='text-end'>`;
            fila += `<button class='btn btn-info btn-sm visualizar-ajuste' title='Visualizar'><i data-feather="eye"></i></button> `;
            fila += `<button class='btn btn-warning btn-sm anular-ajuste' title='Anular'><i data-feather="x-circle"></i></button> `;
            fila += `</td>`;
            fila += `</tr>`;
        });
    }
    $("#ajustes_tb").html(fila);
    feather.replace();
}

function agregarDetalleAjuste() {
    let id_producto = $("#ajuste_producto").val();
    let cantidad = $("#ajuste_cantidad").val();
    if (id_producto === "0" || cantidad === "") {
        mensaje_dialogo_info_ERROR("Debe completar los campos de producto y cantidad", "ATENCIÓN");
        return;
    }
    cantidad = parseInt(cantidad);
    if (cantidad <= 0) {
        mensaje_dialogo_info_ERROR("Cantidad debe ser mayor a 0", "ATENCIÓN");
        return;
    }
    let fila_detalle = `
        <tr data-producto="${id_producto}">
            <td><span class="nombre-producto">${$("#ajuste_producto option:selected").text()}</span></td>
            <td><span class="cantidad-detalle">${cantidad}</span></td>
            <td class='text-end'>
                <button class='btn btn-danger btn-sm' onclick='eliminarDetalleAjuste(this)'><i data-feather="trash"></i></button>
            </td>
        </tr>
    `;
    $("#detalle_ajustes_tb").append(fila_detalle);
    $("#ajuste_producto").val("0");
    $("#ajuste_cantidad").val("");
    feather.replace();
}

function eliminarDetalleAjuste(btn) {
    $(btn).closest("tr").remove();
}

function guardarAjuste() {
    if ($("#ajuste_deposito").val() === "0") { mensaje_dialogo_info_ERROR("Debe seleccionar un depósito", "ATENCIÓN"); return; }
    if ($("#ajuste_fecha").val() === "") { mensaje_dialogo_info_ERROR("Debe ingresar la fecha", "ATENCIÓN"); return; }
    if ($("#ajuste_tipo").val() === "") { mensaje_dialogo_info_ERROR("Debe seleccionar el tipo de ajuste", "ATENCIÓN"); return; }
    if ($("#detalle_ajustes_tb tr").length === 0) { mensaje_dialogo_info_ERROR("Debe agregar al menos un producto", "ATENCIÓN"); return; }

    let detalles = [];
    $("#detalle_ajustes_tb tr").each(function () {
        detalles.push({
            id_producto: $(this).data("producto"),
            cantidad: parseInt($(this).find(".cantidad-detalle").text())
        });
    });

    let cabecera = {
        id_deposito: $("#ajuste_deposito").val(),
        fecha_ajuste: $("#ajuste_fecha").val(),
        tipo_ajuste: $("#ajuste_tipo").val(),
        motivo: $("#ajuste_motivo").val().trim(),
        responsable: $("#ajuste_responsable").val().trim(),
        detalles: detalles
    };

    let resp = ejecutarAjax("controladores/ajuste_stock.php", "guardar=" + JSON.stringify(cabecera));
    try {
        let json = JSON.parse(resp);
        if (json.ok) {
            mensaje_confirmacion("Ajuste guardado correctamente. ID: " + json.id, "Éxito");
            mostrarAjusteStock();
        } else {
            mensaje_dialogo_info_ERROR(json.msg || 'Error al guardar', 'Error');
        }
    } catch (e) {
        console.error('Respuesta inesperada:', resp);
        mensaje_dialogo_info_ERROR('Error al procesar respuesta del servidor', 'Error');
    }
}

function cancelarAjuste() { mostrarAjusteStock(); }

$(document).on("click", ".anular-ajuste", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    let estado = $(this).closest("tr").find("td:eq(5) span").text();
    if (estado === "ANULADO") { mensaje_dialogo_info_ERROR("Este ajuste ya está anulado", "Información"); return; }
    Swal.fire({
        title: '¿Estás seguro?', text: "Desea anular este ajuste?", icon: 'warning', showCancelButton: true,
        confirmButtonText: 'Si', cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            ejecutarAjax("controladores/ajuste_stock.php", "anular=" + id);
            mensaje_confirmacion("Ajuste anulado correctamente", "Éxito");
            cargarTablaAjustes();
        }
    });
});

$(document).on("click", ".visualizar-ajuste", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    visualizarAjuste(id);
});

function visualizarAjuste(id) {
    let response = ejecutarAjax("controladores/ajuste_stock.php", "obtener=" + id);
    if (response === "0") { mensaje_dialogo_info_ERROR("No se pudo obtener el registro", "Error"); return; }
    let json_cabecera = JSON.parse(response);
    let response_detalle = ejecutarAjax("controladores/ajuste_stock.php", "obtener_detalle=" + id);
    
    let html_detalle = `
        <div class="container-fluid card" style="padding: 30px; margin-top: 20px;">
            <div class="row">
                <div class="col-md-12">
                    <h4>Ajuste #${json_cabecera.id_ajuste}</h4>
                    <hr>
                </div>
                <div class="col-md-6">
                    <p><strong>Depósito:</strong> ${json_cabecera.nombre_deposito}</p>
                    <p><strong>Fecha:</strong> ${json_cabecera.fecha_ajuste}</p>
                    <p><strong>Tipo:</strong> <span class="badge bg-${json_cabecera.tipo_ajuste === "Aumento" ? "success" : "danger"}">${json_cabecera.tipo_ajuste}</span></p>
                </div>
                <div class="col-md-6">
                    <p><strong>Estado:</strong> <span class="badge bg-${json_cabecera.estado === "ACTIVO" ? "success" : "danger"}">${json_cabecera.estado}</span></p>
                    <p><strong>Responsable:</strong> ${json_cabecera.responsable ? json_cabecera.responsable : '-'}</p>
                </div>
                <div class="col-md-12">
                    <p><strong>Motivo:</strong> ${json_cabecera.motivo ? json_cabecera.motivo : '-'}</p>
                </div>
                <div class="col-md-12">
                    <h5>Productos Ajustados</h5>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
    `;
    
    if (response_detalle !== "0") {
        let json_detalles = JSON.parse(response_detalle);
        json_detalles.forEach(function (detalle) {
            html_detalle += `
                <tr>
                    <td>${detalle.nombre_producto}</td>
                    <td>${detalle.cantidad}</td>
                </tr>
            `;
        });
    }
    
    html_detalle += `
                        </tbody>
                    </table>
                </div>
                <div class="col-md-12 text-end">
                    <button class="btn btn-secondary" onclick="mostrarAjusteStock();">Volver</button>
                </div>
            </div>
        </div>
    `;
    
    $(".contenido-principal").html(html_detalle);
}

function cargarListaDepositos(componente) {
    let datos = ejecutarAjax("controladores/deposito.php", "leer_activos=1");
    let option = "<option value='0'>Selecciona un Depósito</option>";
    if (datos !== "0") {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) { option += `<option value='${item.id_deposito}'>${item.nombre_deposito}</option>`; });
    }
    $(componente).html(option);
}

function cargarListaProductos(componente) {
    let datos = ejecutarAjax("controladores/productos.php", "leer_activos=1");
    let option = "<option value='0'>Selecciona un Producto</option>";
    if (datos !== "0") {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) { option += `<option value='${item.id_producto}'>${item.nombre_producto} - ${item.unidad_medida}</option>`; });
    }
    $(componente).html(option);
}

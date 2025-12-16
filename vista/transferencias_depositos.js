function mostrarTransferenciasDepositos() {
    let contenido = dameContenido("paginas/referenciales/transferencias_depositos/listar.php");
    $(".contenido-principal").html(contenido);
    cargarTablaTransferencias();
}

function mostrarAgregarTransferencia() {
    let contenido = dameContenido("paginas/referenciales/transferencias_depositos/agregar.php");
    $(".contenido-principal").html(contenido);
    cargarListaDepositos("#transferencia_origen");
    cargarListaDepositos("#transferencia_destino");
    cargarListaProductos("#transferencia_producto");
    dameFechaActual("transferencia_fecha");
}

function cargarTablaTransferencias() {
    let datos = ejecutarAjax("controladores/transferencias_depositos.php", "listar=1");
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='5' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_transferencia}</td>`;
            fila += `<td>${item.deposito_origen}</td>`;
            fila += `<td>${item.deposito_destino}</td>`;
            fila += `<td>${item.fecha_transferencia}</td>`;
            fila += `<td class='text-end'>`;
            fila += `<button class='btn btn-info btn-sm visualizar-transferencia' title='Visualizar'><i data-feather="eye"></i></button> `;
            fila += `<button class='btn btn-secondary btn-sm imprimir-transferencia' title='Imprimir'><i data-feather="printer"></i></button>`;
            fila += `</td>`;
            fila += `</tr>`;
        });
    }
    $("#transferencias_tb").html(fila);
    feather.replace();
}

function agregarDetalleTransferencia() {
    let id_producto = $("#transferencia_producto").val();
    let cantidad = $("#transferencia_cantidad").val();
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
            <td><span class="nombre-producto">${$("#transferencia_producto option:selected").text()}</span></td>
            <td><span class="cantidad-detalle">${cantidad}</span></td>
            <td class='text-end'>
                <button class='btn btn-danger btn-sm' onclick='eliminarDetalleTransferencia(this)'><i data-feather="trash"></i></button>
            </td>
        </tr>
    `;
    $("#detalle_transferencias_tb").append(fila_detalle);
    $("#transferencia_producto").val("0");
    $("#transferencia_cantidad").val("");
    feather.replace();
}

function eliminarDetalleTransferencia(btn) {
    $(btn).closest("tr").remove();
}

function guardarTransferencia() {
    if ($("#transferencia_origen").val() === "0") { mensaje_dialogo_info_ERROR("Debe seleccionar depósito origen", "ATENCIÓN"); return; }
    if ($("#transferencia_destino").val() === "0") { mensaje_dialogo_info_ERROR("Debe seleccionar depósito destino", "ATENCIÓN"); return; }
    if ($("#transferencia_origen").val() === $("#transferencia_destino").val()) { mensaje_dialogo_info_ERROR("Los depósitos no pueden ser iguales", "ATENCIÓN"); return; }
    if ($("#transferencia_fecha").val() === "") { mensaje_dialogo_info_ERROR("Debe ingresar la fecha", "ATENCIÓN"); return; }
    if ($("#detalle_transferencias_tb tr").length === 0) { mensaje_dialogo_info_ERROR("Debe agregar al menos un producto", "ATENCIÓN"); return; }

    let detalles = [];
    $("#detalle_transferencias_tb tr").each(function () {
        detalles.push({
            id_producto: $(this).data("producto"),
            cantidad: parseInt($(this).find(".cantidad-detalle").text())
        });
    });

    let cabecera = {
        id_origen: $("#transferencia_origen").val(),
        id_destino: $("#transferencia_destino").val(),
        fecha_transferencia: $("#transferencia_fecha").val(),
        observacion: $("#transferencia_observacion").val().trim(),
        detalles: detalles
    };

    let resp = ejecutarAjax("controladores/transferencias_depositos.php", "guardar=" + JSON.stringify(cabecera));
    try {
        let json = JSON.parse(resp);
        if (json.ok) {
            mensaje_confirmacion("Transferencia guardada correctamente. ID: " + json.id, "Éxito");
            mostrarTransferenciasDepositos();
        } else {
            mensaje_dialogo_info_ERROR(json.msg || 'Error al guardar', 'Error');
        }
    } catch (e) {
        console.error('Respuesta inesperada:', resp);
        mensaje_dialogo_info_ERROR('Error al procesar respuesta del servidor', 'Error');
    }
}

function cancelarTransferencia() { mostrarTransferenciasDepositos(); }

$(document).on("click", ".visualizar-transferencia", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    visualizarTransferencia(id);
});

function visualizarTransferencia(id) {
    let response = ejecutarAjax("controladores/transferencias_depositos.php", "obtener=" + id);
    if (response === "0") { mensaje_dialogo_info_ERROR("No se pudo obtener el registro", "Error"); return; }
    let json_cabecera = JSON.parse(response);
    let response_detalle = ejecutarAjax("controladores/transferencias_depositos.php", "obtener_detalle=" + id);
    
    let html_detalle = `
        <div class="container-fluid card" style="padding: 30px; margin-top: 20px;">
            <div class="row">
                <div class="col-md-12">
                    <h4>Transferencia #${json_cabecera.id_transferencia}</h4>
                    <hr>
                </div>
                <div class="col-md-6">
                    <p><strong>Depósito Origen:</strong> ${json_cabecera.deposito_origen}</p>
                    <p><strong>Fecha:</strong> ${json_cabecera.fecha_transferencia}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Depósito Destino:</strong> ${json_cabecera.deposito_destino}</p>
                </div>
                <div class="col-md-12">
                    <p><strong>Observación:</strong> ${json_cabecera.observacion ? json_cabecera.observacion : '-'}</p>
                </div>
                <div class="col-md-12">
                    <h5>Productos Transferidos</h5>
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
                    <button class="btn btn-secondary" onclick="mostrarTransferenciasDepositos();">Volver</button>
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

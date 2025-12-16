function mostrarEgresosVenta() {
    let contenido = dameContenido("paginas/referenciales/egresos_ventas/listar.php");
    $(".contenido-principal").html(contenido);
    cargarTablaEgresos();
}

function mostrarAgregarEgreso() {
    let contenido = dameContenido("paginas/referenciales/egresos_ventas/agregar.php");
    $(".contenido-principal").html(contenido);
    cargarListaClientes("#egreso_cliente");
    cargarListaProductos("#egreso_producto");
    dameFechaActual("egreso_fecha");
}

function cargarTablaEgresos() {
    let datos = ejecutarAjax("controladores/egresos_ventas.php", "listar=1");
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='6' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_egreso}</td>`;
            fila += `<td>${item.nombre_cliente}</td>`;
            fila += `<td>${item.fecha_egreso}</td>`;
            fila += `<td>${parseFloat(item.total_egreso).toLocaleString('es-PY', { style: 'currency', currency: 'PYG' })}</td>`;
            fila += `<td><span class="badge bg-${item.estado === "ACTIVO" ? "success" : "danger"}">${item.estado}</span></td>`;
            fila += `<td class='text-end'>`;
            fila += `<button class='btn btn-info btn-sm visualizar-egreso' title='Visualizar'><i data-feather="eye"></i></button> `;
            fila += `<button class='btn btn-warning btn-sm anular-egreso' title='Anular'><i data-feather="x-circle"></i></button> `;
            fila += `<button class='btn btn-secondary btn-sm imprimir-egreso' title='Imprimir'><i data-feather="printer"></i></button>`;
            fila += `</td>`;
            fila += `</tr>`;
        });
    }
    $("#egresos_tb").html(fila);
    feather.replace();
}

function agregarDetalleEgreso() {
    let id_producto = $("#egreso_producto").val();
    let cantidad = $("#egreso_cantidad").val();
    let precio_unitario = $("#egreso_precio").val();
    if (id_producto === "0" || cantidad === "" || precio_unitario === "") {
        mensaje_dialogo_info_ERROR("Debe completar los campos de producto, cantidad y precio", "ATENCIÓN");
        return;
    }
    cantidad = parseInt(cantidad);
    precio_unitario = parseFloat(precio_unitario);
    if (cantidad <= 0 || precio_unitario <= 0) {
        mensaje_dialogo_info_ERROR("Cantidad y precio deben ser mayores a 0", "ATENCIÓN");
        return;
    }
    let subtotal = cantidad * precio_unitario;
    let fila_detalle = `
        <tr data-producto="${id_producto}">
            <td><span class="nombre-producto">${$("#egreso_producto option:selected").text()}</span></td>
            <td><span class="cantidad-detalle">${cantidad}</span></td>
            <td><span class="precio-detalle">${precio_unitario.toFixed(2)}</span></td>
            <td><span class="subtotal-detalle">${subtotal.toFixed(2)}</span></td>
            <td class='text-end'>
                <button class='btn btn-danger btn-sm' onclick='eliminarDetalleEgreso(this)'><i data-feather="trash"></i></button>
            </td>
        </tr>
    `;
    $("#detalle_egresos_tb").append(fila_detalle);
    $("#egreso_producto").val("0");
    $("#egreso_cantidad").val("");
    $("#egreso_precio").val("");
    calcularTotalEgreso();
    feather.replace();
}

function eliminarDetalleEgreso(btn) {
    $(btn).closest("tr").remove();
    calcularTotalEgreso();
}

function calcularTotalEgreso() {
    let total = 0;
    $("#detalle_egresos_tb tr").each(function () {
        let subtotal = parseFloat($(this).find(".subtotal-detalle").text());
        total += subtotal;
    });
    $("#egreso_total").val(total.toFixed(2));
}

function guardarEgreso() {
    if ( $("#egreso_cliente").val() === "0" ) { mensaje_dialogo_info_ERROR("Debe seleccionar un cliente", "ATENCIÓN"); return; }
    if ( $("#egreso_fecha").val() === "" ) { mensaje_dialogo_info_ERROR("Debe ingresar la fecha", "ATENCIÓN"); return; }
    if ( $("#detalle_egresos_tb tr").length === 0 ) { mensaje_dialogo_info_ERROR("Debe agregar al menos un producto", "ATENCIÓN"); return; }

    let detalles = [];
    $("#detalle_egresos_tb tr").each(function () {
        detalles.push({
            id_producto: $(this).data("producto"),
            cantidad: parseInt($(this).find(".cantidad-detalle").text()),
            precio_unitario: parseFloat($(this).find(".precio-detalle").text())
        });
    });

    let cabecera = {
        id_cliente: $("#egreso_cliente").val(),
        fecha_egreso: $("#egreso_fecha").val(),
        total_egreso: parseFloat($("#egreso_total").val()),
        observacion: $("#egreso_observacion").val().trim(),
        detalles: detalles
    };

    let resp = ejecutarAjax("controladores/egresos_ventas.php", "guardar=" + JSON.stringify(cabecera));
    try {
        let json = JSON.parse(resp);
        if (json.ok) {
            mensaje_confirmacion("Egreso guardado correctamente. ID: " + json.id, "Éxito");
            mostrarEgresosVenta();
        } else {
            mensaje_dialogo_info_ERROR(json.msg || 'Error al guardar', 'Error');
        }
    } catch (e) {
        console.error('Respuesta inesperada:', resp);
        mensaje_dialogo_info_ERROR('Error al procesar respuesta del servidor', 'Error');
    }
}

function cancelarEgreso() { mostrarEgresosVenta(); }

$(document).on("click", ".anular-egreso", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    let estado = $(this).closest("tr").find("td:eq(4) span").text();
    if (estado === "ANULADO") { mensaje_dialogo_info_ERROR("Este egreso ya está anulado", "Información"); return; }
    Swal.fire({
        title: '¿Estás seguro?', text: "Desea anular este egreso?", icon: 'warning', showCancelButton: true,
        confirmButtonText: 'Si', cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            ejecutarAjax("controladores/egresos_ventas.php", "anular=" + id);
            mensaje_confirmacion("Egreso anulado correctamente", "Éxito");
            cargarTablaEgresos();
        }
    });
});

$(document).on("click", ".visualizar-egreso", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    visualizarEgreso(id);
});

function visualizarEgreso(id) {
    let response = ejecutarAjax("controladores/egresos_ventas.php", "obtener=" + id);
    if (response === "0") { mensaje_dialogo_info_ERROR("No se pudo obtener el registro", "Error"); return; }
    let json_cabecera = JSON.parse(response);
    let response_detalle = ejecutarAjax("controladores/egresos_ventas.php", "obtener_detalle=" + id);
    let html_detalle = `...`; // minimal for brevity
    $(".contenido-principal").html(html_detalle);
}

function cargarListaClientes(componente) {
    let datos = ejecutarAjax("controladores/clientes.php", "leer_activos=1");
    let option = "<option value='0'>Selecciona un Cliente</option>";
    if (datos !== "0") {
        let json_datos = JSON.parse(datos);
            json_datos.map(function (item) { option += `<option value='${item.id_cliente}'>${item.nombre_cliente}</option>`; });
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

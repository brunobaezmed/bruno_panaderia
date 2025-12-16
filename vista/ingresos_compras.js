function mostrarIngresosCompra() {
    let contenido = dameContenido("paginas/referenciales/ingresos_compras/listar.php");
    $(".contenido-principal").html(contenido);
    cargarTablaIngresos();
}

function mostrarAgregarIngreso() {
    let contenido = dameContenido("paginas/referenciales/ingresos_compras/agregar.php");
    $(".contenido-principal").html(contenido);
    cargarListaProveedores("#ingreso_proveedor");
    cargarListaProductos("#ingreso_producto");
    // dameFechaActual espera el id del componente SIN '#'
    dameFechaActual("ingreso_fecha");
}

function cargarTablaIngresos() {
    let datos = ejecutarAjax("controladores/ingresos_compras.php", "listar=1");
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='6' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_ingreso}</td>`;
            fila += `<td>${item.nombre_apellido}</td>`;
            fila += `<td>${item.fecha_ingreso}</td>`;
            fila += `<td>${parseFloat(item.total_compra).toLocaleString('es-PY', { style: 'currency', currency: 'PYG' })}</td>`;
            fila += `<td><span class="badge bg-${item.estado === "ACTIVO" ? "success" : "danger"}">${item.estado}</span></td>`;
            fila += `<td class='text-end'>`;
            fila += `<button class='btn btn-info btn-sm visualizar-ingreso' title='Visualizar'><i data-feather="eye"></i></button> `;
            fila += `<button class='btn btn-warning btn-sm anular-ingreso' title='Anular'><i data-feather="x-circle"></i></button> `;
            fila += `<button class='btn btn-secondary btn-sm imprimir-ingreso' title='Imprimir'><i data-feather="printer"></i></button>`;
            fila += `</td>`;
            fila += `</tr>`;
        });
    }
    $("#ingresos_tb").html(fila);
    feather.replace();
}

function agregarDetalleIngreso() {
    let id_producto = $("#ingreso_producto").val();
    let cantidad = $("#ingreso_cantidad").val();
    let precio_compra = $("#ingreso_precio").val();
    
    if (id_producto === "0" || cantidad === "" || precio_compra === "") {
        mensaje_dialogo_info_ERROR("Debe completar los campos de producto, cantidad y precio", "ATENCIÓN");
        return;
    }
    
    cantidad = parseInt(cantidad);
    precio_compra = parseFloat(precio_compra);
    
    if (cantidad <= 0 || precio_compra <= 0) {
        mensaje_dialogo_info_ERROR("Cantidad y precio deben ser mayores a 0", "ATENCIÓN");
        return;
    }
    
    let subtotal = cantidad * precio_compra;
    
    let fila_detalle = `
        <tr data-producto="${id_producto}">
            <td><span class="nombre-producto">${$("#ingreso_producto option:selected").text()}</span></td>
            <td><span class="cantidad-detalle">${cantidad}</span></td>
            <td><span class="precio-detalle">${precio_compra.toFixed(2)}</span></td>
            <td><span class="subtotal-detalle">${subtotal.toFixed(2)}</span></td>
            <td class='text-end'>
                <button class='btn btn-danger btn-sm' onclick='eliminarDetalleIngreso(this)'><i data-feather="trash"></i></button>
            </td>
        </tr>
    `;
    
    $("#detalle_ingresos_tb").append(fila_detalle);
    
    // Limpiar campos
    $("#ingreso_producto").val("0");
    $("#ingreso_cantidad").val("");
    $("#ingreso_precio").val("");
    
    calcularTotalIngreso();
    feather.replace();
}

function eliminarDetalleIngreso(btn) {
    $(btn).closest("tr").remove();
    calcularTotalIngreso();
}

function calcularTotalIngreso() {
    let total = 0;
    $("#detalle_ingresos_tb tr").each(function () {
        let subtotal = parseFloat($(this).find(".subtotal-detalle").text());
        total += subtotal;
    });
    $("#ingreso_total").val(total.toFixed(2));
}

function guardarIngreso() {
    if ($("#ingreso_proveedor").val() === "0") {
        mensaje_dialogo_info_ERROR("Debe seleccionar un proveedor", "ATENCIÓN");
        return;
    }
    
    if ($("#ingreso_fecha").val() === "") {
        mensaje_dialogo_info_ERROR("Debe ingresar la fecha", "ATENCIÓN");
        return;
    }
    
    if ($("#detalle_ingresos_tb tr").length === 0) {
        mensaje_dialogo_info_ERROR("Debe agregar al menos un producto", "ATENCIÓN");
        return;
    }
    
    let detalles = [];
    $("#detalle_ingresos_tb tr").each(function () {
        detalles.push({
            id_producto: $(this).data("producto"),
            cantidad: parseInt($(this).find(".cantidad-detalle").text()),
            precio_compra: parseFloat($(this).find(".precio-detalle").text())
        });
    });
    
    let cabecera = {
        id_proveedor: $("#ingreso_proveedor").val(),
        fecha_ingreso: $("#ingreso_fecha").val(),
        total_compra: parseFloat($("#ingreso_total").val()),
        observacion: $("#ingreso_observacion").val().trim(),
        detalles: detalles
    };
    
    let resp = ejecutarAjax("controladores/ingresos_compras.php", "guardar=" + JSON.stringify(cabecera));
    try {
        let json = JSON.parse(resp);
        if (json.ok) {
            mensaje_confirmacion("Ingreso guardado correctamente. ID: " + json.id, "Éxito");
            mostrarIngresosCompra();
        } else {
            mensaje_dialogo_info_ERROR(json.msg || 'Error al guardar', 'Error');
        }
    } catch (e) {
        console.error('Respuesta inesperada:', resp);
        mensaje_dialogo_info_ERROR('Error al procesar respuesta del servidor', 'Error');
    }
}

function cancelarIngreso() {
    mostrarIngresosCompra();
}

$(document).on("click", ".visualizar-ingreso", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    visualizarIngreso(id);
});

$(document).on("click", ".anular-ingreso", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    let estado = $(this).closest("tr").find("td:eq(4) span").text();
    
    if (estado === "ANULADO") {
        mensaje_dialogo_info_ERROR("Este ingreso ya está anulado", "Información");
        return;
    }
    
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Desea anular este ingreso?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Si'
    }).then((result) => {
        if (result.isConfirmed) {
            ejecutarAjax("controladores/ingresos_compras.php", "anular=" + id);
            mensaje_confirmacion("Ingreso anulado correctamente", "Éxito");
            cargarTablaIngresos();
        }
    });
});

$(document).on("click", ".imprimir-ingreso", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    imprimirIngreso(id);
});

function visualizarIngreso(id) {
    let response = ejecutarAjax("controladores/ingresos_compras.php", "obtener=" + id);
    if (response === "0") {
        mensaje_dialogo_info_ERROR("No se pudo obtener el registro", "Error");
        return;
    }
    
    let json_cabecera = JSON.parse(response);
    let response_detalle = ejecutarAjax("controladores/ingresos_compras.php", "obtener_detalle=" + id);
    
    let html_detalle = `
        <div class="container-fluid card" style="padding: 30px; margin-top: 20px;">
            <div class="row">
                <div class="col-md-12">
                    <h4>Detalles del Ingreso #${json_cabecera.id_ingreso}</h4>
                    <hr>
                </div>
                <div class="col-md-6">
                    <p><strong>Proveedor:</strong> ${json_cabecera.nombre_apellido}</p>
                    <p><strong>Fecha:</strong> ${json_cabecera.fecha_ingreso}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Total:</strong> ${parseFloat(json_cabecera.total_compra).toLocaleString('es-PY', { style: 'currency', currency: 'PYG' })}</p>
                    <p><strong>Estado:</strong> <span class="badge bg-${json_cabecera.estado === "ACTIVO" ? "success" : "danger"}">${json_cabecera.estado}</span></p>
                </div>
                <div class="col-md-12">
                    <p><strong>Observación:</strong> ${json_cabecera.observacion ? json_cabecera.observacion : '-'}</p>
                </div>
                <div class="col-md-12">
                    <h5>Detalles de Productos</h5>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Subtotal</th>
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
                    <td>${parseFloat(detalle.precio_compra).toFixed(2)}</td>
                    <td>${parseFloat(detalle.subtotal).toLocaleString('es-PY', { style: 'currency', currency: 'PYG' })}</td>
                </tr>
            `;
        });
    }
    
    html_detalle += `
                        </tbody>
                    </table>
                </div>
                <div class="col-md-12 text-end">
                    <button class="btn btn-secondary" onclick="mostrarIngresosCompra();">Volver</button>
                </div>
            </div>
        </div>
    `;
    
    $(".contenido-principal").html(html_detalle);
}

function imprimirIngreso(id) {
    mensaje_dialogo_info("Función de impresión en desarrollo", "Información");
}

$(document).on("keyup", "#b_ingreso", function () {
    let texto = $(this).val();
    if (texto.trim().length === 0) {
        cargarTablaIngresos();
        return;
    }
    let datos = ejecutarAjax("controladores/ingresos_compras.php", "buscar=" + texto);
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='6' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_ingreso}</td>`;
            fila += `<td>${item.nombre_apellido}</td>`;
            fila += `<td>${item.fecha_ingreso}</td>`;
            fila += `<td>${parseFloat(item.total_compra).toLocaleString('es-PY', { style: 'currency', currency: 'PYG' })}</td>`;
            fila += `<td><span class="badge bg-${item.estado === "ACTIVO" ? "success" : "danger"}">${item.estado}</span></td>`;
            fila += `<td class='text-end'>`;
            fila += `<button class='btn btn-info btn-sm visualizar-ingreso' title='Visualizar'><i data-feather="eye"></i></button> `;
            fila += `<button class='btn btn-warning btn-sm anular-ingreso' title='Anular'><i data-feather="x-circle"></i></button> `;
            fila += `<button class='btn btn-secondary btn-sm imprimir-ingreso' title='Imprimir'><i data-feather="printer"></i></button>`;
            fila += `</td>`;
            fila += `</tr>`;
        });
    }
    $("#ingresos_tb").html(fila);
    feather.replace();
});

function cargarListaProveedores(componente) {
    let datos = ejecutarAjax("controladores/proveedores.php", "leer_activos=1");
    let option = "<option value='0'>Selecciona un Proveedor</option>";
    if (datos !== "0") {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            option += `<option value='${item.id_proveedor}'>${item.nombre_apellido}</option>`;
        });
    }
    $(componente).html(option);
}

function cargarListaProductos(componente) {
    let datos = ejecutarAjax("controladores/productos.php", "leer_activos=1");
    let option = "<option value='0'>Selecciona un Producto</option>";
    if (datos !== "0") {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            option += `<option value='${item.id_producto}'>${item.nombre_producto} - ${item.unidad_medida}</option>`;
        });
    }
    $(componente).html(option);
}

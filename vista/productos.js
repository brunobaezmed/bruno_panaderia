function mostrarListaProductos() {
    console.log('mostrarListaProductos called');
    try {
        var contenido = dameContenido("paginas/referenciales/productos/listar.php");
        if (contenido && contenido.trim().length > 0) {
            $(".contenido-principal").html(contenido);
            if (typeof feather !== 'undefined') feather.replace();
            return;
        }
    } catch (e) {
        console.error('dameContenido error productos:', e);
    }

    $.post('paginas/referenciales/productos/listar.php')
        .done(function (resp) {
            if (resp && resp.trim().length > 0) {
                $(".contenido-principal").html(resp);
                if (typeof feather !== 'undefined') feather.replace();
            } else {
                $(".contenido-principal").html('<div class="alert alert-warning">La vista de productos está vacía.</div>');
            }
        })
        .fail(function (xhr, status, err) {
            console.error('Error cargando listado de productos:', status, err);
            $(".contenido-principal").html('<div class="alert alert-danger">No se pudo cargar la vista de productos: ' + status + '</div>');
        });
}

function mostrarAgregarProducto() {
    let contenido = dameContenido("paginas/referenciales/productos/agregar.php");
    $(".contenido-principal").html(contenido);
}

function guardarProducto() {
    if ($("#producto_nombre").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debes ingresar nombre del producto", "ATENCIÓN");
        return;
    }
    if ($("#producto_precio").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debes ingresar precio unitario", "ATENCIÓN");
        return;
    }

    let cabecera = {
        nombre_producto: $("#producto_nombre").val().trim(),
        descripcion: $("#producto_descripcion").val().trim(),
        unidad_medida: $("#producto_unidad").val().trim(),
        stock_actual: $("#producto_stock_actual").val(),
        stock_minimo: $("#producto_stock_minimo").val(),
        precio_unitario: $("#producto_precio").val(),
        estado: $("#producto_estado").val(),
    };

    let respuesta;
    if ($("#id_producto").val() === "0") {
        respuesta = ejecutarAjax("controladores/productos.php", "guardar=" + JSON.stringify(cabecera));
    } else {
        cabecera = { ...cabecera, id_producto: $("#id_producto").val() };
        respuesta = ejecutarAjax("controladores/productos.php", "actualizar=" + JSON.stringify(cabecera));
    }

    try {
        let json = JSON.parse(respuesta);
        if (json.ok) {
            mensaje_confirmacion("Guardado correctamente", "Éxito");
            mostrarListaProductos();
        } else {
            mensaje_dialogo_info_ERROR(json.msg || 'Error en servidor', 'Error');
        }
    } catch (e) {
        console.error('Respuesta guardar producto:', respuesta);
        mensaje_confirmacion("Operación completada (sin confirmación del servidor)", "Aviso");
        mostrarListaProductos();
    }
}

function cargarTablaProductos() {
    let datos = ejecutarAjax("controladores/productos.php", "listar=1");
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='9' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_producto}</td>`;
            fila += `<td>${item.nombre_producto}</td>`;
            fila += `<td>${item.descripcion ? item.descripcion : ''}</td>`;
            fila += `<td>${item.unidad_medida ? item.unidad_medida : ''}</td>`;
            fila += `<td>${item.stock_actual}</td>`;
            fila += `<td>${item.stock_minimo}</td>`;
            fila += `<td>${item.precio_unitario}</td>`;
            fila += `<td><span class="badge bg-${item.estado === 'ACTIVO' ? 'success' : 'danger'}">${item.estado}</span></td>`;
            fila += `<td class='text-end'>`;
            fila += `<button class='btn btn-warning editar-producto'><i data-feather="edit"></i></button> `;
            fila += `<button class='btn btn-danger eliminar-producto'><i data-feather="trash"></i></button>`;
            fila += `</td>`;
            fila += `</tr>`;
        });
    }
    $("#productos_tb").html(fila);
    feather.replace();
}

$(document).on("click", ".eliminar-producto", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    Swal.fire({
        title: 'Estas seguro?',
        text: "Desea eliminar esta registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        confirmButtonText: 'Si'
    }).then((result) => {
        if (result.isConfirmed) {
            let resp = ejecutarAjax("controladores/productos.php", "eliminar=" + id);
            try {
                let json = JSON.parse(resp);
                if (json.ok) {
                    mensaje_confirmacion("Eliminado correctamente", "Éxito");
                    cargarTablaProductos();
                } else {
                    mensaje_dialogo_info_ERROR(json.msg || 'Error eliminando', 'Error');
                }
            } catch (e) {
                console.error('Respuesta eliminar producto:', resp);
                mensaje_confirmacion("Eliminado (respuesta no JSON)", "Aviso");
                cargarTablaProductos();
            }
        }
    });
});

$(document).on("click", ".editar-producto", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    let response = ejecutarAjax("controladores/productos.php", "id=" + id);
    if (response === "0") {
        mensaje_dialogo_info_ERROR("No se pudo obtener el registro", "Error");
        return;
    }
    let json_registro = JSON.parse(response);
    let contenido = dameContenido("paginas/referenciales/productos/agregar.php");
    $(".contenido-principal").html(contenido);
    $("#producto_form_titulo").text("Editar Producto");
    $("#id_producto").val(json_registro.id_producto);
    $("#producto_nombre").val(json_registro.nombre_producto);
    $("#producto_descripcion").val(json_registro.descripcion ? json_registro.descripcion : "");
    $("#producto_unidad").val(json_registro.unidad_medida ? json_registro.unidad_medida : "");
    $("#producto_stock_actual").val(json_registro.stock_actual);
    $("#producto_stock_minimo").val(json_registro.stock_minimo);
    $("#producto_precio").val(json_registro.precio_unitario);
    $("#producto_estado").val(json_registro.estado);
});

function cancelarProducto() {
    mostrarListaProductos();
}

$(document).on("keyup", "#b_productos", function () {
    let texto = $(this).val();
    if (texto.trim().length === 0) {
        cargarTablaProductos();
        return;
    }
    let datos = ejecutarAjax("controladores/productos.php", "buscar=" + texto);
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='9' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_producto}</td>`;
            fila += `<td>${item.nombre_producto}</td>`;
            fila += `<td>${item.descripcion ? item.descripcion : ''}</td>`;
            fila += `<td>${item.unidad_medida ? item.unidad_medida : ''}</td>`;
            fila += `<td>${item.stock_actual}</td>`;
            fila += `<td>${item.stock_minimo}</td>`;
            fila += `<td>${item.precio_unitario}</td>`;
            fila += `<td><span class="badge bg-${item.estado === 'ACTIVO' ? 'success' : 'danger'}">${item.estado}</span></td>`;
            fila += `<td class='text-end'>`;
            fila += `<button class='btn btn-warning editar-producto'><i data-feather="edit"></i></button> `;
            fila += `<button class='btn btn-danger eliminar-producto'><i data-feather="trash"></i></button>`;
            fila += `</td>`;
            fila += `</tr>`;
        });
    }
    $("#productos_tb").html(fila);
    feather.replace();
});

function cargarListaProductosActivos(componente) {
    let datos = ejecutarAjax("controladores/productos.php", "leer_activos=1");
    let option = "<option value='0'>Selecciona un Producto</option>";
    if (datos !== "0") {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            option += `<option value='${item.id_producto}'>${item.nombre_producto}</option>`;
        });
    }
    $(componente).html(option);
}

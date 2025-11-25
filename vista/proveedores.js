function mostrarListaProveedores() {
    let contenido = dameContenido("paginas/referenciales/proveedores/listar.php");
    $(".contenido-principal").html(contenido);
    cargarTablaProveedores();
}

function mostrarAgregarProveedor() {
    let contenido = dameContenido("paginas/referenciales/proveedores/agregar.php");
    $(".contenido-principal").html(contenido);
}

function guardarProveedor() {
    if ($("#proveedor_nombre_apellido").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debes ingresar nombre del proveedor", "ATENCIÓN");
        return;
    }
    if ($("#proveedor_ruc").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debes ingresar RUC", "ATENCIÓN");
        return;
    }

    let cabecera = {
        nombre_apellido: $("#proveedor_nombre_apellido").val().trim(),
        telefono: $("#proveedor_telefono").val().trim(),
        direccion: $("#proveedor_direccion").val().trim(),
        email: $("#proveedor_email").val().trim(),
        estado: $("#proveedor_estado").val(),
        ruc: $("#proveedor_ruc").val().trim(),
        razon_social: $("#proveedor_razon_social").val().trim(),
    };

    let respuesta;
    if ($("#id_proveedor").val() === "0") {
        respuesta = ejecutarAjax("controladores/proveedores.php", "guardar=" + JSON.stringify(cabecera));
    } else {
        cabecera = { ...cabecera, id_proveedor: $("#id_proveedor").val() };
        respuesta = ejecutarAjax("controladores/proveedores.php", "actualizar=" + JSON.stringify(cabecera));
    }

    // Intentar parsear respuesta JSON del servidor
    try {
        let json = JSON.parse(respuesta);
        if (json.ok) {
            mensaje_confirmacion("Guardado correctamente", "Éxito");
            mostrarListaProveedores();
        } else {
            mensaje_dialogo_info_ERROR(json.msg || 'Error en servidor', 'Error');
        }
    } catch (e) {
        // Si no vino JSON, mostrar contenido bruto en consola y notificar
        console.error('Respuesta guardar proveedor:', respuesta);
        mensaje_confirmacion("Operación completada (sin confirmación del servidor)", "Aviso");
        mostrarListaProveedores();
    }
}

function cargarTablaProveedores() {
    let datos = ejecutarAjax("controladores/proveedores.php", "listar=1");
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='9' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_proveedor}</td>`;
            fila += `<td>${item.nombre_apellido}</td>`;
            fila += `<td>${item.ruc ? item.ruc : ''}</td>`;
            fila += `<td>${item.razon_social ? item.razon_social : ''}</td>`;
            fila += `<td>${item.telefono ? item.telefono : ''}</td>`;
            fila += `<td>${item.email ? item.email : ''}</td>`;
            fila += `<td>${item.direccion ? item.direccion : ''}</td>`;
            fila += `<td><span class="badge bg-${item.estado === 'ACTIVO' ? 'success' : 'danger'}">${item.estado}</span></td>`;
            fila += `<td class='text-end'>`;
            fila += `<button class='btn btn-warning editar-proveedor'><i data-feather="edit"></i></button> `;
            fila += `<button class='btn btn-danger eliminar-proveedor'><i data-feather="trash"></i></button>`;
            fila += `</td>`;
            fila += `</tr>`;
        });
    }
    $("#proveedores_tb").html(fila);
    feather.replace();
}

$(document).on("click", ".eliminar-proveedor", function () {
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
                let resp = ejecutarAjax("controladores/proveedores.php", "eliminar=" + id);
                try {
                    let json = JSON.parse(resp);
                    if (json.ok) {
                        mensaje_confirmacion("Eliminado correctamente", "Éxito");
                        cargarTablaProveedores();
                    } else {
                        mensaje_dialogo_info_ERROR(json.msg || 'Error eliminando', 'Error');
                    }
                } catch (e) {
                    console.error('Respuesta eliminar:', resp);
                    mensaje_confirmacion("Eliminado (respuesta no JSON)", "Aviso");
                    cargarTablaProveedores();
                }
            }
    });
});

$(document).on("click", ".editar-proveedor", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    let response = ejecutarAjax("controladores/proveedores.php", "id=" + id);
    if (response === "0") {
        mensaje_dialogo_info_ERROR("No se pudo obtener el registro", "Error");
        return;
    }
    let json_registro = JSON.parse(response);
    let contenido = dameContenido("paginas/referenciales/proveedores/agregar.php");
    $(".contenido-principal").html(contenido);
    $("#proveedor_form_titulo").text("Editar Proveedor");
    $("#id_proveedor").val(json_registro.id_proveedor);
    $("#proveedor_nombre_apellido").val(json_registro.nombre_apellido);
    $("#proveedor_telefono").val(json_registro.telefono ? json_registro.telefono : "");
    $("#proveedor_email").val(json_registro.email ? json_registro.email : "");
    $("#proveedor_direccion").val(json_registro.direccion ? json_registro.direccion : "");
    $("#proveedor_estado").val(json_registro.estado);
    $("#proveedor_ruc").val(json_registro.ruc ? json_registro.ruc : "");
    $("#proveedor_razon_social").val(json_registro.razon_social ? json_registro.razon_social : "");
});

function cancelarProveedor() {
    mostrarListaProveedores();
}

$(document).on("keyup", "#b_proveedores", function () {
    let texto = $(this).val();
    if (texto.trim().length === 0) {
        cargarTablaProveedores();
        return;
    }
    let datos = ejecutarAjax("controladores/proveedores.php", "buscar=" + texto);
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='9' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_proveedor}</td>`;
            fila += `<td>${item.nombre_apellido}</td>`;
            fila += `<td>${item.ruc ? item.ruc : ''}</td>`;
            fila += `<td>${item.razon_social ? item.razon_social : ''}</td>`;
            fila += `<td>${item.telefono ? item.telefono : ''}</td>`;
            fila += `<td>${item.email ? item.email : ''}</td>`;
            fila += `<td>${item.direccion ? item.direccion : ''}</td>`;
            fila += `<td><span class="badge bg-${item.estado === 'ACTIVO' ? 'success' : 'danger'}">${item.estado}</span></td>`;
            fila += `<td class='text-end'>`;
            fila += `<button class='btn btn-warning editar-proveedor'><i data-feather="edit"></i></button> `;
            fila += `<button class='btn btn-danger eliminar-proveedor'><i data-feather="trash"></i></button>`;
            fila += `</td>`;
            fila += `</tr>`;
        });
    }
    $("#proveedores_tb").html(fila);
    feather.replace();
});

function cargarListaProveedoresActivos(componente) {
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


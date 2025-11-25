function mostrarListaDeposito() {
    // Intento principal: cargar la página independiente depositos.php en el contenedor
    try {
        $.post('depositos.php')
            .done(function (resp) {
                if (resp && resp.trim().length > 0) {
                    $('.contenido-principal').html(resp);
                    if (typeof feather !== 'undefined') feather.replace();
                } else {
                    // fallback al parcial
                    cargaParcial();
                }
            })
            .fail(function () {
                cargaParcial();
            });
    } catch (e) {
        console.error('Error cargando depositos.php', e);
        cargaParcial();
    }

    function cargaParcial() {
        try {
            var contenido = dameContenido('paginas/referenciales/deposito/listar.php');
            if (contenido && contenido.trim().length > 0) {
                $('.contenido-principal').html(contenido);
                if (typeof feather !== 'undefined') feather.replace();
                return;
            }
        } catch (e) {
            console.error('dameContenido fallo para deposito:', e);
        }

        $.post('paginas/referenciales/deposito/listar.php')
            .done(function (resp) {
                if (resp && resp.trim().length > 0) {
                    $('.contenido-principal').html(resp);
                    if (typeof feather !== 'undefined') feather.replace();
                } else {
                    $('.contenido-principal').html('<div class="alert alert-warning">La vista de depósitos está vacía.</div>');
                }
            })
            .fail(function (xhr, status, err) {
                console.error('Error cargando parcial deposito:', status, err);
                $('.contenido-principal').html('<div class="alert alert-danger">No se pudo cargar la vista de depósitos: ' + status + '</div>');
            });
    }
}

// Placeholders for future CRUD functions (guardar, editar, eliminar) can be added here
function mostrarListaDeposito() {
    console.log('mostrarListaDeposito called');
    // Intento 1: cargar la página independiente depositos.php dentro del contenedor principal
    try {
        $.post('depositos.php')
            .done(function (resp) {
                if (resp && resp.trim().length > 0) {
                    $(".contenido-principal").html(resp);
                    if (typeof feather !== 'undefined') feather.replace();
                    if (typeof cargarTablaDeposito === 'function') cargarTablaDeposito();
                } else {
                    // Intento 2: usar el parcial (fallback)
                    cargaParcialDepositoFallback();
                }
            })
            .fail(function () {
                // Intento 2: fallback a parcial
                cargaParcialDepositoFallback();
            });
    } catch (e) {
        console.error('Error cargando depositos.php:', e);
        cargaParcialDepositoFallback();
    }

    function cargaParcialDepositoFallback() {
        try {
            var contenido = dameContenido("paginas/referenciales/deposito/listar.php");
            if (contenido && contenido.trim().length > 0) {
                $(".contenido-principal").html(contenido);
                if (typeof feather !== 'undefined') feather.replace();
                if (typeof cargarTablaDeposito === 'function') cargarTablaDeposito();
                return;
            }
        } catch (e) {
            console.error('dameContenido error (fallback):', e);
        }

        $.post('paginas/referenciales/deposito/listar.php')
            .done(function (resp) {
                if (resp && resp.trim().length > 0) {
                    $(".contenido-principal").html(resp);
                    if (typeof feather !== 'undefined') feather.replace();
                    if (typeof cargarTablaDeposito === 'function') cargarTablaDeposito();
                } else {
                    $(".contenido-principal").html('<div class="alert alert-warning">La vista de depósitos está vacía.</div>');
                }
            })
            .fail(function (xhr, status, err) {
                console.error('Error cargando listado de depósitos (fallback):', status, err);
                $(".contenido-principal").html('<div class="alert alert-danger">No se pudo cargar la vista de depósitos: ' + status + '</div>');
            });
    }
}

function mostrarAgregarDeposito() {
    // Try multiple strategies to load the partial (robust fallback and better error info)
    let contenido = '';
    try {
        contenido = ejecutarAjaxHTML("paginas/referenciales/deposito/agregar.php", "");
    } catch (e) {
        console.error('ejecutarAjaxHTML exception:', e);
    }

    // fallback to dameContenido
    if (!contenido || String(contenido).trim().length === 0) {
        try {
            contenido = dameContenido('paginas/referenciales/deposito/agregar.php');
        } catch (e) {
            console.error('dameContenido exception:', e);
        }
    }

    // final fallback: synchronous fetch to capture raw response (ejecutarAjaxHTML is synchronous)
    if (!contenido || String(contenido).trim().length === 0) {
        let raw = ejecutarAjaxHTML('paginas/referenciales/deposito/agregar.php', '');
        if (raw && String(raw).trim().length > 0) {
            console.error('Respuesta raw al cargar parcial deposito/agregar:', raw);
            mensaje_dialogo_info_ERROR('El servidor devolvió contenido al cargar el formulario. Revisa la consola para ver la respuesta completa.', 'Error servidor');
            $(".contenido-principal").html(raw);
            return;
        }

        mensaje_dialogo_info_ERROR('No se pudo cargar el formulario de depósito. Verifica la ruta o errores en el servidor.', 'Error');
        return;
    }

    $(".contenido-principal").html(contenido);
}

function guardarDeposito() {
    if ($("#deposito_nombre").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debes ingresar nombre del depósito", "ATENCIÓN");
        return;
    }
    let cabecera = {
        nombre_deposito: $("#deposito_nombre").val().trim(),
        ubicacion: $("#deposito_ubicacion").val().trim(),
        estado: $("#deposito_estado").val(),
    };
    let resp;
    if ($("#id_deposito").val() === "0") {
        resp = ejecutarAjax("controladores/deposito.php", "guardar=" + JSON.stringify(cabecera));
    } else {
        cabecera = { ...cabecera, id_deposito: $("#id_deposito").val() };
        resp = ejecutarAjax("controladores/deposito.php", "actualizar=" + JSON.stringify(cabecera));
    }

    // Try to parse JSON response and handle errors gracefully
    try {
        let json = JSON.parse(resp);
        if (json.ok) {
            mensaje_confirmacion(json.msg || "Operación realizada correctamente", "Éxito");
            mostrarListaDeposito();
        } else {
            mensaje_dialogo_info_ERROR(json.msg || 'Error en servidor al guardar depósito', 'Error');
        }
    } catch (e) {
        // If response is not JSON, log and show generic message
        console.error('Respuesta inesperada guardarDeposito:', resp);
        mensaje_dialogo_info_ERROR('Respuesta inválida del servidor. Revisa la consola y el log de PHP.', 'Error');
    }
}

function cargarTablaDeposito() {
    let datos = ejecutarAjax("controladores/deposito.php", "listar=1");
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='5' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_deposito}</td>`;
            fila += `<td>${item.nombre_deposito}</td>`;
            fila += `<td>${item.ubicacion ? item.ubicacion : ""}</td>`;
            fila += `<td><span class="badge bg-${item.estado === "ACTIVO" ? "success" : "danger"}">${item.estado}</span></td>`;
            fila += `<td class='text-end'>`;
            fila += `<button class='btn btn-warning editar-deposito'><i data-feather="edit"></i></button> `;
            fila += `<button class='btn btn-danger eliminar-deposito'><i data-feather="trash"></i></button>`;
            fila += `</td>`;
            fila += `</tr>`;
        });
    }
    $("#deposito_tb").html(fila);
    feather.replace();
}

$(document).on("click", ".eliminar-deposito", function () {
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
            let resp = ejecutarAjax("controladores/deposito.php", "eliminar=" + id);
            try {
                let json = JSON.parse(resp);
                if (json.ok) {
                    mensaje_confirmacion(json.msg || "Eliminado correctamente", "Éxito");
                    cargarTablaDeposito();
                } else {
                    mensaje_dialogo_info_ERROR(json.msg || 'Error eliminando depósito', 'Error');
                }
            } catch (e) {
                console.error('Respuesta eliminar deposito:', resp);
                mensaje_dialogo_info_ERROR('Respuesta inválida del servidor al eliminar.', 'Error');
            }
        }
    });
});

$(document).on("click", ".editar-deposito", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    let response = ejecutarAjax("controladores/deposito.php", "id=" + id);
    if (!response || String(response).trim() === "0") {
        mensaje_dialogo_info_ERROR("No se pudo obtener el registro o no existe.", "Error");
        return;
    }
    try {
        let json_registro = JSON.parse(response);
        // fetch the form partial and ensure it's valid (with fallbacks)
        let contenido = '';
        try {
            contenido = ejecutarAjaxHTML('paginas/referenciales/deposito/agregar.php', '');
        } catch (e) {
            console.error('ejecutarAjaxHTML exception (editar):', e);
        }
        if (!contenido || String(contenido).trim().length === 0) {
            try {
                contenido = dameContenido('paginas/referenciales/deposito/agregar.php');
            } catch (e) {
                console.error('dameContenido exception (editar):', e);
            }
        }
        if (!contenido || String(contenido).trim().length === 0) {
            // try raw post to capture server error HTML
            let raw = null;
            try {
                raw = ejecutarAjaxHTML('paginas/referenciales/deposito/agregar.php', '');
            } catch (e) {
                console.error('ejecutarAjaxHTML exception (editar raw):', e);
            }
            if (raw && String(raw).trim().length > 0) {
                console.error('Respuesta raw al cargar parcial deposito/agregar (editar):', raw);
                mensaje_dialogo_info_ERROR('El servidor devolvió contenido al cargar el formulario de edición. Revisa la consola para ver la respuesta completa.', 'Error servidor');
                $(".contenido-principal").html(raw);
                return;
            }

            mensaje_dialogo_info_ERROR('No se pudo cargar el formulario de edición. Verifica errores en el servidor.', 'Error');
            return;
        }
        $(".contenido-principal").html(contenido);
        $("#deposito_form_titulo").text("Editar Depósito");
        $("#id_deposito").val(json_registro.id_deposito);
        $("#deposito_nombre").val(json_registro.nombre_deposito);
        $("#deposito_ubicacion").val(json_registro.ubicacion ? json_registro.ubicacion : "");
        $("#deposito_estado").val(json_registro.estado);
    } catch (e) {
        console.error('Respuesta obtener deposito:', response);
        mensaje_dialogo_info_ERROR('Respuesta inválida del servidor al obtener el registro.', 'Error');
    }
});

function cancelarDeposito() {
    mostrarListaDeposito();
}

$(document).on("keyup", "#b_deposito", function () {
    let texto = $(this).val();
    if (texto.trim().length === 0) {
        cargarTablaDeposito();
        return;
    }
    let datos = ejecutarAjax("controladores/deposito.php", "buscar=" + texto);
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='5' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_deposito}</td>`;
            fila += `<td>${item.nombre_deposito}</td>`;
            fila += `<td>${item.ubicacion ? item.ubicacion : ""}</td>`;
            fila += `<td><span class="badge bg-${item.estado === "ACTIVO" ? "success" : "danger"}">${item.estado}</span></td>`;
            fila += `<td class='text-end'>`;
            fila += `<button class='btn btn-warning editar-deposito'><i data-feather="edit"></i></button> `;
            fila += `<button class='btn btn-danger eliminar-deposito'><i data-feather="trash"></i></button>`;
            fila += `</td>`;
            fila += `</tr>`;
        });
    }
    $("#deposito_tb").html(fila);
    feather.replace();
});

function cargarListaDepositoActivos(componente) {
    let datos = ejecutarAjax("controladores/deposito.php", "leer_activos=1");
    let option = "<option value='0'>Selecciona un Depósito</option>";
    if (datos !== "0") {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            option += `<option value='${item.id_deposito}'>${item.nombre_deposito}</option>`;
        });
    }
    $(componente).html(option);
}

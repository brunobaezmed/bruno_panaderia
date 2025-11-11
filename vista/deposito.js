function mostrarListaDeposito() {
    let contenido = dameContenido("paginas/referenciales/deposito/listar.php");
    $(".contenido-principal").html(contenido);
    cargarTablaDeposito();
}

function mostrarAgregarDeposito() {
    let contenido = dameContenido("paginas/referenciales/deposito/agregar.php");
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
    if ($("#id_deposito").val() === "0") {
        ejecutarAjax("controladores/deposito.php", "guardar=" + JSON.stringify(cabecera));
        mensaje_confirmacion("Guardado correctamente", "Éxito");
    } else {
        cabecera = { ...cabecera, id_deposito: $("#id_deposito").val() };
        ejecutarAjax("controladores/deposito.php", "actualizar=" + JSON.stringify(cabecera));
        mensaje_confirmacion("Actualizado correctamente", "Éxito");
    }
    mostrarListaDeposito();
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
            ejecutarAjax("controladores/deposito.php", "eliminar=" + id);
            mensaje_confirmacion("Eliminado correctamente", "Éxito");
            cargarTablaDeposito();
        }
    });
});

$(document).on("click", ".editar-deposito", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    let response = ejecutarAjax("controladores/deposito.php", "id=" + id);
    if (response === "0") {
        mensaje_dialogo_info_ERROR("No se pudo obtener el registro", "Error");
        return;
    }
    let json_registro = JSON.parse(response);
    let contenido = dameContenido("paginas/referenciales/deposito/agregar.php");
    $(".contenido-principal").html(contenido);
    $("#deposito_form_titulo").text("Editar Depósito");
    $("#id_deposito").val(json_registro.id_deposito);
    $("#deposito_nombre").val(json_registro.nombre_deposito);
    $("#deposito_ubicacion").val(json_registro.ubicacion ? json_registro.ubicacion : "");
    $("#deposito_estado").val(json_registro.estado);
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

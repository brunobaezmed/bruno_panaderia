function mostrarListaClientes() {
    let contenido = dameContenido("paginas/referenciales/clientes/listar.php");
    $(".contenido-principal").html(contenido);
    cargarTablaClientes();
}

function mostrarAgregarCliente() {
    let contenido = dameContenido("paginas/referenciales/clientes/agregar.php");
    $(".contenido-principal").html(contenido);
}

function guardarCliente() {
    if ($("#cliente_nombre").val().trim().length === 0) {
        mensaje_dialogo_info_ERROR("Debes ingresar nombre del cliente", "ATENCIÓN");
        return;
    }
    let cabecera = {
        nombre_cliente: $("#cliente_nombre").val().trim(),
        telefono: $("#cliente_telefono").val().trim(),
        direccion: $("#cliente_direccion").val().trim(),
        email: $("#cliente_email").val().trim(),
        estado: $("#cliente_estado").val(),
    };
    if ($("#id_cliente").val() === "0") {
        ejecutarAjax("controladores/clientes.php", "guardar=" + JSON.stringify(cabecera));
        mensaje_confirmacion("Guardado correctamente", "Éxito");
    } else {
        cabecera = { ...cabecera, id_cliente: $("#id_cliente").val() };
        ejecutarAjax("controladores/clientes.php", "actualizar=" + JSON.stringify(cabecera));
        mensaje_confirmacion("Actualizado correctamente", "Éxito");
    }
    mostrarListaClientes();
}

function cargarTablaClientes() {
    let datos = ejecutarAjax("controladores/clientes.php", "listar=1");
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='7' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_cliente}</td>`;
            fila += `<td>${item.nombre_cliente}</td>`;
            fila += `<td>${item.telefono ? item.telefono : ""}</td>`;
            fila += `<td>${item.direccion ? item.direccion : ""}</td>`;
            fila += `<td>${item.email ? item.email : ""}</td>`;
            fila += `<td><span class="badge bg-${item.estado === "ACTIVO" ? "success" : "danger"}">${item.estado}</span></td>`;
            fila += `<td class='text-end'>`;
            fila += `<button class='btn btn-warning editar-cliente'><i data-feather="edit"></i></button> `;
            fila += `<button class='btn btn-danger eliminar-cliente'><i data-feather="trash"></i></button>`;
            fila += `</td>`;
            fila += `</tr>`;
        });
    }
    $("#clientes_tb").html(fila);
    feather.replace();
}

$(document).on("click", ".eliminar-cliente", function () {
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
            ejecutarAjax("controladores/clientes.php", "eliminar=" + id);
            mensaje_confirmacion("Eliminado correctamente", "Éxito");
            cargarTablaClientes();
        }
    });
});

$(document).on("click", ".editar-cliente", function () {
    let id = $(this).closest("tr").find("td:eq(0)").text();
    let response = ejecutarAjax("controladores/clientes.php", "id=" + id);
    if (response === "0") {
        mensaje_dialogo_info_ERROR("No se pudo obtener el registro", "Error");
        return;
    }
    let json_registro = JSON.parse(response);
    let contenido = dameContenido("paginas/referenciales/clientes/agregar.php");
    $(".contenido-principal").html(contenido);
    $("#cliente_form_titulo").text("Editar Cliente");
    $("#id_cliente").val(json_registro.id_cliente);
    $("#cliente_nombre").val(json_registro.nombre_cliente);
    $("#cliente_telefono").val(json_registro.telefono ? json_registro.telefono : "");
    $("#cliente_email").val(json_registro.email ? json_registro.email : "");
    $("#cliente_direccion").val(json_registro.direccion ? json_registro.direccion : "");
    $("#cliente_estado").val(json_registro.estado);
});

function cancelarCliente() {
    mostrarListaClientes();
}

$(document).on("keyup", "#b_cliente", function () {
    let texto = $(this).val();
    if (texto.trim().length === 0) {
        cargarTablaClientes();
        return;
    }
    let datos = ejecutarAjax("controladores/clientes.php", "buscar=" + texto);
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='7' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            fila += `<tr>`;
            fila += `<td>${item.id_cliente}</td>`;
            fila += `<td>${item.nombre_cliente}</td>`;
            fila += `<td>${item.telefono ? item.telefono : ""}</td>`;
            fila += `<td>${item.direccion ? item.direccion : ""}</td>`;
            fila += `<td>${item.email ? item.email : ""}</td>`;
            fila += `<td><span class="badge bg-${item.estado === "ACTIVO" ? "success" : "danger"}">${item.estado}</span></td>`;
            fila += `<td class='text-end'>`;
            fila += `<button class='btn btn-warning editar-cliente'><i data-feather="edit"></i></button> `;
            fila += `<button class='btn btn-danger eliminar-cliente'><i data-feather="trash"></i></button>`;
            fila += `</td>`;
            fila += `</tr>`;
        });
    }
    $("#clientes_tb").html(fila);
    feather.replace();
});

function cargarListaClientesActivos(componente) {
    let datos = ejecutarAjax("controladores/clientes.php", "leer_activos=1");
    let option = "<option value='0'>Selecciona un Cliente</option>";
    if (datos !== "0") {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            option += `<option value='${item.id_cliente}'>${item.nombre_cliente}</option>`;
        });
    }
    $(componente).html(option);
}

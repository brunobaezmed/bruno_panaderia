function mostrarLibroMovimientos() {
    let contenido = dameContenido("paginas/referenciales/libro_movimientos/listar.php");
    $(".contenido-principal").html(contenido);
    cargarTablaMovimientos();
    cargarListaDepositos("#filtro_deposito");
    cargarListaProductos("#filtro_producto");
}

function cargarTablaMovimientos() {
    let datos = ejecutarAjax("controladores/libro_movimientos.php", "listar=1");
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='8' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            let color_tipo = "secondary";
            if (item.tipo_movimiento === "Ingreso") color_tipo = "success";
            else if (item.tipo_movimiento === "Egreso") color_tipo = "danger";
            else if (item.tipo_movimiento === "Transferencia") color_tipo = "info";
            else if (item.tipo_movimiento === "Ajuste") color_tipo = "warning";
            
            fila += `<tr>`;
            fila += `<td>${item.id_movimiento}</td>`;
            fila += `<td>${item.fecha}</td>`;
            fila += `<td><span class="badge bg-${color_tipo}">${item.tipo_movimiento}</span></td>`;
            fila += `<td>${item.nombre_producto}</td>`;
            fila += `<td>${item.nombre_deposito ? item.nombre_deposito : '-'}</td>`;
            fila += `<td class="${item.cantidad > 0 ? 'text-success' : 'text-danger'}">${item.cantidad > 0 ? '+' : ''}${item.cantidad}</td>`;
            fila += `<td><small>${item.referencia ? item.referencia : '-'}</small></td>`;
            fila += `<td><small>${item.observacion ? item.observacion : '-'}</small></td>`;
            fila += `</tr>`;
        });
    }
    $("#movimientos_tb").html(fila);
}

function aplicarFiltros() {
    let tipo_movimiento = $("#filtro_tipo").val();
    let id_deposito = $("#filtro_deposito").val();
    let id_producto = $("#filtro_producto").val();
    let fecha_desde = $("#filtro_fecha_desde").val();
    let fecha_hasta = $("#filtro_fecha_hasta").val();

    let post_data = "listar_filtros=1";
    if (tipo_movimiento) post_data += "&tipo_movimiento=" + encodeURIComponent(tipo_movimiento);
    if (id_deposito) post_data += "&id_deposito=" + encodeURIComponent(id_deposito);
    if (id_producto) post_data += "&id_producto=" + encodeURIComponent(id_producto);
    if (fecha_desde) post_data += "&fecha_desde=" + encodeURIComponent(fecha_desde);
    if (fecha_hasta) post_data += "&fecha_hasta=" + encodeURIComponent(fecha_hasta);

    let datos = ejecutarAjax("controladores/libro_movimientos.php", post_data);
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='8' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            let color_tipo = "secondary";
            if (item.tipo_movimiento === "Ingreso") color_tipo = "success";
            else if (item.tipo_movimiento === "Egreso") color_tipo = "danger";
            else if (item.tipo_movimiento === "Transferencia") color_tipo = "info";
            else if (item.tipo_movimiento === "Ajuste") color_tipo = "warning";
            
            fila += `<tr>`;
            fila += `<td>${item.id_movimiento}</td>`;
            fila += `<td>${item.fecha}</td>`;
            fila += `<td><span class="badge bg-${color_tipo}">${item.tipo_movimiento}</span></td>`;
            fila += `<td>${item.nombre_producto}</td>`;
            fila += `<td>${item.nombre_deposito ? item.nombre_deposito : '-'}</td>`;
            fila += `<td class="${item.cantidad > 0 ? 'text-success' : 'text-danger'}">${item.cantidad > 0 ? '+' : ''}${item.cantidad}</td>`;
            fila += `<td><small>${item.referencia ? item.referencia : '-'}</small></td>`;
            fila += `<td><small>${item.observacion ? item.observacion : '-'}</small></td>`;
            fila += `</tr>`;
        });
    }
    $("#movimientos_tb").html(fila);
}

function limpiarFiltros() {
    $("#filtro_tipo").val("");
    $("#filtro_deposito").val("0");
    $("#filtro_producto").val("0");
    $("#filtro_fecha_desde").val("");
    $("#filtro_fecha_hasta").val("");
    $("#buscar_movimiento").val("");
    cargarTablaMovimientos();
}

function buscarMovimiento() {
    let texto = $("#buscar_movimiento").val();
    if (texto.trim().length === 0) {
        cargarTablaMovimientos();
        return;
    }
    let datos = ejecutarAjax("controladores/libro_movimientos.php", "buscar=" + encodeURIComponent(texto));
    let fila = "";
    if (datos === "0") {
        fila = `<tr><td colspan='8' class='text-center'>No hay registros</td></tr>`;
    } else {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) {
            let color_tipo = "secondary";
            if (item.tipo_movimiento === "Ingreso") color_tipo = "success";
            else if (item.tipo_movimiento === "Egreso") color_tipo = "danger";
            else if (item.tipo_movimiento === "Transferencia") color_tipo = "info";
            else if (item.tipo_movimiento === "Ajuste") color_tipo = "warning";
            
            fila += `<tr>`;
            fila += `<td>${item.id_movimiento}</td>`;
            fila += `<td>${item.fecha}</td>`;
            fila += `<td><span class="badge bg-${color_tipo}">${item.tipo_movimiento}</span></td>`;
            fila += `<td>${item.nombre_producto}</td>`;
            fila += `<td>${item.nombre_deposito ? item.nombre_deposito : '-'}</td>`;
            fila += `<td class="${item.cantidad > 0 ? 'text-success' : 'text-danger'}">${item.cantidad > 0 ? '+' : ''}${item.cantidad}</td>`;
            fila += `<td><small>${item.referencia ? item.referencia : '-'}</small></td>`;
            fila += `<td><small>${item.observacion ? item.observacion : '-'}</small></td>`;
            fila += `</tr>`;
        });
    }
    $("#movimientos_tb").html(fila);
}

function cargarListaDepositos(componente) {
    let datos = ejecutarAjax("controladores/deposito.php", "leer_activos=1");
    let option = "<option value='0'>Todos</option>";
    if (datos !== "0") {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) { option += `<option value='${item.id_deposito}'>${item.nombre_deposito}</option>`; });
    }
    $(componente).html(option);
}

function cargarListaProductos(componente) {
    let datos = ejecutarAjax("controladores/productos.php", "leer_activos=1");
    let option = "<option value='0'>Todos</option>";
    if (datos !== "0") {
        let json_datos = JSON.parse(datos);
        json_datos.map(function (item) { option += `<option value='${item.id_producto}'>${item.nombre_producto}</option>`; });
    }
    $(componente).html(option);
}

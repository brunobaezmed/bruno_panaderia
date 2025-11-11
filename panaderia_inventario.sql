-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-11-2025 a las 23:11:26
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `panaderia_inventario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ajustes_stock`
--

CREATE TABLE `ajustes_stock` (
  `id_ajuste` int(11) NOT NULL,
  `id_deposito` int(11) NOT NULL,
  `fecha_ajuste` date NOT NULL,
  `tipo_ajuste` enum('Aumento','Disminución') NOT NULL,
  `motivo` varchar(200) DEFAULT NULL,
  `responsable` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ajustes_stock`
--

INSERT INTO `ajustes_stock` (`id_ajuste`, `id_deposito`, `fecha_ajuste`, `tipo_ajuste`, `motivo`, `responsable`) VALUES
(1, 1, '2025-11-02', 'Disminución', 'Productos vencidos', 'Supervisor Juan Pérez'),
(2, 2, '2025-11-02', 'Aumento', 'Inventario real mayor que el registrado', 'Encargada Ana Gómez');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre_cliente` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre_cliente`, `telefono`, `direccion`, `email`) VALUES
(1, 'Carlos López', '0982-111222', 'Av. Libertad 123', 'carlos.lopez@email.com'),
(2, 'Ana Gómez', '0971-333444', 'Calle Palma 456', 'ana.gomez@email.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `depositos`
--

CREATE TABLE `depositos` (
  `id_deposito` int(11) NOT NULL,
  `nombre_deposito` varchar(100) NOT NULL,
  `ubicacion` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `depositos`
--

INSERT INTO `depositos` (`id_deposito`, `nombre_deposito`, `ubicacion`) VALUES
(1, 'Depósito Central', 'Av. Industrial 1000'),
(2, 'Depósito Sucursal 1', 'Calle Principal 50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ajuste`
--

CREATE TABLE `detalle_ajuste` (
  `id_detalle_ajuste` int(11) NOT NULL,
  `id_ajuste` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_ajuste`
--

INSERT INTO `detalle_ajuste` (`id_detalle_ajuste`, `id_ajuste`, `id_producto`, `cantidad`) VALUES
(1, 1, 3, 5),
(2, 1, 2, 2),
(3, 2, 1, 10);

--
-- Disparadores `detalle_ajuste`
--
DELIMITER $$
CREATE TRIGGER `aplicar_ajuste_stock` AFTER INSERT ON `detalle_ajuste` FOR EACH ROW BEGIN
    DECLARE tipo VARCHAR(20);
    DECLARE deposito INT;

    -- Buscar el tipo de ajuste y el depósito
    SELECT tipo_ajuste, id_deposito
    INTO tipo, deposito
    FROM ajustes_stock
    WHERE id_ajuste = NEW.id_ajuste;

    -- Si es aumento, sumar al stock
    IF tipo = 'Aumento' THEN
        UPDATE stock_depositos
        SET cantidad = cantidad + NEW.cantidad
        WHERE id_producto = NEW.id_producto AND id_deposito = deposito;
    -- Si es disminución, restar del stock
    ELSE
        UPDATE stock_depositos
        SET cantidad = cantidad - NEW.cantidad
        WHERE id_producto = NEW.id_producto AND id_deposito = deposito;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `registrar_movimiento_ajuste` AFTER INSERT ON `detalle_ajuste` FOR EACH ROW BEGIN
    DECLARE tipo VARCHAR(20);
    DECLARE deposito INT;

    SELECT tipo_ajuste, id_deposito
    INTO tipo, deposito
    FROM ajustes_stock
    WHERE id_ajuste = NEW.id_ajuste;

    -- Registrar movimiento según tipo
    IF tipo = 'Aumento' THEN
        INSERT INTO libro_movimientos (fecha, tipo_movimiento, id_producto, id_deposito, cantidad, referencia, observacion)
        VALUES (
            CURDATE(),
            'Ajuste',
            NEW.id_producto,
            deposito,
            NEW.cantidad,
            CONCAT('Ajuste #', NEW.id_ajuste),
            'Ajuste por aumento'
        );
    ELSE
        INSERT INTO libro_movimientos (fecha, tipo_movimiento, id_producto, id_deposito, cantidad, referencia, observacion)
        VALUES (
            CURDATE(),
            'Ajuste',
            NEW.id_producto,
            deposito,
            -NEW.cantidad,
            CONCAT('Ajuste #', NEW.id_ajuste),
            'Ajuste por disminución'
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_egreso`
--

CREATE TABLE `detalle_egreso` (
  `id_detalle_egreso` int(11) NOT NULL,
  `id_egreso` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) GENERATED ALWAYS AS (`cantidad` * `precio_venta`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_egreso`
--

INSERT INTO `detalle_egreso` (`id_detalle_egreso`, `id_egreso`, `id_producto`, `cantidad`, `precio_venta`) VALUES
(1, 1, 1, 10, 6000.00),
(2, 1, 2, 5, 9000.00),
(3, 1, 3, 8, 5000.00);

--
-- Disparadores `detalle_egreso`
--
DELIMITER $$
CREATE TRIGGER `actualizar_stock_egreso` AFTER INSERT ON `detalle_egreso` FOR EACH ROW BEGIN
    UPDATE productos
    SET stock_actual = stock_actual - NEW.cantidad
    WHERE id_producto = NEW.id_producto;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `registrar_movimiento_egreso` AFTER INSERT ON `detalle_egreso` FOR EACH ROW BEGIN
    INSERT INTO libro_movimientos (fecha, tipo_movimiento, id_producto, id_deposito, cantidad, referencia, observacion)
    VALUES (
        CURDATE(),
        'Egreso',
        NEW.id_producto,
        1, -- depósito central por defecto
        -NEW.cantidad, -- cantidad negativa porque es salida
        CONCAT('Venta #', NEW.id_egreso),
        'Egreso por venta'
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ingreso`
--

CREATE TABLE `detalle_ingreso` (
  `id_detalle` int(11) NOT NULL,
  `id_ingreso` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_compra` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) GENERATED ALWAYS AS (`cantidad` * `precio_compra`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_ingreso`
--

INSERT INTO `detalle_ingreso` (`id_detalle`, `id_ingreso`, `id_producto`, `cantidad`, `precio_compra`) VALUES
(1, 1, 1, 50, 4800.00),
(2, 1, 2, 20, 7500.00),
(3, 1, 3, 30, 4300.00);

--
-- Disparadores `detalle_ingreso`
--
DELIMITER $$
CREATE TRIGGER `actualizar_stock_ingreso` AFTER INSERT ON `detalle_ingreso` FOR EACH ROW BEGIN
    UPDATE productos
    SET stock_actual = stock_actual + NEW.cantidad
    WHERE id_producto = NEW.id_producto;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `registrar_movimiento_ingreso` AFTER INSERT ON `detalle_ingreso` FOR EACH ROW BEGIN
    INSERT INTO libro_movimientos (fecha, tipo_movimiento, id_producto, id_deposito, cantidad, referencia, observacion)
    VALUES (
        CURDATE(),
        'Ingreso',
        NEW.id_producto,
        1, -- depósito central por defecto
        NEW.cantidad,
        CONCAT('Ingreso #', NEW.id_ingreso),
        'Compra a proveedor'
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_transferencia`
--

CREATE TABLE `detalle_transferencia` (
  `id_detalle_transferencia` int(11) NOT NULL,
  `id_transferencia` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_transferencia`
--

INSERT INTO `detalle_transferencia` (`id_detalle_transferencia`, `id_transferencia`, `id_producto`, `cantidad`) VALUES
(1, 1, 1, 15),
(2, 1, 3, 10);

--
-- Disparadores `detalle_transferencia`
--
DELIMITER $$
CREATE TRIGGER `actualizar_stock_transferencia` AFTER INSERT ON `detalle_transferencia` FOR EACH ROW BEGIN
    DECLARE origen INT;
    DECLARE destino INT;

    -- Buscar los depósitos de origen y destino
    SELECT id_origen, id_destino 
    INTO origen, destino
    FROM transferencias
    WHERE id_transferencia = NEW.id_transferencia;

    -- Restar del depósito de origen
    UPDATE stock_depositos
    SET cantidad = cantidad - NEW.cantidad
    WHERE id_producto = NEW.id_producto AND id_deposito = origen;

    -- Sumar al depósito de destino
    UPDATE stock_depositos
    SET cantidad = cantidad + NEW.cantidad
    WHERE id_producto = NEW.id_producto AND id_deposito = destino;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `registrar_movimiento_transferencia` AFTER INSERT ON `detalle_transferencia` FOR EACH ROW BEGIN
    DECLARE origen INT;
    DECLARE destino INT;
    
    SELECT id_origen, id_destino
    INTO origen, destino
    FROM transferencias
    WHERE id_transferencia = NEW.id_transferencia;

    -- Movimiento negativo (salida del depósito origen)
    INSERT INTO libro_movimientos (fecha, tipo_movimiento, id_producto, id_deposito, cantidad, referencia, observacion)
    VALUES (
        CURDATE(),
        'Transferencia',
        NEW.id_producto,
        origen,
        -NEW.cantidad,
        CONCAT('Transferencia #', NEW.id_transferencia),
        'Salida del depósito origen'
    );

    -- Movimiento positivo (entrada en el depósito destino)
    INSERT INTO libro_movimientos (fecha, tipo_movimiento, id_producto, id_deposito, cantidad, referencia, observacion)
    VALUES (
        CURDATE(),
        'Transferencia',
        NEW.id_producto,
        destino,
        NEW.cantidad,
        CONCAT('Transferencia #', NEW.id_transferencia),
        'Entrada al depósito destino'
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `egresos_ventas`
--

CREATE TABLE `egresos_ventas` (
  `id_egreso` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `fecha_venta` date NOT NULL,
  `total_venta` decimal(10,2) DEFAULT 0.00,
  `observacion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `egresos_ventas`
--

INSERT INTO `egresos_ventas` (`id_egreso`, `id_cliente`, `fecha_venta`, `total_venta`, `observacion`) VALUES
(1, 1, '2025-11-02', 0.00, 'Venta de productos para cafetería local');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingresos_compras`
--

CREATE TABLE `ingresos_compras` (
  `id_ingreso` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `total_compra` decimal(10,2) DEFAULT 0.00,
  `observacion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ingresos_compras`
--

INSERT INTO `ingresos_compras` (`id_ingreso`, `id_proveedor`, `fecha_ingreso`, `total_compra`, `observacion`) VALUES
(1, 1, '2025-11-02', 0.00, 'Compra semanal de insumos básicos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libro_movimientos`
--

CREATE TABLE `libro_movimientos` (
  `id_movimiento` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `tipo_movimiento` enum('Ingreso','Egreso','Transferencia','Ajuste') NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_deposito` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `observacion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre_producto` varchar(100) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `unidad_medida` varchar(20) DEFAULT NULL,
  `stock_actual` int(11) DEFAULT 0,
  `stock_minimo` int(11) DEFAULT 10,
  `precio_unitario` decimal(10,2) NOT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre_producto`, `descripcion`, `unidad_medida`, `stock_actual`, `stock_minimo`, `precio_unitario`, `estado`) VALUES
(1, 'Harina 000', 'Harina blanca para pan', 'kg', 140, 10, 5000.00, 'Activo'),
(2, 'Levadura seca', 'Levadura en polvo 100g', 'paquete', 65, 10, 8000.00, 'Activo'),
(3, 'Azúcar', 'Azúcar refinada', 'kg', 102, 10, 4500.00, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `nombre_proveedor` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id_proveedor`, `nombre_proveedor`, `telefono`, `direccion`, `email`) VALUES
(1, 'Molinos San Juan', '0981-123456', 'Av. Central 456', 'contacto@molinos.com'),
(2, 'Pan Ingredientes SRL', '0972-654321', 'Calle Flores 120', 'ventas@paningred.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `cod_rol` int(11) NOT NULL,
  `descripcion_rol` varchar(100) NOT NULL,
  `estado` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock_depositos`
--

CREATE TABLE `stock_depositos` (
  `id_stock` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_deposito` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `stock_depositos`
--

INSERT INTO `stock_depositos` (`id_stock`, `id_producto`, `id_deposito`, `cantidad`) VALUES
(1, 1, 1, 85),
(2, 2, 1, 48),
(3, 3, 1, 65),
(4, 1, 2, 45),
(5, 2, 2, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transferencias`
--

CREATE TABLE `transferencias` (
  `id_transferencia` int(11) NOT NULL,
  `id_origen` int(11) NOT NULL,
  `id_destino` int(11) NOT NULL,
  `fecha_transferencia` date NOT NULL,
  `observacion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `transferencias`
--

INSERT INTO `transferencias` (`id_transferencia`, `id_origen`, `id_destino`, `fecha_transferencia`, `observacion`) VALUES
(1, 1, 2, '2025-11-02', 'Reposición de stock sucursal 1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `cod_usuario` int(11) NOT NULL,
  `nombre_apellido` varchar(50) NOT NULL,
  `nick_name` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `estado` varchar(10) NOT NULL,
  `cod_rol` int(11) NOT NULL,
  `intentos` int(11) NOT NULL DEFAULT 0,
  `limite_intentos` int(11) NOT NULL DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ajustes_stock`
--
ALTER TABLE `ajustes_stock`
  ADD PRIMARY KEY (`id_ajuste`),
  ADD KEY `id_deposito` (`id_deposito`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indices de la tabla `depositos`
--
ALTER TABLE `depositos`
  ADD PRIMARY KEY (`id_deposito`);

--
-- Indices de la tabla `detalle_ajuste`
--
ALTER TABLE `detalle_ajuste`
  ADD PRIMARY KEY (`id_detalle_ajuste`),
  ADD KEY `id_ajuste` (`id_ajuste`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `detalle_egreso`
--
ALTER TABLE `detalle_egreso`
  ADD PRIMARY KEY (`id_detalle_egreso`),
  ADD KEY `id_egreso` (`id_egreso`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `detalle_ingreso`
--
ALTER TABLE `detalle_ingreso`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_ingreso` (`id_ingreso`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `detalle_transferencia`
--
ALTER TABLE `detalle_transferencia`
  ADD PRIMARY KEY (`id_detalle_transferencia`),
  ADD KEY `id_transferencia` (`id_transferencia`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `egresos_ventas`
--
ALTER TABLE `egresos_ventas`
  ADD PRIMARY KEY (`id_egreso`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indices de la tabla `ingresos_compras`
--
ALTER TABLE `ingresos_compras`
  ADD PRIMARY KEY (`id_ingreso`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `libro_movimientos`
--
ALTER TABLE `libro_movimientos`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_deposito` (`id_deposito`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`cod_rol`);

--
-- Indices de la tabla `stock_depositos`
--
ALTER TABLE `stock_depositos`
  ADD PRIMARY KEY (`id_stock`),
  ADD UNIQUE KEY `id_producto` (`id_producto`,`id_deposito`),
  ADD KEY `id_deposito` (`id_deposito`);

--
-- Indices de la tabla `transferencias`
--
ALTER TABLE `transferencias`
  ADD PRIMARY KEY (`id_transferencia`),
  ADD KEY `id_origen` (`id_origen`),
  ADD KEY `id_destino` (`id_destino`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`cod_usuario`),
  ADD KEY `fk_cod_rol` (`cod_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ajustes_stock`
--
ALTER TABLE `ajustes_stock`
  MODIFY `id_ajuste` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `depositos`
--
ALTER TABLE `depositos`
  MODIFY `id_deposito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalle_ajuste`
--
ALTER TABLE `detalle_ajuste`
  MODIFY `id_detalle_ajuste` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `detalle_egreso`
--
ALTER TABLE `detalle_egreso`
  MODIFY `id_detalle_egreso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `detalle_ingreso`
--
ALTER TABLE `detalle_ingreso`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `detalle_transferencia`
--
ALTER TABLE `detalle_transferencia`
  MODIFY `id_detalle_transferencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `egresos_ventas`
--
ALTER TABLE `egresos_ventas`
  MODIFY `id_egreso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ingresos_compras`
--
ALTER TABLE `ingresos_compras`
  MODIFY `id_ingreso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `libro_movimientos`
--
ALTER TABLE `libro_movimientos`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `cod_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `stock_depositos`
--
ALTER TABLE `stock_depositos`
  MODIFY `id_stock` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `transferencias`
--
ALTER TABLE `transferencias`
  MODIFY `id_transferencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `cod_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ajustes_stock`
--
ALTER TABLE `ajustes_stock`
  ADD CONSTRAINT `ajustes_stock_ibfk_1` FOREIGN KEY (`id_deposito`) REFERENCES `depositos` (`id_deposito`);

--
-- Filtros para la tabla `detalle_ajuste`
--
ALTER TABLE `detalle_ajuste`
  ADD CONSTRAINT `detalle_ajuste_ibfk_1` FOREIGN KEY (`id_ajuste`) REFERENCES `ajustes_stock` (`id_ajuste`),
  ADD CONSTRAINT `detalle_ajuste_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `detalle_egreso`
--
ALTER TABLE `detalle_egreso`
  ADD CONSTRAINT `detalle_egreso_ibfk_1` FOREIGN KEY (`id_egreso`) REFERENCES `egresos_ventas` (`id_egreso`),
  ADD CONSTRAINT `detalle_egreso_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `detalle_ingreso`
--
ALTER TABLE `detalle_ingreso`
  ADD CONSTRAINT `detalle_ingreso_ibfk_1` FOREIGN KEY (`id_ingreso`) REFERENCES `ingresos_compras` (`id_ingreso`),
  ADD CONSTRAINT `detalle_ingreso_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `detalle_transferencia`
--
ALTER TABLE `detalle_transferencia`
  ADD CONSTRAINT `detalle_transferencia_ibfk_1` FOREIGN KEY (`id_transferencia`) REFERENCES `transferencias` (`id_transferencia`),
  ADD CONSTRAINT `detalle_transferencia_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `egresos_ventas`
--
ALTER TABLE `egresos_ventas`
  ADD CONSTRAINT `egresos_ventas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`);

--
-- Filtros para la tabla `ingresos_compras`
--
ALTER TABLE `ingresos_compras`
  ADD CONSTRAINT `ingresos_compras_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`);

--
-- Filtros para la tabla `libro_movimientos`
--
ALTER TABLE `libro_movimientos`
  ADD CONSTRAINT `libro_movimientos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `libro_movimientos_ibfk_2` FOREIGN KEY (`id_deposito`) REFERENCES `depositos` (`id_deposito`);

--
-- Filtros para la tabla `stock_depositos`
--
ALTER TABLE `stock_depositos`
  ADD CONSTRAINT `stock_depositos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `stock_depositos_ibfk_2` FOREIGN KEY (`id_deposito`) REFERENCES `depositos` (`id_deposito`);

--
-- Filtros para la tabla `transferencias`
--
ALTER TABLE `transferencias`
  ADD CONSTRAINT `transferencias_ibfk_1` FOREIGN KEY (`id_origen`) REFERENCES `depositos` (`id_deposito`),
  ADD CONSTRAINT `transferencias_ibfk_2` FOREIGN KEY (`id_destino`) REFERENCES `depositos` (`id_deposito`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`cod_rol`) REFERENCES `roles` (`cod_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*USUARIO */
CREATE SEQUENCE user_seq START WITH 1,
CREATE OR REPLACE TRIGGER user_bir
BEFORE INSERT ON usuario
FOR EACH ROW
BEGIN
    SELECT user_seq.NEXTVAL
    INTO  :new.clave
    FROM dual,
END,

/* Secuencia detalle_catalogo */
CREATE SEQUENCE catalogo_sequence START WITH 1,
CREATE OR REPLACE TRIGGER catalogo_trigger1
BEFORE INSERT ON detalle_catalogo
FOR EACH ROW
BEGIN
    SELECT catalogo_sequence.NEXTVAL
    INTO :new.iddetallecatalogo
    FROM dual,
END,

/* Secuencia de categoria */
CREATE SEQUENCE categoria_sequence START WITH 1,
CREATE OR REPLACE TRIGGER categoria_trigger2
BEFORE INSERT ON categoria
FOR EACH ROW
BEGIN
    SELECT categoria_sequence.NEXTVAL
    INTO :new.id_categoria
    FROM dual,
END,

/* Secuencia de carrito */
CREATE SEQUENCE carrito_secuencia START WITH 1,
CREATE OR REPLACE TRIGGER carrito_trigger
BEFORE INSERT ON carrito
FOR EACH ROW
BEGIN
    SELECT carrito_secuencia.NEXTVAL
    INTO :new.idcarrito
    FROM dual,
END,

/* ID Producto */
CREATE SEQUENCE producto_codigo START WITH 1,
CREATE OR REPLACE TRIGGER producto_trigger
BEFORE INSERT ON producto
FOR EACH ROW
BEGIN
    SELECT producto_codigo.NEXTVAL
    INTO :new.idproducto
    FROM dual,
END,

/* DETALLE CARRITO */
CREATE SEQUENCE detallecarrito START WITH 1,
CREATE OR REPLACE TRIGGER de_carrito
BEFORE INSERT on detalle_carrito
FOR EACH ROW
BEGIN
    SELECT detallecarrito.NEXTVAL
    INTO :new.correlativo
    FROM dual,
END,

/*FActura*/
CREATE SEQUENCE facturaseq start with 1,
CREATE SEQUENCE detafacturaseq start with 1,
CREATE OR REPLACE TRIGGER detallefact
BEFORE INSERT on detalle_factura
FOR EACH ROW
BEGIN
    SELECT detafacturaseq.NEXTVAL
    INTO :new.correlativo
    FROM dual,
END,
/* comentario y puntuacion */
CREATE SEQUENCE punteosecuencia START WITH 1,
CREATE OR REPLACE TRIGGER punteo_producto
BEFORE INSERT ON comentario_puntuacion
FOR EACH ROW
BEGIN
    SELECT punteosecuencia.NEXTVAL
    INTO :new.idcomentario
    FROM dual,
END,

CREATe SEQUENCE bitacorasecuencia start with 1,
CREATE OR REPLACE TRIGGER bittrigger
BEFORE INSERT ON bitacora
FOR EACH ROW
BEGIN
    SELECT bitacorasecuencia.NEXTVAL
    INTO :new.idbitacora
    FROM dual,
END,

--INSERT INTO disco VALUES(0,'mia.disk',default),
--SELECT * FROM disco,

ALTER SESSION SET NLS_DATE_FORMAT = 'dd/mm/yyyy',
commit,

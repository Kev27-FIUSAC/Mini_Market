--PROCEDIMIENTOS PROYECTO 2
--INSERTAR USUARIO
create or replace PROCEDURE InsertarUser(rol1 in varchar2, nombre1 in varchar2, apellido1 in varchar2, contrasena1 in varchar2, correo1 in varchar2, telefono1 in varchar2, genero1 in varchar2, fotografia1 in clob, fecha_n1 in date, fecha_r1 in date, direccion1 in varchar2, credito1 in decimal, ganancia1 in decimal, clase1 in varchar2, estado1 in int)
IS
BEGIN
    DECLARE
        claves int := 0,
        idcarrito2 int := 0,
    BEGIN
        INSERT INTO usuario VALUES(0,rol1,nombre1,apellido1,contrasena1,correo1,telefono1,genero1,fecha_n1,fecha_r1,direccion1,credito1,ganancia1,clase1,estado1,fotografia1,0),
        COMMIT,
        SELECT usuario.clave INTO claves FROM Proyecto2.usuario WHERE usuario.correo = correo1,
        DBMS_OUTPUT.PUT_LINE (claves),
        INSERT INTO carrito VALUES(0,claves,default),
        COMMIT,
        DBMS_OUTPUT.PUT_LINE ('USUARIO CREADO'),
        INSERT INTO bitacora VALUES(0,claves,fecha_r1,'Se registro el usuario'),
        COMMIT,
    END,    
END,

--PROCESO INICIAL DE LA CARGA
create or replace PROCEDURE ejecutarinsertarproducto(pathcsv in varchar2, claveu in int)
IS
BEGIN
    DECLARE
    archivo varchar2(1000),
    BEGIN
        archivo :=  REGEXP_SUBSTR(pathcsv,'[^/]+',1,10),
        DBMS_OUTPUT.PUT_LINE (archivo),
        DBMS_OUTPUT.PUT_LINE('SERVIDOR'),
        BEGIN
            realizarcarga(archivo,claveu),
            
            /*Luego de hacer la carga, pasar los datos a la tabla detalle_catalogo */
            --Usar la vista para insertar los datos y la clave del usuario 
            EXECUTE IMMEDIATE 'INSERT INTO detalle_catalogo(clave,codigoproducto,idproducto,idcategoria,precio,color,imagen,cantidad) SELECT usuario,codigo,idproducto,categoria,precio,color,imagen,cantidad FROM pasarproductos',
            commit,
        END,
   end,
end,  

--PROCESO DE CARGA
create or replace PROCEDURE realizarcarga(archivo in varchar2, usuario in int)
is
begin
    DECLARE
       filet utl_file.FILE_TYPE,
       conteo int := 0,
       padre varchar2(1000),
       hijo varchar2(1000),
       codigo int := 0,
       salida varchar2(1000),
       tempcodigo int,
       tempnombre varchar2(1000),
       tempcategoria varchar2(1000),
       tempprecio number(38,4),
       tempimagen varchar2(1000),
       tempcolor varchar2(1000),
       tempcantidad varchar2(100),
       tempdescripcion varchar2(4000),
       cantidad NUMBER := 0,

       BEGIN
         EXECUTE IMMEDIATE 'TRUNCATE TABLE tempproducto',
       
       filet := utl_file.FOPEN('SERVIDOR',archivo,'R'),
        IF utl_file.is_open(filet) THEN
            DBMS_OUTPUT.PUT_LINE ('Archivo aceptado'),
            LOOP
                BEGIN
                    utl_file.GET_LINE(filet,salida),
                    conteo := conteo + 1,
                    IF conteo <> 1 THEN
                        IF salida = '' THEN
                            DBMS_OUTPUT.PUT_LINE ('PROCESO FINALIZADO'),
                            COMMIT,
                            EXIT,
                        END IF,
                        
                        
                        tempcategoria := REGEXP_SUBSTR(salida,'[^,]+',1,4),
                        insertarcategoria(tempcategoria),
                        
                        padre :=  REGEXP_SUBSTR(tempcategoria,'[^-]+',1,1),
                        hijo :=  REGEXP_SUBSTR(tempcategoria,'[^-]+',1,2),
                        
                        if hijo is not null then
                            SELECT id_categoria into codigo FROM Proyecto2.categoria where categoria.nombre = hijo,
                        else
                            SELECT id_categoria into codigo FROM Proyecto2.categoria where categoria.nombre = padre,
                        end if,
                        
                        tempcodigo := TO_NUMBER(REGEXP_SUBSTR(salida,'[^,]+',1,1)),
                        tempnombre := REGEXP_SUBSTR(salida,'[^,]+',1,2),
                        tempprecio := TO_NUMBER(REGEXP_SUBSTR(salida,'[^,]+',1,3)),                   
                        tempimagen := REGEXP_SUBSTR(salida,'[^,]+',1,5),
                        tempcolor := REGEXP_SUBSTR(salida,'[^,]+',1,6),
                         DBMS_OUTPUT.PUT_LINE (REGEXP_SUBSTR(salida,'[^,]+',1,7)),
                        tempcantidad := REGEXP_SUBSTR(salida,'[^,]+',1,7),
                        tempdescripcion := REGEXP_SUBSTR(salida,'[^,]+',1,8),
                        cantidad := TO_NUMBER(tempcantidad),
                        DBMS_OUTPUT.PUT_LINE (cantidad),
                        INSERT INTO tempproducto VALUES(tempcodigo, tempnombre, tempprecio,codigo,tempcolor,cantidad,tempimagen,usuario,tempdescripcion),
                        COMMIT,
                        
                        MERGE INTO Proyecto2.producto p 
                        using (SELECT  1 "one" from dual) 
                        ON (p.nombre = tempnombre)   
                        WHEN NOT MATCHED THEN 
                            INSERT (nombre,descripcion) VALUES (tempnombre,tempdescripcion),

                        commit,
                        
                    END IF,
                END,
            end loop,
        END IF,
        EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE ('Fin de linea'),
        
    utl_file.FCLOSE(filet),
    END,
END,

--INSERTA UNA NUEVA CATEGORIA
create or replace PROCEDURE insertarcategoria(categoria in varchar2)
IS
BEGIN
    DECLARE 
        categoriap int := 0,
        hijop int := 0,
        padrec varchar2(1000) := null,
        hijo varchar2(1000) := null,
        hijop2 int := 0,
        bandera int := 1,
    BEGIN
        --PRIMERO SE REALIZA UNA CONSULTA EN CUAL VEREMOS SI EL PADRE A INSERTAR EXISTE O NO
        padrec := REGEXP_SUBSTR(categoria,'[^-]+',1,1),
        hijo := REGEXP_SUBSTR(categoria,'[^-]+',1,2),
        SELECT categoria.id_categoria INTO categoriap FROM Proyecto2.categoria WHERE categoria.nombre = padrec,
         DBMS_OUTPUT.PUT_LINE (padrec),
        IF hijo is not null THEN
            --Debe de verificar que exista, si existe no insertar
            SELECT categoria.id_categoria INTO hijop FROM Proyecto2.categoria WHERE categoria.nombre = hijo,

            if hijop <> 0 and categoriap <> 0 then
                SELECT relacion_categoria.hijo into hijop2 FROM Proyecto2.relacion_categoria WHERE relacion_categoria.padre = categoriap AND relacion_categoria.hijo = hijop,
                DBMS_OUTPUT.PUT_LINE ('Existe esta relacion, finalizar'),
            END IF,
        ELSE
            bandera := 0,
            DBMS_OUTPUT.PUT_LINE ('No hay categoria hijo'),
        END IF,
        EXCEPTION
        --NO EXISTE, A INSERTAR
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE (padrec),
            IF categoriap = 0 THEN
                INSERT INTO categoria(nombre,descripcion) VALUES(padrec,'Padre'),
                DBMS_OUTPUT.PUT_LINE ('Se creo la categoria padre'),
                COMMIT,
                BEGIN
                    insertarcategoria(categoria),
                END,
            ELSE
                IF hijop = 0 THEN
                    INSERT INTO categoria(nombre,descripcion) VALUES(hijo,categoria),
                    COMMIT,
                    DBMS_OUTPUT.PUT_LINE ('Se creo la categoria hijo'),
                    insertarcategoria(categoria),
                ELSE
                    
                    IF bandera <> 0 THEN
                        DBMS_OUTPUT.PUT_LINE (categoriap),
                        DBMS_OUTPUT.PUT_LINE (hijop),
                        INSERT INTO relacion_categoria VALUES(categoriap,hijop),
                        DBMS_OUTPUT.PUT_LINE ('Se inserto la categoria'),
                        COMMIT,
                    END IF,
                END IF,
           END IF,
   END,     
END,

--NOMBRE DEL PRODUCTO
create or replace procedure setnombre(nombrep in varchar2, descripcionp in varchar2)
IS
BEGIN       
            MERGE INTO Proyecto2.producto p 
            using (SELECT  1 "one" from dual) 
            ON (p.nombre = nombrep)   
            WHEN NOT MATCHED THEN 
                INSERT (nombre,descripcion) VALUES (nombrep,descripcionp),

            commit,
END,

--PROCESO DE CARRITO
create or replace PROCEDURE insertcarrito(clave2 in int, producto in int, cantidad in int, precio in decimal)
IS
BEGIN
    INSERT INTO PROYECTO2.detalle_carrito VALUES(0,clave2,producto,cantidad,precio),
    COMMIT,
END,


create or replace PROCEDURE anadircarrito(dueno in int,usuario in int,clave2 in int, producto in int, cantidad in int, precio in decimal)
IS
BEGIN
    DECLARE
        cantidadproducto int,
        totalc decimal,
    BEGIN
        DBMS_OUTPUT.PUT_LINE (producto),
        insertcarrito(clave2,producto,cantidad,precio),

        SELECT SUM(precio) into totalc FROM detalle_carrito
        where idcarrito = 3,
        DBMS_OUTPUT.PUT_LINE (totalc),
        UPDATE carrito set carrito.total = totalc where carrito.idcarrito = clave2,
        commit,     
    END,
END,

create or replace PROCEDURE descontarcantidadproducto(idcatalogo in int, cantidadp in int)
IS
BEGIN
    DECLARE
    total int,
    BEGIN
        SELECT detalle_catalogo.cantidad into total FROM Proyecto2.detalle_catalogo WHERE detalle_catalogo.iddetallecatalogo = idcatalogo,
        total := total - cantidadp,
        UPDATE Proyecto2.detalle_catalogo SET detalle_catalogo.cantidad = total WHERE detalle_catalogo.iddetallecatalogo = idcatalogo,
        COMMIT,
    END,
END,

create or replace PROCEDURE descontarcredito(claveu in int,valor number)
IS
BEGIN
    DECLARE
        credito number(38,2),
    BEGIN
        SELECT usuario.credito_disponible into credito FROM PROYECTO2.usuario WHERE usuario.clave = claveu,

        if credito > valor then
            credito := credito - valor,
            UPDATE PROYECTO2.usuario set usuario.credito_disponible = credito WHERE usuario.clave = claveu,
            commit,
        END IF,
    END,
END,


create or replace PROCEDURE eliminarcarrito(correlativo2 in int,carrito in int)
IS
BEGIN
    DECLARE
        total2 decimal,
        valor decimal,
    BEGIN
        SELECT carrito.total into total2 FROM Proyecto2.carrito where carrito.idcarrito = carrito,
        DBMS_OUTPUT.PUT_LINE (total2),
        SELECT detalle_carrito.precio into valor FROM Proyecto2.detalle_carrito where detalle_carrito.correlativo = correlativo2,
        total2 := total2 - valor,
        DBMS_OUTPUT.PUT_LINE (total2),
        UPDATE Proyecto2.carrito set carrito.total = total2 WHERE idcarrito = carrito,
        DELETE FROM Proyecto2.detalle_carrito WHERE correlativo = correlativo2,
        COMMIT,
    END,
END,

--Relacionado con factura_
create or replace PROCEDURE finalizarproceso(claveu in int, clavecarrito in int, valor in number, fecha in date)
IS
BEGIN
    DECLARE
        idfact number,
    BEGIN
        descontarcredito(claveu,valor),
        select facturaseq.nextval into idfact from dual,
        crearfactura(idfact,claveu,valor,fecha),
        INSERT INTO PROYECTO2.detalle_factura(no_factura,iddetallecatalogo,cantidad,valor) SELECT factura.no_factura ,detalle_carrito.dcatalogo,detalle_carrito.cantidad, detalle_carrito.precio FROM detalle_carrito, carrito, factura WHERE detalle_carrito.idcarrito = carrito.idcarrito AND carrito.idcarrito = clavecarrito and factura.no_factura = idfact,
        COMMIT,
        --Eliminar detalle_carrito
        DELETE FROM detalle_carrito where idcarrito = clavecarrito,
        COMMIT,
        UPDATE PROYECTO2.carrito SET carrito.total = 0 WHERE carrito.idcarrito = clavecarrito,
        COMMIt,
    END,
END,

create or replace PROCEDURE crearfactura(idfact in int,claveu in int, total in number, fecha in date)
IS 
BEGIN
    DECLARE
        algo int,
    BEGIN
       insert into PROYECTO2.factura values(idfact,fecha,total,claveu),
       COMMIT,
    end,
END, 


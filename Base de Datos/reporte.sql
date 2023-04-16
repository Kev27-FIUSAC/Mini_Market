--El listado de todos los administradores de sexo femenino que hayan nacido debajo de Y año.
SELECT clave,nombre,apellido,correo,genero,rol,fecha_nacimiento
FROM usuario
WHERE REGEXP_SUBSTR(fecha_nacimiento,'[^/]+',1,3) < :numero
AND genero = 'Femenino'
AND rol = 'Admo'
ORDER BY fecha_nacimiento


--Listado de los productos con puntos, en orden desc
SELECT dc.iddetallecatalogo as "id", pr.iddetallecatalogo as "codigo", p.nombre as "producto", dc.color as "color", AVG(pr.punteo) as "puntuacion"
FROM producto p, detalle_catalogo dc, puntuacion pr 
WHERE
dc.iddetallecatalogo = pr.iddetallecatalogo
AND 
dc.idproducto = p.idproducto
GROUP BY dc.iddetallecatalogo, dc.codigoproducto, p.nombre, dc.color
ORDER BY AVG(pr.punteo) DESC

--Top 3 clientes con mas productos
SELECT * FROM(
SELECT u.nombre as "nombre", u.apellido as "apellido", COUNT(dc.clave) as "cantidad"
FROM usuario u
INNER JOIN detalle_catalogo dc
on u.clave = dc.clave
GROUP BY u.nombre, u.apellido, dc.clave
ORDER BY COUNT(dc.clave) DESC )
where ROWNUM <= 3

--Todos los productos indicando la cantidad de comentarios asignados, publicados en Y fecha.
SELECT dc.codigoproducto as "codigo", p.nombre as "producto", TO_CHAR(c.fecha) as "fecha", COUNT(c.iddetallecatalogo) as "total"
FROM comentario c, detalle_catalogo dc, producto p
WHERE
p.idproducto = dc.idproducto
AND c.iddetallecatalogo = dc.iddetallecatalogo
GROUP BY c.fecha, c.iddetallecatalogo, p.nombre, dc.codigoproducto
HAVING c.fecha = :fecha

--productos con x cantidad disponible
SELECT p.nombre as "producto", cd.codigoproducto as "codigo", cd.cantidad as "cantidad"
FROM detalle_catalogo dc 
INNER JOIN producto p
on p.idproducto = dc.idproducto
WHERE
dc.cantidad = :cantidad

--Top 3 con productos peor puntuacion
SELECT * FROM (
    SELECT dc.iddetallecatalogo as "id", p.nombre as "producto", dc.precio as "precio", dc.color as "color", AVG(pr.punteo) as "puntuacion"
    FROM producto p, detalle_catalogo dc, puntuacion pr 
    WHERE
    p.idproducto = dc.idproducto
    AND 
    dc.iddetallecatalogo = pr.iddetallecatalogo
    GROUP BY dc.iddetallecatalogo, p.nombre, dc.precio, dc.color
    ORDER BY AVG(pr.punteo)
) WHERE ROWNUM <= 3
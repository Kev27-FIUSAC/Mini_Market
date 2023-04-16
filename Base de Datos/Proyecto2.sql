/* Tabla de usuario */
CREATE TABLE Usuario(
    clave int not null primary key,
    rol varchar(50) not null,
    nombre varchar2(100) not null,
    apellido varchar2(100) default null,
    contrasena varchar2(100) not null unique,
    correo varchar2(1000) not null unique,
    telefono varchar2(100) default null,
    genero varchar2(100) default null,
    fotografia clob default null,
    fecha_nacimiento date default null,
    fecha_registro date  default null,
    direccion varchar2(1000) default null,
    credito_disponible decimal(38,4) default 0.00,
    ganacia_obtenida decimal(38,4) default 0.00,
    clase_cliente varchar2(100) not null,
    estado int default 0,
    numcarrito int default 0
), 

/* Tabla bitacora, solo se relaciona con admo */

CREATE TABLE Pagina(
    id_user int,
    id int PRIMARY KEY,
    eslogan varchar(1000),
    mision varchar(1000),
    vision varchar(1000),
    servicio varchar(1000),
    nosotros varchar(1000),
    CONSTRAINT FK_admo FOREIGN KEY(id_user) REFERENCES Usuario(clave) ON DELETE CASCADE
),

CREATE TABLE Categoria(
    id_categoria int primary key,
    categoriaPadre int default null,
    nombre varchar(1000) unique not null,
    descripcion varchar(1000) default null
),

CREATE TABLE Relacion_Categoria(
    padre int,
    hijo int,
    CONSTRAINT  FK_padre FOREIGN KEY(padre) REFERENCES  Categoria(id_categoria) ON DELETE CASCADE,
    CONSTRAINT FK_hijo FOREIGN KEY(hijo) REFERENCES Categoria(id_categoria) ON DELETE CASCADE,
    CONSTRAINT PK_Cat PRIMARY KEY(padre,hijo)
),

CREATE TABLE Producto(
    idproducto int primary key,
    nombre varchar(1000) default null unique,
    descripcion varchar2(4000) default null
),

alter table producto add descripcion varchar2(4000) default null,

CREATE TABLE Detalle_Catalogo(
    iddetallecatalogo int primary key,
    clave int,
    codigoproducto int,
    idproducto int,
    idcategoria int,
    precio decimal(38,4) default 0.00,
    cantidad number default 0,
    color varchar2(500) default null,
    imagen varchar2(1000) not null,
    CONSTRAINT FK_iduser FOREIGN KEY(clave) REFERENCES Usuario(clave) ON DELETE CASCADE,
    CONSTRAINT FK_producto1 FOREIGN KEY(idproducto) REFERENCES Producto(idproducto) ON DELETE CASCADE,
    CONSTRAINT FK_categoria FOREIGN KEY(idcategoria) REFERENCES Categoria(id_categoria) ON DELETE CASCADE
),

CREATE TABLE Bitacora(
    idbitacora int primary key,
    codigo int,
    fecha date,
    accion varchar2(4000),
    CONSTRAINT FK_bituser FOREIGN KEY(codigo) REFErences usuario(clave) ON DELETE CASCADE
 ),   

CREATE TABLE comentario_puntuacion(
    idcomentario int primary key,
    clave int,
    iddetallecatalogo int,
    fecha date,
    comentario varchar2(4000),
    ponderacion int,
    CONSTRAINT FK_Cuser FOREIGN KEY(clave) REFERENCES usuario(clave) ON DELETE CASCADE,
    CONSTRAINT FK_cdd FOREIGN KEY(iddetallecatalogo) REFERENCES detalle_catalogo(iddetallecatalogo) ON DELETE CASCADE
),

CREATE TABLE Carrito(
    idcarrito int primary key,
    clave int not null,
    total decimal(38,4) default 0.00,
    CONSTRAINT FK_Usercarrito FOREIGN KEY(clave) REFERENCES Usuario(clave) ON DELETE CASCADE
),

CREATE TABLE Detalle_Carrito(
    correlativo int primary key,
    idcarrito int,
    dcatalogo int,
    cantidad int default 1,
    precio decimal(38,4) default 0.00,
    CONSTRAINT FK_DCarrito FOREIGN KEY(idcarrito) REFERENCES Carrito(idcarrito) ON DELETE CASCADE,
    CONSTRAINT FK_DCProducto FOREIGN KEY(dcatalogo) REFERENCES detalle_catalogo(iddetallecatalogo) ON DELETE CASCADE
),
    

/*Tabla temporal de producto */
create table TempProducto(
    codigo number default null,
    nombre varchar2(1000) default null,
    precio number(38,4) default null,
    categoria number default null,
    color varchar2(1000) default null,
    cantidad number default null,
    imagen varchar2(2000) default null,
    usuario number default null,
    descripcion varchar2(4000) default null
),
    

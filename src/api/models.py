from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String,  Date, Boolean, Integer, DECIMAL, DateTime, Text, ForeignKey
import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class Persona(db.Model):
    __tablename__ = "personas"

    id: Mapped[int] = mapped_column(primary_key=True)
    cedula: Mapped[str] = mapped_column(String(20))
    correo: Mapped[str] = mapped_column(String(30))
    direccion: Mapped[str] = mapped_column(String(255))
    edad: Mapped[int]
    fecha_nac: Mapped[datetime.date] = mapped_column(Date)
    primer_nombre: Mapped[str] = mapped_column(String(50))
    segundo_nombre: Mapped[str] = mapped_column(String(50))
    primer_apellido: Mapped[str] = mapped_column(String(50))
    segundo_apellido: Mapped[str] = mapped_column(String(50))
    telefono: Mapped[str] = mapped_column(String(20))
    estado: Mapped[bool] = mapped_column(Boolean, default=True)

    empleados: Mapped[list["Empleado"]] = relationship(
        back_populates="persona")


class Empleado(db.Model):
    __tablename__ = "empleados"

    id: Mapped[int] = mapped_column(primary_key=True)
    area_de_trabajo: Mapped[str] = mapped_column(String(100))
    cargo: Mapped[str] = mapped_column(String(100))
    fecha_ingreso: Mapped[datetime.date] = mapped_column(Date)
    persona_id: Mapped[int] = mapped_column(ForeignKey("personas.id"))
    estado: Mapped[bool] = mapped_column(Boolean, default=True)

    persona: Mapped["Persona"] = relationship(back_populates="empleados")
    usuarios: Mapped[list["Usuario"]] = relationship(back_populates="empleado")


class Usuario(db.Model):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(String(255))
    rol: Mapped[str] = mapped_column(String(50))
    estado: Mapped[bool] = mapped_column(Boolean, default=True)
    ultimo_login: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=True)
    empleado_id: Mapped[int] = mapped_column(ForeignKey("empleados.id"))

    empleado: Mapped["Empleado"] = relationship(back_populates="usuarios")
    movimientos_inventario: Mapped[list["MovimientoInventario"]] = relationship(
        back_populates="usuario")
    notificaciones: Mapped[list["Notificacion"]
                           ] = relationship(back_populates="usuario")
    preventas: Mapped[list["Preventa"]] = relationship(
        back_populates="usuario")
    ventas: Mapped[list["Venta"]] = relationship(back_populates="usuario")


class Categoria(db.Model):
    __tablename__ = "categorias"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100))
    estado: Mapped[bool] = mapped_column(Boolean, default=True)
    descripcion: Mapped[str] = mapped_column(Text)

    productos: Mapped[list["Producto"]] = relationship(
        back_populates="categoria")


class Proveedor(db.Model):
    __tablename__ = "proveedores"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(50))
    contacto: Mapped[str] = mapped_column(String(50))
    plataforma: Mapped[str] = mapped_column(String(50))
    email: Mapped[str] = mapped_column(String(50))
    direccion: Mapped[str] = mapped_column(Text)
    estado: Mapped[bool] = mapped_column(Boolean, default=True)

    productos: Mapped[list["Producto"]] = relationship(
        back_populates="proveedor")


class Producto(db.Model):
    __tablename__ = "productos"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(50))
    descripcion: Mapped[str] = mapped_column(Text)
    costo: Mapped[float] = mapped_column(DECIMAL(10, 2))
    precio_venta: Mapped[float] = mapped_column(DECIMAL(10, 2))
    imagen_url: Mapped[str] = mapped_column(String(255))
    estado: Mapped[bool] = mapped_column(Boolean, default=True)
    categoria_id: Mapped[int] = mapped_column(ForeignKey("categorias.id"))
    proveedor_id: Mapped[int] = mapped_column(ForeignKey("proveedores.id"))

    categoria: Mapped["Categoria"] = relationship(back_populates="productos")
    proveedor: Mapped["Proveedor"] = relationship(back_populates="productos")
    existencias: Mapped["Existencia"] = relationship(
        back_populates="producto", uselist=False)
    movimientos_inventario: Mapped[list["MovimientoInventario"]] = relationship(
        back_populates="producto")
    notificaciones: Mapped[list["Notificacion"]
                           ] = relationship(back_populates="producto")
    preventa_productos: Mapped[list["PreventaProducto"]
                               ] = relationship(back_populates="producto")
    factura_productos: Mapped[list["FacturaProducto"]
                              ] = relationship(back_populates="producto")


class Existencia(db.Model):
    __tablename__ = "existencias"

    id: Mapped[int] = mapped_column(primary_key=True)
    producto_id: Mapped[int] = mapped_column(
        ForeignKey("productos.id"), unique=True)
    cantidad_actual: Mapped[int]
    umbral_minimo: Mapped[int] = mapped_column(default=5)
    fecha_ultima_actualizacion: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow)

    producto: Mapped["Producto"] = relationship(back_populates="existencias")


class MovimientoInventario(db.Model):
    __tablename__ = "movimientosinventario"

    id: Mapped[int] = mapped_column(primary_key=True)
    producto_id: Mapped[int] = mapped_column(ForeignKey("productos.id"))
    tipo_movimiento: Mapped[str] = mapped_column(String(50))
    cantidad: Mapped[int]
    fecha_movimiento: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow)
    comentario: Mapped[str] = mapped_column(String(255))
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))

    producto: Mapped["Producto"] = relationship(
        back_populates="movimientos_inventario")
    usuario: Mapped["Usuario"] = relationship(
        back_populates="movimientos_inventario")


class Notificacion(db.Model):
    __tablename__ = "notificaciones"

    id: Mapped[int] = mapped_column(primary_key=True)
    mensaje: Mapped[str] = mapped_column(Text)
    fecha: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow)
    tipo: Mapped[str] = mapped_column(String(20))
    prioridad: Mapped[str] = mapped_column(String(20))
    producto_id: Mapped[int] = mapped_column(ForeignKey("productos.id"))
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))

    producto: Mapped["Producto"] = relationship(
        back_populates="notificaciones")
    usuario: Mapped["Usuario"] = relationship(back_populates="notificaciones")


class Preventa(db.Model):
    __tablename__ = "preventas"

    id: Mapped[int] = mapped_column(primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))
    estado: Mapped[str] = mapped_column(String(50), default="Pendiente")
    fecha: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow)

    usuario: Mapped["Usuario"] = relationship(back_populates="preventas")
    preventa_productos: Mapped[list["PreventaProducto"]
                               ] = relationship(back_populates="preventa")


class PreventaProducto(db.Model):
    __tablename__ = "preventaproductos"

    id: Mapped[int] = mapped_column(primary_key=True)
    preventa_id: Mapped[int] = mapped_column(ForeignKey("preventas.id"))
    producto_id: Mapped[int] = mapped_column(ForeignKey("productos.id"))
    cantidad: Mapped[int]

    preventa: Mapped["Preventa"] = relationship(
        back_populates="preventa_productos")
    producto: Mapped["Producto"] = relationship(
        back_populates="preventa_productos")


class Venta(db.Model):
    __tablename__ = "ventas"

    id: Mapped[int] = mapped_column(primary_key=True)
    preventa_id: Mapped[int] = mapped_column(ForeignKey("preventas.id"))
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))
    metodo_pago: Mapped[str] = mapped_column(String(50))
    total: Mapped[float] = mapped_column(DECIMAL(10, 2))
    estado: Mapped[str] = mapped_column(String(50), default="Completada")
    fecha_venta: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow)

    usuario: Mapped["Usuario"] = relationship(back_populates="ventas")
    preventa: Mapped["Preventa"] = relationship()


class Factura(db.Model):
    __tablename__ = "facturas"

    id: Mapped[int] = mapped_column(primary_key=True)
    venta_id: Mapped[int] = mapped_column(ForeignKey("ventas.id"))
    numero_factura: Mapped[str] = mapped_column(String(50))
    subtotal: Mapped[float] = mapped_column(DECIMAL(10, 2))
    descuento: Mapped[float] = mapped_column(DECIMAL(10, 2))
    total_final: Mapped[float] = mapped_column(DECIMAL(10, 2))
    fecha: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow)
    tipo_factura: Mapped[str] = mapped_column(String(50))
    estado: Mapped[str] = mapped_column(String(50), default="Emitida")

    venta: Mapped["Venta"] = relationship()


class FacturaProducto(db.Model):
    __tablename__ = "facturaproductos"

    id: Mapped[int] = mapped_column(primary_key=True)
    factura_id: Mapped[int] = mapped_column(ForeignKey("facturas.id"))
    producto_id: Mapped[int] = mapped_column(ForeignKey("productos.id"))
    cantidad: Mapped[int]
    precio_unitario: Mapped[float] = mapped_column(DECIMAL(10, 2))

    factura: Mapped["Factura"] = relationship()
    producto: Mapped["Producto"] = relationship()

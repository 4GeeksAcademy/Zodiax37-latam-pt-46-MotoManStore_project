from flask import Blueprint, request, jsonify
from sqlalchemy import func, extract, desc
from api.models import db, Venta, Factura, FacturaProducto, Producto, Existencia, Usuario, Notificacion

from datetime import date
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

reporte_bp = Blueprint('reporte_bp', __name__)




@reporte_bp.route('/resumen-dash', methods=['GET'])
@jwt_required()
def resumen_dashboard():

    identity = get_jwt_identity()
    claims = get_jwt()
    print("👉 ID:", identity)
    print("👉 Claims:", claims)
    hoy = date.today()

    productos_stock = db.session.query(func.count()).filter(Existencia.cantidad_actual > 0).scalar()
    productos_bajo_minimo = db.session.query(func.count()).filter(Existencia.cantidad_actual <= Existencia.umbral_minimo).scalar()
    ventas_dia = db.session.query(func.coalesce(func.sum(Factura.total_final), 0)).filter(func.date(Factura.fecha) == hoy).scalar()
    ultima_venta = db.session.query(func.max(Factura.fecha)).scalar()
    usuarios_activos = db.session.query(func.count()).filter(Usuario.estado == True).scalar()
    alertas = db.session.query(func.count()).filter(Notificacion.tipo == 'pendiente').scalar()

    return jsonify({
        "ProductosStock": productos_stock,
        "ProductosBajoMinimo": productos_bajo_minimo,
        "VentasDia": float(ventas_dia or 0),
        "UltimaVenta": ultima_venta.isoformat() if ultima_venta else None,
        "UsuariosActivos": usuarios_activos,
        "Alertas": alertas
    })



@reporte_bp.route('/ventas-por-fecha', methods=['GET'])
@jwt_required()
def ventas_por_fecha():
    fecha_inicio = request.args.get('fechaInicio')
    fecha_fin = request.args.get('fechaFin')

    resultados = db.session.query(
        func.date(Venta.fecha_venta).label('fecha'),
        func.count(Venta.id).label('numero_ventas'),
        func.sum(Venta.total).label('total_ventas'),
        func.sum(Factura.descuento).label('total_descuentos'),
        func.sum(Factura.total_final).label('total_final_ventas')
    ).join(Factura, Factura.venta_id == Venta.id)
    resultados = resultados.filter(Venta.fecha_venta.between(fecha_inicio, fecha_fin))
    resultados = resultados.group_by(func.date(Venta.fecha_venta)).order_by('fecha').all()

    return jsonify([
        {
            'Fecha': r.fecha.isoformat(),
            'NumeroVentas': r.numero_ventas,
            'TotalVentas': float(r.total_ventas or 0),
            'TotalDescuentos': float(r.total_descuentos or 0),
            'TotalFinalVentas': float(r.total_final_ventas or 0)
        } for r in resultados
    ])

@reporte_bp.route('/detalle-venta/<int:venta_id>', methods=['GET'])
@jwt_required()
def consultar_detalle_venta(venta_id):
    detalles = db.session.query(
        Venta.id.label('venta_id'),
        Venta.fecha_venta,
        Venta.metodo_pago,
        Venta.total.label('total_venta'),
        Factura.id.label('factura_id'),
        Factura.numero_factura,
        Factura.subtotal,
        Factura.descuento,
        Factura.total_final,
        Factura.tipo_factura,
        FacturaProducto.producto_id,
        Producto.nombre.label('nombre_producto'),
        FacturaProducto.cantidad,
        FacturaProducto.precio_unitario,
        (FacturaProducto.cantidad * FacturaProducto.precio_unitario).label('total_producto')
    ).join(Factura, Factura.venta_id == Venta.id).join(FacturaProducto, FacturaProducto.factura_id == Factura.id).join(Producto, Producto.id == FacturaProducto.producto_id).filter(Venta.id == venta_id).all()

    return jsonify([
        {
            'VentaId': d.venta_id,
            'FechaVenta': d.fecha_venta.isoformat(),
            'MetodoPago': d.metodo_pago,
            'TotalVenta': float(d.total_venta),
            'FacturaId': d.factura_id,
            'NumeroFactura': d.numero_factura,
            'Subtotal': float(d.subtotal),
            'Descuento': float(d.descuento),
            'TotalFinal': float(d.total_final),
            'TipoFactura': d.tipo_factura,
            'ProductoId': d.producto_id,
            'NombreProducto': d.nombre_producto,
            'Cantidad': d.cantidad,
            'PrecioUnitario': float(d.precio_unitario),
            'TotalProducto': float(d.total_producto)
        } for d in detalles
    ])

@reporte_bp.route('/mas-vendidos', methods=['GET'])
@jwt_required()
def productos_mas_vendidos():
    fecha_inicio = request.args.get('fechaInicio')
    fecha_fin = request.args.get('fechaFin')

    resultados = db.session.query(
        Producto.id.label('producto_id'),
        Producto.nombre.label('producto'),
        func.sum(FacturaProducto.cantidad).label('cantidad_vendida'),
        func.sum(FacturaProducto.cantidad * FacturaProducto.precio_unitario).label('total_ventas')
    ).join(FacturaProducto, FacturaProducto.producto_id == Producto.id).join(Factura, Factura.id == FacturaProducto.factura_id).join(Venta, Venta.id == Factura.venta_id).filter(Venta.fecha_venta.between(fecha_inicio, fecha_fin)).group_by(Producto.id, Producto.nombre).order_by(desc('cantidad_vendida')).all()

    return jsonify([
        {
            'ProductoId': r.producto_id,
            'Producto': r.producto,
            'CantidadVendida': int(r.cantidad_vendida),
            'TotalVentas': float(r.total_ventas)
        } for r in resultados
    ])

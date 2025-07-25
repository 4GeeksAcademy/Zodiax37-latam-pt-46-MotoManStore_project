from flask import Blueprint, request, jsonify
from api.models import db, Preventa, PreventaProducto, Producto, Existencia, Venta, FacturaProducto, Notificacion, Factura, MovimientoInventario
from datetime import datetime
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from decimal import Decimal

from flask_jwt_extended import jwt_required
from sqlalchemy import or_


preventas_bp = Blueprint('preventas_bp', __name__)


@preventas_bp.route('/crear', methods=['POST'])
@jwt_required()
def crear_preventa():
    data = request.get_json()
    usuario_id = data.get("usuario_id")

    nueva_preventa = Preventa(usuario_id=usuario_id)
    db.session.add(nueva_preventa)
    db.session.commit()

    return jsonify({"preventa_id": nueva_preventa.id}), 201


@preventas_bp.route('/agregar-producto', methods=['POST'])
@jwt_required()
def agregar_producto():
    data = request.get_json()
    preventa_id = data.get("preventa_id")
    producto_id = data.get("producto_id")
    cantidad = data.get("cantidad")
    print(preventa_id, producto_id, cantidad)

    if not cantidad or cantidad <= 0:
        return jsonify({"error": "Cantidad debe ser mayor a 0"}), 400

    existencia = Existencia.query.filter_by(producto_id=producto_id).first()
    if not existencia:
        return jsonify({"error": "No hay existencia del producto"}), 404

    actual = PreventaProducto.query.filter_by(
        preventa_id=preventa_id, producto_id=producto_id).first()
    cantidad_total = cantidad + (actual.cantidad if actual else 0)

    if cantidad_total > existencia.cantidad_actual:
        return jsonify({"error": "Cantidad solicitada supera stock disponible"}), 400

    if actual:
        actual.cantidad += cantidad
    else:
        nuevo = PreventaProducto(
            preventa_id=preventa_id, producto_id=producto_id, cantidad=cantidad)
        db.session.add(nuevo)

    db.session.commit()
    return jsonify({"message": "Producto agregado a la preventa"}), 200


@preventas_bp.route('/quitar-producto', methods=['DELETE'])
@jwt_required()
def quitar_producto():
    data = request.get_json()
    preventa_id = data.get("preventa_id")
    producto_id = data.get("producto_id")

    item = PreventaProducto.query.filter_by(
        preventa_id=preventa_id, producto_id=producto_id).first()
    if not item:
        return jsonify({"error": "Producto no está en la preventa"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Producto eliminado de la preventa"}), 200


@preventas_bp.route('/listar-productos/<int:preventa_id>', methods=['GET'])
@jwt_required()
def listar_productos(preventa_id):
    detalles = PreventaProducto.query.filter_by(preventa_id=preventa_id).all()
    resultado = []
    for d in detalles:
        producto = Producto.query.get(d.producto_id)
        subtotal = float(producto.precio_venta) * d.cantidad
        resultado.append({
            "preventa_detalle_id": d.id,
            "producto_id": d.producto_id,
            "nombre": producto.nombre,
            "precio_venta": float(producto.precio_venta),
            "cantidad": d.cantidad,
            "subtotal": subtotal
        })
    return jsonify(resultado), 200


@preventas_bp.route('/listar-pendientes/<int:usuario_id>', methods=['GET'])
@jwt_required()
def listar_preventas_pendientes(usuario_id):
    preventas = Preventa.query.filter_by(
        usuario_id=usuario_id, estado='Pendiente').all()
    resultado = [{
        "id": p.id,
        "estado": p.estado,
        "fecha": p.fecha
    } for p in preventas]
    return jsonify(resultado), 200


@preventas_bp.route('/eliminar/<int:preventa_id>', methods=['DELETE'])
@jwt_required()
def eliminar_preventa(preventa_id):
    try:
        detalles = PreventaProducto.query.filter_by(
            preventa_id=preventa_id).all()
        for d in detalles:
            db.session.delete(d)

        preventa = Preventa.query.get_or_404(preventa_id)
        db.session.delete(preventa)
        db.session.commit()
        return jsonify({"message": "Preventa eliminada"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@preventas_bp.route('/ventas/<int:usuario_id>', methods=['GET'])
@jwt_required()
def obtener_ventas(usuario_id):
    try:
        ventas = db.session.query(Venta).filter(
            or_(
                Venta.usuario_id == usuario_id,
                usuario_id == 0
            )
        ).order_by(Venta.fecha_venta.desc()).all()

        resultado = []
        for v in ventas:
            resultado.append({
                "venta_id": v.id,
                "fecha_venta": v.fecha_venta,
                "metodo_pago": v.metodo_pago,
                "total": float(v.total),
                "vendedor": v.usuario.username if v.usuario else "Desconocido"
            })

        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@preventas_bp.route("/confirmar", methods=["POST"])
def confirmar_venta():
    try:
        data = request.get_json()
        preventa_id = data.get("PreventaId")
        usuario_id = data.get("UsuarioId")
        metodo_pago = data.get("MetodoPago")
        descuento = Decimal(str(data.get("Descuento", 0)))

        tipo_factura = data.get("TipoFactura")

        preventa = Preventa.query.get_or_404(preventa_id)
        if preventa.estado != "Pendiente":
            return jsonify({"error": "La preventa ya fue procesada"}), 400

        productos_preventa = PreventaProducto.query.filter_by(
            preventa_id=preventa_id).all()
        if not productos_preventa:
            return jsonify({"error": "No hay productos en la preventa"}), 400

        total = 0
        notificaciones = []

        for item in productos_preventa:
            existencia = Existencia.query.filter_by(
                producto_id=item.producto_id).first()
            if not existencia or existencia.cantidad_actual < item.cantidad:
                return jsonify({"error": f"No hay stock suficiente para el producto ID {item.producto_id}"}), 400

            existencia.cantidad_actual -= item.cantidad
            existencia.fecha_ultima_actualizacion = datetime.utcnow()

            # Registrar movimiento de salida
            movimiento = MovimientoInventario(
                producto_id=item.producto_id,
                tipo_movimiento="Salida",
                cantidad=item.cantidad,
                comentario=f"Salida por venta ID: {preventa_id}",
                usuario_id=usuario_id,
                fecha_movimiento=datetime.utcnow()
            )
            db.session.add(movimiento)


            producto = Producto.query.get(item.producto_id)
            subtotal = producto.precio_venta * item.cantidad
            total += subtotal

            if existencia.cantidad_actual <= existencia.umbral_minimo:
                mensaje = f"Stock bajo para el producto {producto.nombre}. Quedan {existencia.cantidad_actual} unidades."
                noti = Notificacion(
                    mensaje=mensaje,
                    tipo="Alerta",
                    prioridad="Alta",
                    producto_id=producto.id,
                    usuario_id=usuario_id,
                    fecha=datetime.utcnow()
                )
                db.session.add(noti)
                notificaciones.append(mensaje)

            if existencia.cantidad_actual == 0:
                producto.estado = False
            elif not producto.estado:
                producto.estado = True

        venta = Venta(
            preventa_id=preventa_id,
            usuario_id=usuario_id,
            metodo_pago=metodo_pago,
            total=total - descuento,
            estado="Completada",
            fecha_venta=datetime.utcnow()
        )
        db.session.add(venta)
        db.session.flush()  # Para obtener venta.id

        factura = Factura(
            venta_id=venta.id,
            numero_factura=f"FAC-{venta.id:06d}",
            subtotal=total,
            descuento=descuento,
            total_final=total - descuento,
            fecha=datetime.utcnow(),
            tipo_factura=tipo_factura,
            estado="Emitida"
        )
        db.session.add(factura)
        db.session.flush()

        for item in productos_preventa:
            producto = Producto.query.get(item.producto_id)
            detalle = FacturaProducto(
                factura_id=factura.id,
                producto_id=producto.id,
                cantidad=item.cantidad,
                precio_unitario=producto.precio_venta
            )
            db.session.add(detalle)

        preventa.estado = "Procesada"

        db.session.commit()

        return jsonify({
            "message": "Venta confirmada con éxito",
            "venta_id": venta.id,
            "factura_id": factura.id,
            "notificaciones": notificaciones
        }), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        print("❌ ERROR AL CONFIRMAR:", str(e))  # AÑADE ESTA LÍNEA
        return jsonify({"error": str(e)}), 500

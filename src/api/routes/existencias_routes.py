from flask import Blueprint, request, jsonify
from api.models import db, Existencia, MovimientoInventario, Producto, Categoria, Usuario, Notificacion
from datetime import datetime

existencias_bp = Blueprint('existencias_bp', __name__)


@existencias_bp.route('/movimientos', methods=['GET'])
def listar_movimientos():
    movimientos = db.session.query(MovimientoInventario).join(Producto).join(Categoria).order_by(MovimientoInventario.fecha_movimiento.desc()).all()
    
    resultado = []
    for mov in movimientos:
        resultado.append({
            "id": mov.id,
            "producto_id": mov.producto_id,
            "nombre_producto": mov.producto.nombre,
            "categoria": mov.producto.categoria.nombre if mov.producto.categoria else None,
            "tipo_movimiento": mov.tipo_movimiento,
            "cantidad": mov.cantidad,
            "comentario": mov.comentario,
            "usuario_id": mov.usuario_id,
            "fecha_movimiento": mov.fecha_movimiento
        })

    return jsonify(resultado), 200

@existencias_bp.route('/', methods=['GET'])
def listar_existencias():
    existencias = db.session.query(Existencia).all()
    
    resultado = []
    for ext in existencias:
        resultado.append({
            "id": ext.id,
            "producto_id": ext.producto_id,
            "cantidad_actual": ext.cantidad_actual,
            "umbral_minimo":ext.umbral_minimo,
            "fecha_ultima_actualizacion": ext.fecha_ultima_actualizacion
        })

    return jsonify(resultado), 200



@existencias_bp.route('/', methods=['POST'])
def create_exist():
    data = request.get_json()
    nuevo_exist = Existencia(
        producto_id=data.get('producto_id'),
        cantidad_actual=data.get('cantidad_inicial'),
        umbral_minimo=data.get('umbral_minimo'),
        
    )
    db.session.add(nuevo_exist)
    db.session.commit()
    return jsonify({"message": "Producto creado", "id": nuevo_exist.id}), 201



@existencias_bp.route('/movimientos/<int:id>', methods=['GET'])
def obtener_movimiento(id):
    mov = MovimientoInventario.query.get_or_404(id)

    data = {
        "id": mov.id,
        "producto_id": mov.producto_id,
        "nombre_producto": mov.producto.nombre,
        "categoria": mov.producto.categoria.nombre if mov.producto.categoria else None,
        "tipo_movimiento": mov.tipo_movimiento,
        "cantidad": mov.cantidad,
        "comentario": mov.comentario,
        "usuario_id": mov.usuario_id,
        "fecha_movimiento": mov.fecha_movimiento
    }

    return jsonify(data), 200


@existencias_bp.route('/movimientos', methods=['POST'])
def registrar_movimiento():
    data = request.get_json()

    try:
        producto_id = data.get("producto_id")
        tipo_movimiento = data.get("tipo_movimiento")
        cantidad = int(data.get("cantidad"))
        comentario = data.get("comentario")
        usuario_id = data.get("usuario_id")

        if cantidad <= 0:
            return jsonify({"error": "La cantidad debe ser mayor a cero"}), 400

        existencia = Existencia.query.filter_by(producto_id=producto_id).first()
        if not existencia:
            return jsonify({"error": "No existe información de existencia para el producto"}), 404

        nueva_cantidad = existencia.cantidad_actual

        if tipo_movimiento == "Salida":
            if cantidad > existencia.cantidad_actual:
                return jsonify({"error": "No hay suficiente stock para realizar la salida"}), 400
            nueva_cantidad -= cantidad
        elif tipo_movimiento == "Entrada":
            nueva_cantidad += cantidad
        else:
            return jsonify({"error": "Tipo de movimiento inválido"}), 400

        # Actualizar existencia
        existencia.cantidad_actual = nueva_cantidad
        existencia.fecha_ultima_actualizacion = datetime.utcnow()

        # Crear el movimiento
        movimiento = MovimientoInventario(
            producto_id=producto_id,
            tipo_movimiento=tipo_movimiento,
            cantidad=cantidad,
            comentario=comentario,
            usuario_id=usuario_id
        )
        db.session.add(movimiento)

        # Verificar umbral y crear notificación si aplica
        if nueva_cantidad <= existencia.umbral_minimo:
            mensaje = f"Stock bajo para el producto ID: {producto_id}. Quedan {nueva_cantidad} unidades."
            noti = Notificacion(
                mensaje=mensaje,
                tipo="Alerta",
                prioridad="Alta",
                producto_id=producto_id,
                usuario_id=usuario_id
            )
            db.session.add(noti)

        # Cambiar estado del producto según stock
        producto = Producto.query.get(producto_id)
        if nueva_cantidad == 0:
            producto.estado = False
        elif nueva_cantidad > 0 and not producto.estado:
            producto.estado = True

        db.session.commit()

        return jsonify({
            "message": "Movimiento registrado correctamente",
            "notificacion": mensaje if nueva_cantidad <= existencia.umbral_minimo else None
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

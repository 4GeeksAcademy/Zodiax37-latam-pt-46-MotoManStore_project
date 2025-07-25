from flask import Blueprint, request, jsonify

from flask_jwt_extended import jwt_required
from api.models import db, Producto, Categoria, Proveedor, Existencia

producto_bp = Blueprint('producto_bp', __name__)

@producto_bp.route('/', methods=['GET'])
@jwt_required()
def get_productos():
    productos = (
        db.session.query(Producto)
        .outerjoin(Producto.categoria)
        .outerjoin(Producto.proveedor)
        .outerjoin(Producto.existencias)
        .filter(Producto.estado == True)
        .add_columns(
            Producto.id,
            Producto.nombre,
            Producto.descripcion,
            Producto.costo,
            Producto.precio_venta,
            Producto.imagen_url,
            Producto.estado,
            Categoria.id.label("categoria_id"),
            Categoria.nombre.label("categoria_nombre"),
            Proveedor.id.label("proveedor_id"),
            Proveedor.nombre.label("proveedor_nombre"),
            Existencia.cantidad_actual,
            Existencia.umbral_minimo
        )
        .all()
    )

    result = []
    for row in productos:
        (
            _producto,
            id,
            nombre,
            descripcion,
            costo,
            precio_venta,
            imagen_url,
            estado,
            categoria_id,
            categoria_nombre,
            proveedor_id,
            proveedor_nombre,
            cantidad_actual,
            umbral_minimo
        ) = row

        result.append({
            "id": id,
            "nombre": nombre,
            "descripcion": descripcion,
            "costo": float(costo),
            "precio_venta": float(precio_venta),
            "imagen_url": imagen_url,
            "estado": estado,
            "categoria": {
                "id": categoria_id,
                "nombre": categoria_nombre
            } if categoria_id else None,
            "proveedor": {
                "id": proveedor_id,
                "nombre": proveedor_nombre
            } if proveedor_id else None,
            "existencia": {
                "cantidad_actual": cantidad_actual or 0,
                "umbral_minimo": umbral_minimo or 0
            }
        })

    return jsonify(result), 200


@producto_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_producto(id):
    producto = (
        db.session.query(Producto)
        .outerjoin(Producto.categoria)
        .outerjoin(Producto.proveedor)
        .outerjoin(Producto.existencias)
        .filter(Producto.id == id, Producto.estado == True)
        .add_columns(
            Producto.id,
            Producto.nombre,
            Producto.descripcion,
            Producto.costo,
            Producto.precio_venta,
            Producto.imagen_url,
            Producto.estado,
            Categoria.id.label("categoria_id"),
            Categoria.nombre.label("categoria_nombre"),
            Proveedor.id.label("proveedor_id"),
            Proveedor.nombre.label("proveedor_nombre"),
            Existencia.cantidad_actual,
            Existencia.umbral_minimo
        )
        .first()
    )

    if not producto:
        return jsonify({"error": "Producto no disponible"}), 404

    (
        _producto,
        id,
        nombre,
        descripcion,
        costo,
        precio_venta,
        imagen_url,
        estado,
        categoria_id,
        categoria_nombre,
        proveedor_id,
        proveedor_nombre,
        cantidad_actual,
        umbral_minimo
    ) = producto

    return jsonify({
        "id": id,
        "nombre": nombre,
        "descripcion": descripcion,
        "costo": float(costo),
        "precio_venta": float(precio_venta),
        "imagen_url": imagen_url,
        "estado": estado,
        "categoria": {
            "id": categoria_id,
            "nombre": categoria_nombre
        } if categoria_id else None,
        "proveedor": {
            "id": proveedor_id,
            "nombre": proveedor_nombre
        } if proveedor_id else None,
        "existencia": {
            "cantidad_actual": cantidad_actual or 0,
            "umbral_minimo": umbral_minimo or 0
        }
    }), 200


@producto_bp.route('/', methods=['POST'])
@jwt_required()
def create_producto():
    data = request.get_json()
    nuevo_producto = Producto(
        nombre=data.get('nombre'),
        descripcion=data.get('descripcion'),
        costo=data.get('costo'),
        precio_venta=data.get('precio_venta'),
        imagen_url=data.get('imagen_url'),
        categoria_id=data.get('categoria_id'),
        proveedor_id=data.get('proveedor_id'),
        estado=True
    )
    db.session.add(nuevo_producto)
    db.session.commit()
    return jsonify({"message": "Producto creado", "id": nuevo_producto.id}), 201

@producto_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_producto(id):
    data = request.get_json()
    prod = Producto.query.get_or_404(id)
    if not prod.estado:
        return jsonify({"error": "Producto no disponible"}), 404
    prod.nombre = data.get('nombre', prod.nombre)
    prod.descripcion = data.get('descripcion', prod.descripcion)
    prod.costo = data.get('costo', prod.costo)
    prod.precio_venta = data.get('precio_venta', prod.precio_venta)
    prod.imagen_url = data.get('imagen_url', prod.imagen_url)
    prod.categoria_id = data.get('categoria_id', prod.categoria_id)
    prod.proveedor_id = data.get('proveedor_id', prod.proveedor_id)
    db.session.commit()
    return jsonify({"message": "Producto actualizado"}), 200

@producto_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_producto(id):
    prod = Producto.query.get_or_404(id)
    prod.estado = False
    db.session.commit()
    return jsonify({"message": "Producto desactivado"}), 200

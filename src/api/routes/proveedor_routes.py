from flask import Blueprint, request, jsonify
from api.models import db, Proveedor

proveedor_bp = Blueprint('proveedor_bp', __name__)

@proveedor_bp.route('/', methods=['GET'])
def get_proveedores():
    proveedores = Proveedor.query.filter_by(estado=True).all()
    result = []
    for p in proveedores:
        result.append({
            "id": p.id,
            "nombre": p.nombre,
            "contacto": p.contacto,
            "plataforma": p.plataforma,
            "email": p.email,
            "direccion": p.direccion,
            "estado": p.estado,
        })
    return jsonify(result), 200

@proveedor_bp.route('/<int:id>', methods=['GET'])
def get_proveedor(id):
    p = Proveedor.query.get_or_404(id)
    if not p.estado:
        return jsonify({"error": "Proveedor no disponible"}), 404
    return jsonify({
        "id": p.id,
        "nombre": p.nombre,
        "contacto": p.contacto,
        "plataforma": p.plataforma,
        "email": p.email,
        "direccion": p.direccion,
        "estado": p.estado,
    }), 200

@proveedor_bp.route('/', methods=['POST'])
def create_proveedor():
    data = request.get_json()
    nuevo_proveedor = Proveedor(
        nombre=data.get('nombre'),
        contacto=data.get('contacto'),
        plataforma=data.get('plataforma'),
        email=data.get('email'),
        direccion=data.get('direccion'),
        estado=True
    )
    db.session.add(nuevo_proveedor)
    db.session.commit()
    return jsonify({"message": "Proveedor creado", "id": nuevo_proveedor.id}), 201

@proveedor_bp.route('/<int:id>', methods=['PUT'])
def update_proveedor(id):
    data = request.get_json()
    p = Proveedor.query.get_or_404(id)
    if not p.estado:
        return jsonify({"error": "Proveedor no disponible"}), 404
    p.nombre = data.get('nombre', p.nombre)
    p.contacto = data.get('contacto', p.contacto)
    p.plataforma = data.get('plataforma', p.plataforma)
    p.email = data.get('email', p.email)
    p.direccion = data.get('direccion', p.direccion)
    db.session.commit()
    return jsonify({"message": "Proveedor actualizado"}), 200

@proveedor_bp.route('/<int:id>', methods=['DELETE'])
def delete_proveedor(id):
    p = Proveedor.query.get_or_404(id)
    p.estado = False
    db.session.commit()
    return jsonify({"message": "Proveedor desactivado"}), 200

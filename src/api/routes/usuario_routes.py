from flask import Blueprint, request, jsonify
from api.models import db, Usuario
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from flask_jwt_extended import jwt_required

usuario_bp = Blueprint('usuario_bp', __name__)

@usuario_bp.route('/', methods=['GET'])
@jwt_required()
def get_usuarios():
    usuarios = Usuario.query.filter_by(estado=True).all()
    result = []
    for u in usuarios:
        persona = u.empleado.persona
        result.append({
            "id": u.id,
            "username": u.username,
            "rol": u.rol,
            "estado": u.estado,
            "ultimo_login": u.ultimo_login.isoformat() if u.ultimo_login else None,
            "empleado_id": u.empleado_id,
            "nombre": f"{persona.primer_nombre} {persona.segundo_nombre}",
            "apellido": f"{persona.primer_apellido} {persona.segundo_apellido}",
            "correo": persona.correo,
            #temporal
            "password": u.password,   
        })
    return jsonify(result), 200


@usuario_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_usuario(id):
    u = Usuario.query.get_or_404(id)
    print(u)
    if not u.estado:
        return jsonify({"error": "Usuario no disponible"}), 404
    return jsonify({
        "id": u.id,
        "username": u.username,
        "rol": u.rol,
        "estado": u.estado,
        "ultimo_login": u.ultimo_login.isoformat() if u.ultimo_login else None,
        "empleado_id": u.empleado_id,
    }), 200

@usuario_bp.route('/', methods=['POST'])
@jwt_required()
def create_usuario():
    data = request.get_json()
    hashed_password = generate_password_hash(data.get('password'), method='scrypt')
    nuevo_usuario = Usuario(
        username=data.get('username'),
        password=hashed_password,
        rol=data.get('rol'),
        estado=True,
        ultimo_login=None,
        empleado_id=data.get('empleado_id')
    )
    db.session.add(nuevo_usuario)
    db.session.commit()
    return jsonify({"message": "Usuario creado", "id": nuevo_usuario.id}), 201

@usuario_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_usuario(id):
    data = request.get_json()
    u = Usuario.query.get_or_404(id)
    if not u.estado:
        return jsonify({"error": "Usuario no disponible"}), 404

    u.username = data.get('username', u.username)
    if data.get('password'):
        u.password = generate_password_hash(data.get('password'), method='scrypt')
    u.rol = data.get('rol', u.rol)
    u.empleado_id = data.get('empleado_id', u.empleado_id)
    db.session.commit()
    return jsonify({"message": "Usuario actualizado"}), 200

@usuario_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_usuario(id):
    u = Usuario.query.get_or_404(id)
    u.estado = False
    db.session.commit()
    return jsonify({"message": "Usuario desactivado"}), 200

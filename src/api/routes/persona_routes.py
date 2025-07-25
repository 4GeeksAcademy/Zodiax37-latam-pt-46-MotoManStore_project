from flask import Blueprint, request, jsonify
from api.models import db, Persona
from flask_jwt_extended import jwt_required

persona_bp = Blueprint('persona_bp', __name__)

@persona_bp.route('/', methods=['GET'])
@jwt_required()
def get_personas():
    personas = Persona.query.filter_by(estado=True).all()
    result = []
    for p in personas:
        result.append({
            "id": p.id,
            "cedula": p.cedula,
            "correo": p.correo,
            "direccion": p.direccion,
            "edad": p.edad,
            "fecha_nac": p.fecha_nac.isoformat() if p.fecha_nac else None,
            "primer_nombre": p.primer_nombre,
            "segundo_nombre": p.segundo_nombre,
            "primer_apellido": p.primer_apellido,
            "segundo_apellido": p.segundo_apellido,
            "telefono": p.telefono,
            "estado": p.estado,
        })
    return jsonify(result), 200

@persona_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_persona(id):
    p = Persona.query.get_or_404(id)
    if not p.estado:
        return jsonify({"error": "Persona no disponible"}), 404
    return jsonify({
        "id": p.id,
        "cedula": p.cedula,
        "correo": p.correo,
        "direccion": p.direccion,
        "edad": p.edad,
        "fecha_nac": p.fecha_nac.isoformat() if p.fecha_nac else None,
        "primer_nombre": p.primer_nombre,
        "segundo_nombre": p.segundo_nombre,
        "primer_apellido": p.primer_apellido,
        "segundo_apellido": p.segundo_apellido,
        "telefono": p.telefono,
        "estado": p.estado,
    }), 200

@persona_bp.route('/', methods=['POST'])
@jwt_required()
def create_persona():
    data = request.get_json()
    nueva_persona = Persona(
        cedula=data.get('cedula'),
        correo=data.get('correo'),
        direccion=data.get('direccion'),
        edad=data.get('edad'),
        fecha_nac=data.get('fecha_nac'),
        primer_nombre=data.get('primer_nombre'),
        segundo_nombre=data.get('segundo_nombre'),
        primer_apellido=data.get('primer_apellido'),
        segundo_apellido=data.get('segundo_apellido'),
        telefono=data.get('telefono'),
        estado=True
    )
    db.session.add(nueva_persona)
    db.session.commit()
    return jsonify({"message": "Persona creada", "id": nueva_persona.id}), 201

@persona_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_persona(id):
    data = request.get_json()
    p = Persona.query.get_or_404(id)
    if not p.estado:
        return jsonify({"error": "Persona no disponible"}), 404
    p.cedula = data.get('cedula', p.cedula)
    p.correo = data.get('correo', p.correo)
    p.direccion = data.get('direccion', p.direccion)
    p.edad = data.get('edad', p.edad)
    p.fecha_nac = data.get('fecha_nac', p.fecha_nac)
    p.primer_nombre = data.get('primer_nombre', p.primer_nombre)
    p.segundo_nombre = data.get('segundo_nombre', p.segundo_nombre)
    p.primer_apellido = data.get('primer_apellido', p.primer_apellido)
    p.segundo_apellido = data.get('segundo_apellido', p.segundo_apellido)
    p.telefono = data.get('telefono', p.telefono)
    db.session.commit()
    return jsonify({"message": "Persona actualizada"}), 200

@persona_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_persona(id):
    p = Persona.query.get_or_404(id)
    p.estado = False
    db.session.commit()
    return jsonify({"message": "Persona desactivada"}), 200

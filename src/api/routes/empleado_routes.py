from flask import Blueprint, request, jsonify

from flask_jwt_extended import jwt_required
from api.models import db, Empleado, Persona

empleado_bp = Blueprint('empleado_bp', __name__)

@empleado_bp.route('/', methods=['GET'])
@jwt_required()
def get_empleados():
    empleados = Empleado.query.filter_by(estado=True).all()
    result = []
    for e in empleados:
        result.append({
            "id": e.id,
            "area_de_trabajo": e.area_de_trabajo,
            "cargo": e.cargo,
            "fecha_ingreso": e.fecha_ingreso.isoformat() if e.fecha_ingreso else None,
            "persona_id": e.persona_id,
            "persona_nombre": f"{e.persona.primer_nombre} {e.persona.primer_apellido}" if e.persona else None,
            "estado": e.estado,
        })
    return jsonify(result), 200

@empleado_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_empleado(id):
    e = Empleado.query.get_or_404(id)
    if not e.estado:
        return jsonify({"error": "Empleado no disponible"}), 404
    return jsonify({
        "id": e.id,
        "area_de_trabajo": e.area_de_trabajo,
        "cargo": e.cargo,
        "fecha_ingreso": e.fecha_ingreso.isoformat() if e.fecha_ingreso else None,
        "persona_id": e.persona_id,
        "estado": e.estado,
    }), 200

@empleado_bp.route('/', methods=['POST'])
@jwt_required()
def create_empleado():
    data = request.get_json()
    nuevo_empleado = Empleado(
        area_de_trabajo=data.get('area_de_trabajo'),
        cargo=data.get('cargo'),
        fecha_ingreso=data.get('fecha_ingreso'),
        persona_id=data.get('persona_id'),
        estado=True
    )
    db.session.add(nuevo_empleado)
    db.session.commit()
    return jsonify({"message": "Empleado creado", "id": nuevo_empleado.id}), 201

@empleado_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_empleado(id):
    data = request.get_json()
    e = Empleado.query.get_or_404(id)
    if not e.estado:
        return jsonify({"error": "Empleado no disponible"}), 404
    e.area_de_trabajo = data.get('area_de_trabajo', e.area_de_trabajo)
    e.cargo = data.get('cargo', e.cargo)
    e.fecha_ingreso = data.get('fecha_ingreso', e.fecha_ingreso)
    e.persona_id = data.get('persona_id', e.persona_id)
    db.session.commit()
    return jsonify({"message": "Empleado actualizado"}), 200

@empleado_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_empleado(id):
    e = Empleado.query.get_or_404(id)
    e.estado = False
    db.session.commit()
    return jsonify({"message": "Empleado desactivado"}), 200



@empleado_bp.route('/completo/<int:id>', methods=['GET'])
@jwt_required()
def get_empleado_completo(id):
    e = Empleado.query.get_or_404(id)
    if not e.estado:
        return jsonify({"error": "Empleado no disponible"}), 404

    p = e.persona  # accedemos a la relación con Persona

    return jsonify({
        "id": e.id,
        "area_de_trabajo": e.area_de_trabajo,
        "cargo": e.cargo,
        "fecha_ingreso": e.fecha_ingreso.isoformat() if e.fecha_ingreso else None,
        "persona_id": e.persona_id,
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
    }), 200





@empleado_bp.route('/completo', methods=['POST'])
@jwt_required()
def crear_empleado_completo():
    data = request.get_json()
    
    # Crear Persona
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
    db.session.flush()  # ← importante para obtener el ID antes del commit

    # Crear Empleado con ID de persona
    nuevo_empleado = Empleado(
        area_de_trabajo=data.get('area_de_trabajo'),
        cargo=data.get('cargo'),
        fecha_ingreso=data.get('fecha_ingreso'),
        persona_id=nueva_persona.id,
        estado=True
    )
    db.session.add(nuevo_empleado)
    db.session.commit()

    return jsonify({
        "message": "Empleado y persona creados",
        "persona_id": nueva_persona.id,
        "empleado_id": nuevo_empleado.id
    }), 201






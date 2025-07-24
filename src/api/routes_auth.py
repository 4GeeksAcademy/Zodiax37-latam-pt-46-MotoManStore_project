from flask import Blueprint, request, jsonify
from api.models import db, Usuario
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("userName")
    password = data.get("pass")

    if not username or not password:
        return jsonify({"msg": "Faltan credenciales"}), 400

    user = Usuario.query.filter_by(username=username, estado=True).first()

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 401

    print("HASH EN BD:", user.password)
    print("INPUT:", password)
    print("VALIDACIÓN:", check_password_hash(user.password, password))

    if not check_password_hash(user.password, password):
        return jsonify({"msg": "Contraseña incorrecta"}), 401

    user.ultimo_login = datetime.utcnow()
    db.session.commit()

    token = create_access_token(identity=user.id, additional_claims={
        "username": user.username,
        "rol": user.rol,
        "id": user.id
    })

    return jsonify({
        "token": token
    }), 200

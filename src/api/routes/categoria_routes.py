from flask import Blueprint, request, jsonify
from api.models import db, Categoria

categoria_bp = Blueprint("categoria_bp", __name__)

@categoria_bp.route("/categorias", methods=["GET"])
def get_categorias():
    categorias = Categoria.query.all()
    return jsonify([{
        "id": c.id,
        "nombre": c.nombre,
        "descripcion": c.descripcion,
        "estado": c.estado
    } for c in categorias]), 200


@categoria_bp.route("/<int:id>", methods=["GET"])
def get_categoria(id):
    categoria = Categoria.query.get_or_404(id)
    return jsonify({
        "id": categoria.id,
        "nombre": categoria.nombre,
        "descripcion": categoria.descripcion,
        "estado": categoria.estado
    }), 200


@categoria_bp.route("/", methods=["POST"])
def create_categoria():
    data = request.get_json()
    nueva_categoria = Categoria(
        nombre=data.get("nombre"),
        descripcion=data.get("descripcion"),
        estado=True
    )
    db.session.add(nueva_categoria)
    db.session.commit()
    return jsonify({"message": "Categoría creada"}), 201

@categoria_bp.route("/<int:id>", methods=["PUT"])
def update_categoria(id):
    data = request.get_json()
    categoria = Categoria.query.get_or_404(id)
    categoria.nombre = data.get("nombre", categoria.nombre)
    categoria.descripcion = data.get("descripcion", categoria.descripcion)
    db.session.commit()
    return jsonify({"message": "Categoría actualizada"}), 200

@categoria_bp.route("/<int:id>", methods=["DELETE"])
def delete_categoria(id):
    categoria = Categoria.query.get_or_404(id)
    categoria.estado = False
    db.session.commit()
    return jsonify({"message": "Categoría desactivada"}), 200

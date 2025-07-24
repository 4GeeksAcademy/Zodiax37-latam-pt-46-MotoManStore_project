from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from api.models import db, Categoria, Proveedor, Producto, Existencia

from .categoria_routes import categoria_bp
from .proveedor_routes import proveedor_bp
from .productos_routes import producto_bp
from .persona_routes import persona_bp
from .empleado_routes import empleado_bp
from .usuario_routes import usuario_bp
from .existencias_routes import existencias_bp
from .preventa_routes import preventas_bp

from api.routes.reporte_routes import reporte_bp

api = Blueprint('api', __name__)

api.register_blueprint(categoria_bp, url_prefix='/categoria')
api.register_blueprint(proveedor_bp, url_prefix='/proveedor')
api.register_blueprint(producto_bp, url_prefix='/producto')
api.register_blueprint(persona_bp, url_prefix='/persona')
api.register_blueprint(empleado_bp, url_prefix='/empleado')
api.register_blueprint(usuario_bp, url_prefix='/usuario')
api.register_blueprint(existencias_bp, url_prefix='/existencia')
api.register_blueprint(preventas_bp, url_prefix='/preventa')

api.register_blueprint(reporte_bp, url_prefix='/reportes')


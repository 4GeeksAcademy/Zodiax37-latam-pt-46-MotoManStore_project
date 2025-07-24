import os
from flask_admin import Admin
from .models import db, Usuario
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # Añade aquí los modelos que quieres administrar
    admin.add_view(ModelView(Usuario, db.session))

    # Puedes añadir más modelos, por ejemplo:
    # admin.add_view(ModelView(OtroModelo, db.session))

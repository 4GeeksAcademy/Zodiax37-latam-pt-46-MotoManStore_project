import click
from api.models import db, Usuario

def setup_commands(app):
    
    @app.cli.command("insert-test-users")  # nombre del comando
    @click.argument("count")  # argumento para número de usuarios
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = Usuario()
            user.username = f"test_user{x}"
            user.password = "123456"  #hash luego
            user.rol = "admin"  
            user.estado = True
            db.session.add(user)
        db.session.commit()
        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass

import os
from PyPan import create_app, db
from PyPan.models import FileMeta
from flask_script import Manager, Shell, Server
from flask_migrate import Migrate, MigrateCommand

app = create_app('default')
manager = Manager(app)
migrate = Migrate(app, db)


def make_shell_context():
    return dict(app=app, db=db, User=User, Role=Role, Post=Post)


manager.add_command("shell", Shell(make_shell_context))
manager.add_command("db", MigrateCommand)
manager.add_command("runserver", Server(use_debugger=True))


if __name__ == '__main__':
    manager.run()

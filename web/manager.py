# coding=utf-8

from app import create_app, db
from app.models import FileMeta
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager, Shell, Server

app = create_app('default')
migrate = Migrate(app, db)
manager = Manager(app)

@manager.command
def test():
    """Run the unit tests"""
    import unittest
    tests = unittest.TestLoader().discover('tests')
    unittest.TextTestRunner(verbosity=2).run(tests)


def make_shell_context():
    return dict(app=app, db=db, User=User, Role=Role, Post=Post)


manager.add_command("shell", Shell(make_shell_context))
manager.add_command("db", MigrateCommand)
manager.add_command("runserver", Server(use_debugger=True))


if __name__ == '__main__':
    manager.run()

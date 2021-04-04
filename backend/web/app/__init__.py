# coding=utf-8

import os
from flask import Flask
from flask_login import LoginManager
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager


from config import config


bootstrap = Bootstrap()
db = SQLAlchemy()
jwt_extend = JWTManager()


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    bootstrap.init_app(app)
    db.init_app(app)
    jwt_extend.init_app(app)

    from .api import api as api_blueprint
    app.register_blueprint(api_blueprint)

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)
    
    return app

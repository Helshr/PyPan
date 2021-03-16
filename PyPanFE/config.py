import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = 'hard to guess string'
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024


    @staticmethod
    def init_app(app):
        pass


class ProductionConfig(Config):
    pass


class TestingConfig(Config):
    pass


class DevelopmentConfig(Config):
    FLASK_ENV = development
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:root@0.0.0.0:3306/meta"
    SQLALCHEMY_TRACK_MODIFICATIONS = True
     UPLOAD_FOLDER = 'data/'
    THUMBNAIL_FOLDER = 'data/thumbnail'
    

config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}


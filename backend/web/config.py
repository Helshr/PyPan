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
    FLASK_ENV = "development"
    URL_PRE_HOST = "http://192.168.3.16:8000/api/getFile/"
    THUMB_URL_PRE_HOST = "http://192.168.3.16:8000/api/getThumbnailFile/"
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:root@192.168.3.16:3306/pypan"
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    UPLOAD_FOLDER = '/home/helonghuan/git_projects/PyPan/backend/data'
    THUMBNAIL_FOLDER = '/home/helonghuan/git_projects/PyPan/backend/data/thumbnail'
    JWT_SECRET_KEY = 'hard to guess string.'
    

config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}


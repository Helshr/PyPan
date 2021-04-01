import os
import sys
import time
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Column, DateTime, Integer
from flask_login import UserMixin, AnonymousUserMixin
from . import db, login_manager


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def get_username(self):
        return self.username


class FileMeta(db.Model):
    __tablename__ = "file_meta"
    # fileMetaManager.saveMeta(file_meta.location, file_meta.fileName, file_meta.fileMd5, file_meta.fileSize, file_meta.uploadAt)
    # filename = fileMetaManager.getFileName(fileMd5)
    location = db.Column(db.String(120))
    file_name = db.Column(db.String(40))
    file_md5 = db.Column(db.String(40), unique=True, primary_key=True)
    file_size = db.Column(db.String(120))
    file_upload_at = db.Column(db.DateTime, default=datetime.utcnow)
    file_update_at = db.Column(db.DateTime, default=datetime.utcnow)

    @staticmethod
    def judge_file_meta(file_md5):
        fm = FileMeta.query.filter_by(file_md5=file_md5).first()
        if fm != None:
            return True
        else:
            return False

    def __repr__(self):
        return f"<FileMeta {os.path.join(self.location, self.file_name)}>"

    def insert_file_meta(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def delete_file_meta(file_md5):
        fm = FileMeta.query.filter_by(file_md5=file_md5).first()
        jfm = fm.to_json()
        file_name = jfm['name']
        db.session.delete(fm)
        db.session.commit()
        return file_name

    @staticmethod
    def get_all_infos():
        file_metas = FileMeta.query.all()
        file_meta_out = []
        for file_meta in file_metas:
            file_meta_out.append(file_meta.to_json())
        return file_meta_out

    def get_file_name(self):
        return self.name
    
    def to_json(self):
        return {
            "name": self.file_name,
            "md5": self.file_md5,
        }


if __name__ == "__main__":
    # fm = FileMeta("/home/helonghuan", "1.jpeg")
    # ct = fm.get_file_upload_at()
    # print(ct)
    db.create_all()

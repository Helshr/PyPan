import os
import sys
import time
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Column, DateTime, Integer
from flask_login import UserMixin, AnonymousUserMixin
from . import db


class UserFile(db.Model):
    __tablename__ = 'user_files'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), db.ForeignKey('users.username'))
    file_md5 = db.Column(db.String(40), db.ForeignKey('file_metas.file_md5'))
    file = db.relationship("FileMeta", backref='user_files')
    file_name = db.Column(db.String(40))
    file_size = db.Column(db.String(120))
    file_upload_at = db.Column(db.DateTime, default=datetime.utcnow)
    file_update_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f"<UserFile {self.username} {self.file}>"

    @staticmethod
    def check_exist(username, file_md5):
        user_file = UserFile.query.filter_by(username=username, file_md5=file_md5).first()
        if user_file == None:
            return False
        else:
            return True
    
    @staticmethod
    def get_user_file_list(username):
        user_file_list = UserFile.query.filter_by(username=username).all()
        if user_file_list == None:
            return []
        else:
            r = []
            for i in range(len(user_file_list)):
                file_info = user_file_list[i]
                json_data = file_info.to_json()
                r.append({
                    "key": i,
                    "file_name": json_data['name'],
                    "file_upload_at": json_data['uploadAt'],
                    "file_size": json_data['fileSize'],
                    "file_md5": json_data['md5'],
                })
            print("$$$$ DEBUG: ", r)
            return r

    @staticmethod
    def insert(user_file):
        db.session.add(user_file)
        db.session.commit()

    @staticmethod
    def delete(username, file_md5):
        uf = UserFile.query.filter_by(username=username, file_md5=file_md5).first()
        print(f"will delete file is : {uf}")
        db.session.delete(uf)
        db.session.commit()
        json_data = uf.to_json()
        return json_data['name']

    def to_json(self):
        return {
            "name": self.file_name,
            "md5": self.file_md5,
            "location": self.file_name,
            "uploadAt": self.file_update_at,
            "fileSize": self.file_size,
        }


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    user_files = db.relationship('UserFile', backref='user_file', lazy='dynamic')

    def __repr__(self):
        return f"<User {self.username}>"

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

    @staticmethod
    def insert(user):
        db.session.add(user)
        db.session.commit()

    @staticmethod
    def query_user(user_name):
        user = User.query.filter_by(username=user_name).first()
        return user
    
    def get_all_files(self):
        r = []
        count = self.user_files.count()
        for uf in self.user_files.all():
            r.append(uf.to_json())
        return r


class FileMeta(db.Model):
    __tablename__ = "file_metas"
    location = db.Column(db.String(120))
    file_name = db.Column(db.String(40))
    file_md5 = db.Column(db.String(40), unique=True, primary_key=True, index=True)
    file_size = db.Column(db.String(120))
    file_upload_at = db.Column(db.DateTime, default=datetime.utcnow)
    file_update_at = db.Column(db.DateTime, default=datetime.utcnow)

    @staticmethod
    def check_exist(file_md5):
        file_info = FileMeta.query.filter_by(file_md5=file_md5).first()
        if file_info == []:
            return False
        else:
            json_data = file_info.to_json()
            print("@@@@ DEBUG: ", json_data)
            return {
                "file_name": json_data['file_name'],
                "file_md5": json_data['file_md5'],
                "file_size": json_data['file_size'],
                "file_upload_at": json_data['file_upload_at'],
                "file_update_at": json_data['file_update_at'],
            }

    @staticmethod
    def judge_file_meta(file_md5):
        fm = FileMeta.query.filter_by(file_md5=file_md5).first()
        if fm != None:
            return True
        else:
            return False

    def __repr__(self):
        return f"<FileMeta {os.path.join(self.location, self.file_name)}>"

    @staticmethod
    def insert(file_meta):
        db.session.add(file_meta)
        db.session.commit()

    @staticmethod
    def delete_file_meta(file_md5):
        fm = FileMeta.query.filter_by(file_md5=file_md5).first()
        jfm = fm.to_json()
        file_name = jfm['file_name']
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
        return self.file_name
    
    def to_json(self):
        return {
            "file_name": self.file_name,
            "file_md5": self.file_md5,
            "file_size": self.file_size,
            "file_upload_at": self.file_upload_at,
            "file_update_at": self.file_update_at,
            "location": os.path.join(self.location, self.file_name),
        }


if __name__ == "__main__":
    # fm = FileMeta("/home/helonghuan", "1.jpeg")
    # ct = fm.get_file_upload_at()
    # print(ct)
    db.create_all()

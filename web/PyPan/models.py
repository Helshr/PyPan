# coding=utf-8

from . import db

class FileMeta(db.Model):
    __tablename__ = 'file_meta'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    location = db.Column(db.String(32), unique=True)
    file_name = db.Column(db.String(32))
    file_md5 = db.Column(db.String(64), unique=True, index=True)
    file_size = db.Column(db.String(64))
    upload_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_json(self):
        json_comment = {
            'location': self.location,
            'file_name': self.file_name,
            'file_md5': self.file_md5,
            'file_size': self.file_size,
            'upload_at': self.upload_at,
        }
        return json_comment
    


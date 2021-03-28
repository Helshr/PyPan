import os
import sys
import time
import hashlib
from datetime import datetime

from sqlalchemy import Column, DateTime, Integer

from . import db


class FileTool:

    @staticmethod
    def get_file_md5(file_location):
        with open(file_location, 'rb') as f:
            data = f.read()
        file_md5 = hashlib.md5(data).hexdigest()
        return file_md5


    @staticmethod
    def get_file_size(file_location):
        # unit B
        file_size = os.path.getsize(file_location)
        return file_size

    
    @staticmethod
    def get_file_upload_at(file_location):
        t = datetime.utcnow()
        return t
    

    def _format_timestamp(self, timestamp):
        time_struct = time.localtime(timestamp)
        return time.strftime("%Y-%m-%d %H:%M:%S", time_struct)

    # def get_file_upload_at(self):
    #     location = self.location
    #     file_name = self.file_name
    #     file_location = os.path.join(location, file_name)
    #     t = os.path.getmtime(file_location)
    #     ft = self._format_timestamp(t)
    #     return ft


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
    def delete_file_meta(file_name):
        fm = FileMeta.query.filter_by(file_name=file_name).first()
        db.session.delete(fm)
        db.session.commit()


if __name__ == "__main__":
    # fm = FileMeta("/home/helonghuan", "1.jpeg")
    # ct = fm.get_file_upload_at()
    # print(ct)
    db.create_all()

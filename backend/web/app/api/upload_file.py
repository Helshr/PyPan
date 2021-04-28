import os
import hashlib
from datetime import datetime
from flask import current_app


class UploadFile():
    def __init__(self, name, md5, type=None, size=None, not_allowed_msg=''):
        self.name = name
        self.type = type
        self.size = size
        self.not_allowed_msg = not_allowed_msg
        self.url = "data/%s" % name
        self.thumbnail_url = "thumbnail/%s" % name
        self.md5 = md5

    def is_image(self):
        fileName, fileExtension = os.path.splitext(self.name.lower())

        if fileExtension in ['.jpg', '.png', '.jpeg', '.bmp']:
            return True

        return False
    
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

    def get_file(self):
        if self.type != None:
            # POST an image
            if self.type.startswith('image'):
                url_prefix = current_app.config['URL_PRE_HOST']
                thubm_url_prefix = current_app.config['THUMB_URL_PRE_HOST']
                return {"name": self.name,
                        "type": self.type,
                        "size": self.size, 
                        "url": os.path.join(url_prefix, self.url), 
                        "md5": self.md5,
                    }

            # POST an normal file
            elif self.not_allowed_msg == '':
                return {"name": self.name,
                        "type": self.type,
                        "size": self.size, 
                        "url": self.url, 
                        "deleteUrl": self.delete_url, 
                        "deleteType": self.delete_type,}

            # File type is not allowed
            else:
                return {"error": self.not_allowed_msg,
                        "name": self.name,
                        "type": self.type,
                        "size": self.size,}

        # GET image from disk
        elif self.is_image():
            return {"name": self.name,
                    "size": self.size, 
                    "url": self.url, 
                    "deleteUrl": self.delete_url, 
                    "deleteType": self.delete_type,}
        
        # GET normal file from disk
        else:
            return {"name": self.name,
                    "size": self.size, 
                    "url": self.url, 
                    "deleteUrl": self.delete_url, 
                    "deleteType": self.delete_type,}
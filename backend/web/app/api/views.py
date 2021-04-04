import os
import PIL
from PIL import Image
import simplejson
import traceback
from werkzeug.utils import secure_filename
from flask import request, current_app, Response
from flask_jwt_extended import jwt_required

from . import api
from .upload_file import UploadFile
from .. import db
from ..models import FileMeta
from ..res import Res


IGNORED_FILES = set(['.gitignore'])
ALLOWED_EXTENSIONS = set(['txt', 'gif', 'png', 'jpg', 'jpeg', 'bmp', 'rar', 'zip', '7z    ip', 'doc', 'docx'])


@api.route('/api/uploadFile', methods=['POST'])
def upload():
    files = request.files['file']
    # files = request.files['file']
    if files:
        filename = secure_filename(files.filename)
        filename = gen_file_name(filename)
        mime_type = files.content_type
        if not allowed_file(files.filename):
            pass
        else:
            # save file to disk
            uploaded_file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            files.save(uploaded_file_path)

            # create thumbnail after saving
            if mime_type.startswith('image'):
                create_thumbnail(filename)
            # create file_meta
            file_md5 = UploadFile.get_file_md5(uploaded_file_path)
            file_size = UploadFile.get_file_size(uploaded_file_path)
            file_upload_at = UploadFile.get_file_upload_at(uploaded_file_path)
            file_meta = FileMeta(location=current_app.config['UPLOAD_FOLDER'], file_name=filename, file_md5=file_md5, file_size=file_size, file_upload_at=file_upload_at)
            # insert file_meta in file_metas;
            FileMeta.insert(file_meta)

            if FileMeta.judge_file_meta(file_meta.file_md5) == True:
                print("{} save meta success.".format(file_meta.file_name))
            else:
                print("{} save meta error.".format(file_meta.file_name))

            # get file size after saving
            size = os.path.getsize(uploaded_file_path)

            # return json for js call back
            result = UploadFile(name=filename, type=mime_type, size=size, md5=file_md5)
            return Res.res_200({"fileList": [result.get_file()]});


@api.route('/api/getFileList', methods=['GET'])
@jwt_required()
def getFileList():
    meta_data_list = FileMeta.get_all_infos()
    for meta_data in meta_data_list:
        meta_data['url'] = f"http://192.168.3.16:8000/api/getFile/{meta_data['name']}"
        meta_data['thumbUrl'] = f"http://192.168.3.16:8000/api/getThumbnailFile/{meta_data['name']}"
        meta_data['uid'] = meta_data['md5']
        del meta_data['md5']
    return Res.res_200({"files": meta_data_list})


@api.route('/api/deleteFile/<file_uid>', methods=['DELETE'])
def deleteFile(file_uid):
    # delete from mysql
    file_name = FileMeta.delete_file_meta(file_uid)
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], file_name)
    thumbnail_file_path = os.path.join(current_app.config['THUMBNAIL_FOLDER'], file_name)
    # delete from os
    os.remove(file_path)
    os.remove(thumbnail_file_path)
    return Res.res_200({"file_name": file_name})


@api.route('/api/getFile/<filename>', methods=['GET'])
def getFile(filename):
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    with open(file_path, 'rb') as f:
        image = f.read()
    resp = Response(image, mimetype="image/jpeg")
    return resp


@api.route('/api/getThumbnailFile/<filename>', methods=['GET'])
def getThumbnailFile(filename):
    thumbnail_file_path = os.path.join(current_app.config['THUMBNAIL_FOLDER'], filename)
    with open(thumbnail_file_path, 'rb') as f:
        image = f.read()
    resp = Response(image, mimetype="image/jpeg")
    return resp


def gen_file_name(filename):
    i = 1
    while os.path.exists(os.path.join(current_app.config['UPLOAD_FOLDER'], filename)):
        name, extension = os.path.splitext(filename)
        filename = '%s_%s%s' % (name, str(i), extension)
        i += 1
    return filename


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def create_thumbnail(image):
    try:
        base_width = 80
        img = Image.open(os.path.join(current_app.config['UPLOAD_FOLDER'], image))
        w_percent = (base_width / float(img.size[0]))
        h_size = int((float(img.size[1]) * float(w_percent)))
        img = img.resize((base_width, h_size), PIL.Image.ANTIALIAS)
        img.save(os.path.join(current_app.config['THUMBNAIL_FOLDER'], image))
    except:
        print(traceback.format_exc())
        return False

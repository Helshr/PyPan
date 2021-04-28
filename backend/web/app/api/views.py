import os
import PIL
from PIL import Image
import simplejson
import traceback

from werkzeug.utils import secure_filename
from flask import request
from flask import jsonify
from flask import current_app
from flask import Response
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

from . import api
from .upload_file import UploadFile
from .. import db
from ..models import FileMeta, User, UserFile
from ..res import Res


IGNORED_FILES = set(['.gitignore'])
ALLOWED_EXTENSIONS = set(['txt', 'gif', 'png', 'jpg', 'jpeg', 'bmp', 'rar', 'zip', '7z    ip', 'doc', 'docx'])


@api.route('/api/uploadFile', methods=['POST'])
@jwt_required()
def upload():
    files = request.files['file']
    # files = request.files['file']
    if files:
        filename = secure_filename(files.filename)
        # filename = gen_file_name(filename)
        mime_type = files.content_type
        if not allowed_file(files.filename):
            pass
        else:
            # save file to disk
            uploaded_file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            files.save(uploaded_file_path)

            # create file_meta
            file_md5 = UploadFile.get_file_md5(uploaded_file_path)
            file_size = UploadFile.get_file_size(uploaded_file_path)
            file_upload_at = UploadFile.get_file_upload_at(uploaded_file_path)
            file_meta = FileMeta(location=current_app.config['UPLOAD_FOLDER'], file_name=filename, file_md5=file_md5, file_size=file_size, file_upload_at=file_upload_at)
            # insert file_meta in file_metas;
            if FileMeta.check_exist(file_md5) == False: 
                # file not exist
                FileMeta.insert(file_meta)
                print(f"file_meta not exist, insert success")
            else:
                print(f"file_meta exist, insert failed.")
            
            # get user info.
            user_name = get_jwt_identity()

            # create user_file instance
            user_file = UserFile(username=user_name, file_md5=file_md5, file_upload_at=file_upload_at, file_size=file_size, file_name=filename)
            msg = ""
            if UserFile.check_exist(user_name, file_md5) == False: 
                # file not exist
                UserFile.insert(user_file)
                msg = "save file success."
                print(f"user_file not exist, insert success")
            else:
                msg = "file exist."
                print(f"user_file exist, insert failed.")
  
            # get file size after saving
            meta_data_list = _get_file_list(user_name)
            return jsonify({status: "success", "msg": msg})


@api.route('/api/userFile', methods=['GET'])
@jwt_required()
def get_user_file_list():
    # get user info.
    user_name = get_jwt_identity()
    # create user_file instance
    user_file = UserFile.get_user_file_list(username=user_name)
    return jsonify({"status": 200, "userFileList": user_file})


@api.route('/api/checkFileMD5', methods=['POST'])
@jwt_required()
def check_file_exist():
    user_name = get_jwt_identity()
    json_data = request.get_json()
    file_md5 = json_data['fileMd5']
    if UserFile.check_exist(user_name, file_md5):
        return jsonify({"file_exist": "true"})
    elif FileMeta.check_exist(file_md5):
        file_info = FileMeta.check_exist(file_md5)
        user_file = UserFile(username=user_name, file_md5=file_md5, file_upload_at=file_info['file_upload_at'], file_size=file_info['file_size'], file_name=file_info['file_name'])
        UserFile.insert(user_file)
        return jsonify({"file_exist": "true"})
    else:
        return jsonify({"file_exist": "false"})


@api.route('/api/deleteFile/<file_uid>', methods=['DELETE'])
@jwt_required()
def delete_file(file_uid):
    # delete from mysql
    # delete from user_files;
    # get user info.
    user_name = get_jwt_identity() 
    file_name = UserFile.delete(user_name, file_uid)
    # delete from os
    # file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], file_name)
    # thumbnail_file_path = os.path.join(current_app.config['THUMBNAIL_FOLDER'], file_name)
    # os.remove(file_path)
    # os.remove(thumbnail_file_path)
    return jsonify({"msg": "delete file success", "status": 200, "file_name": file_name})


@api.route('/api/getFile/<filename>', methods=['GET'])
def get_file(filename):
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    with open(file_path, 'rb') as f:
        image = f.read()
    resp = Response(image, mimetype="image/jpeg")
    return resp


# @api.route('/api/getThumbnailFile/<filename>', methods=['GET'])
# def get_thumbnail_file(filename):
#     thumbnail_file_path = os.path.join(current_app.config['THUMBNAIL_FOLDER'], filename)
#     with open(thumbnail_file_path, 'rb') as f:
#         image = f.read()
#     resp = Response(image, mimetype="image/jpeg")
#     return resp


def _get_file_list(username):
    user = User.query_user(username)
    user_file_list = user.get_all_files()
    print("DEBUG: ", user_file_list)
    for meta_data in user_file_list:
        meta_data['url'] = f"http://192.168.3.16:8000/api/getFile/{meta_data['location']}"
        meta_data['uid'] = meta_data['md5']
        del meta_data['md5']
        del meta_data['location']
    return user_file_list


def gen_file_name(filename):
    i = 1
    while os.path.exists(os.path.join(current_app.config['UPLOAD_FOLDER'], filename)):
        name, extension = os.path.splitext(filename)
        filename = '%s_%s%s' % (name, str(i), extension)
        i += 1
    return filename


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


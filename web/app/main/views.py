import os
import PIL 
from PIL import Image
import simplejson
import traceback
from flask import render_template, redirect, url_for, abort, flash, request, current_app, make_response, send_from_directory

from werkzeug.utils import secure_filename

from . import main
from .upload_file import UploadFile
from .. import db
from ..models import FileMeta, FileTool


IGNORED_FILES = set(['.gitignore'])
ALLOWED_EXTENSIONS = set(['txt', 'gif', 'png', 'jpg', 'jpeg', 'bmp', 'rar', 'zip', '7z    ip', 'doc', 'docx'])


@main.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@main.route("/upload", methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        files = request.files['file']
        print("files {}".format(files))
        if files:
            filename = secure_filename(files.filename)
            filename = gen_file_name(filename)
            mime_type = files.content_type
            print("mime_type: {}".format(mime_type))
            if not allowed_file(files.filename):
                result = uploadfile(name=filename, type=mime_type, size=0, not_allowed_msg="File type not allowed")
            else:
                # save file to disk
                uploaded_file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                files.save(uploaded_file_path)

                # create thumbnail after saving
                if mime_type.startswith('image'):
                    create_thumbnail(filename)
                    
                file_md5 = FileTool().get_file_md5(uploaded_file_path)
                file_size = FileTool().get_file_size(uploaded_file_path)
                file_upload_at = FileTool().get_file_upload_at(uploaded_file_path)
                file_meta = FileMeta(location=current_app.config['UPLOAD_FOLDER'], file_name=filename, file_md5=file_md5, file_size=file_size, file_upload_at=file_upload_at)
                file_meta.insert_file_meta()
                if FileMeta.judge_file_meta(file_meta.file_md5) == True:
                    print("{} save meta success.".format(file_meta.file_name))
                else:
                    print("{} save meta error.".format(file_meta.file_name))

                # get file size after saving
                size = os.path.getsize(uploaded_file_path)

                # return json for js call back
                result = UploadFile(name=filename, type=mime_type, size=size)

            return simplejson.dumps({"files": [result.get_file()]})

    if request.method == 'GET':
        # get all file in ./data directory
        files = [f for f in os.listdir(current_app.config['UPLOAD_FOLDER']) if os.path.isfile(os.path.join(current_app.config['UPLOAD_FOLDER'],f)) and f not in IGNORED_FILES ]

        file_display = []

        for f in files:
            size = os.path.getsize(os.path.join(current_app.config['UPLOAD_FOLDER'], f))
            file_saved = UploadFile(name=f, size=size)
            file_display.append(file_saved.get_file())

        return simplejson.dumps({"files": file_display})

    return redirect(url_for('index'))


@main.route("/delete/<string:filename>", methods=['DELETE'])
def delete(filename):
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file_thumb_path = os.path.join(current_app.config['THUMBNAIL_FOLDER'], filename)
    FileMeta.delete_file_meta(filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)

            if os.path.exists(file_thumb_path):
                os.remove(file_thumb_path)
            return simplejson.dumps({filename: 'True'})
        except:
            return simplejson.dumps({filename: 'False'})


# serve static files
@main.route("/thumbnail/<string:filename>", methods=['GET'])
def get_thumbnail(filename):
    return send_from_directory(current_app.config['THUMBNAIL_FOLDER'], filename=filename)


@main.route("/data/<string:fileMd5>", methods=['GET'])
def get_file(fileMd5):
    filename = FileMeta.get_file_meta(fileMd5)
    return send_from_directory(os.path.join(current_app.config['UPLOAD_FOLDER']), filename=filename, as_attachment=True)



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

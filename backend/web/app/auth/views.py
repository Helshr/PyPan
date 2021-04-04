from flask import jsonify
from flask import request

from flask_login import logout_user
from flask_login import login_required
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

from . import auth
from .. import db
from ..models import User
from ..res import Res


def validate_email(email):
    if User.query.filter_by(email=email).first():
        return False
    return True


def validate_username(username):
    if User.query.filter_by(username=username).first():
        return False
    return True


@auth.route('/api/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    user = User.query.filter_by(email=email).first()
    if user is not None and user.verify_password(password):
        username = user.get_username()
        access_token = create_access_token(identity=username)
        return jsonify({"access_token": access_token, "status": 200})
    else:
        return jsonify({"msg": "Bad username or password", "status": 401}), 401


@auth.route('/api/authorization', methods=['GET'])
@jwt_required()
def authorization():
    current_user = get_jwt_identity()
    return jsonify({"user_name": current_user})


@auth.route('/api/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    Res.res_200("logout success.")

    
@auth.route('/api/register', methods=['POST'])
def register():
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')
    # print(f"username: {username}, email: {email} password: {password}")
    if validate_username(username):
        Res.res_503(f"validate username success.")
    else:
        Res.res_503(f"validate username failed.")
    if validate_email(email):
        Res.res_503(f"validate email success.")
    else:
        Res.res_503(f"validate email failed.")
    user = User(email=email, username=username, password=password)
    User.insert(user)
    return Res.res_200({"username": username})

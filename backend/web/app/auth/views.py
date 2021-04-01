from flask import render_template, redirect, request, url_for, flash
from flask_login import login_user, logout_user, login_required, \
    current_user
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
        return Res.res_200({"username": username})
    else:
        return Res.res_503({"login failed."})


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
    db.session.add(user)
    db.session.commit()
    return Res.res_200({"username": username})

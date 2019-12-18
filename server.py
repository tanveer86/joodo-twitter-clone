from flask import Flask, json, jsonify, request, make_response
import jwt
import hashlib
import os
from datetime import datetime
from bson.json_util import dumps
from bson.objectid import ObjectId
from flask_pymongo import PyMongo
import math
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://127.0.0.1:27017/joodo"
mongo = PyMongo(app)

def md5_hash(string):
    hash = hashlib.md5()
    hash.update(string.encode('utf-8'))
    return hash.hexdigest()

def generate_salt():
    salt = os.urandom(16)
    return salt.hex()

@app.route("/user/register", methods=["POST"])
def register():
    users = mongo.db.users
    name = request.json["name"]
    email = request.json["email"]
    picture = "static/users/user.png"
    salt = generate_salt()
    password = md5_hash(salt + request.json["password"])
    created = datetime.utcnow()
    result = ""

    response = users.find_one({"email": email})

    if response:
        result = jsonify({"duplicate": "Email id already exisist"})
    else:
        user_id = users.insert({
            "name": name,
            "email": email,
            "picture": picture,
            "password": password,
            "salt": salt,
            "created": created
        })

        new_user = users.find_one({"_id": user_id})

        result = jsonify({"success": new_user["email"] + " registered"})
    return result

@app.route("/users/login", methods=["POST"])
def login():
    users = mongo.db.users
    email = request.json["email"]
    password = request.json["password"]
    result = ""

    response = users.find_one({"email": email})

    if response:
        if response["password"] == md5_hash(response["salt"]+password):
            encode_data = jwt.encode({
                "id": str(response["_id"])
            }, "masai", algorithm="HS256").decode("utf-8")
            result = jsonify({"token": encode_data})
        else:
            result = jsonify({"error": "Wrong username and password"})
    else:
        result = jsonify({"result": "no user found"})
    return result

@app.route('/user/details')
def user_details():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'masai', algorithms=['HS256'])
    user_id = str(decode_data["id"])
    users = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    return dumps({"user_id": user_id, "name": users["name"], "email": users["email"], "picture": users["picture"]})

@app.route('/usercheck', methods=["POST"])
def user_check():
    email = request.json["email"]
    response = mongo.db.users.find_one({"email": email})
    result = False
    if response:
        result = True
    return dumps({"result": result})


@app.route('/joods/create', methods=["POST"])
def create():
    joods = {}
    joods['user_id'] = request.headers.get('user_id')
    joods['name'] = request.headers.get('name')
    joods['joodsText'] = request.headers.get('joodsText')
    joods['created'] = datetime.utcnow()
    picture = request.files['picture']
    location = "static/joods/" + picture.filename
    picture.save(location)
    joods['picture'] = location
    mongo.db.joods.insert_one(joods)
    return dumps(joods)

@app.route('/joods/<user_id>/')
def joods(user_id):
    page = request.args.get("page", default = 1, type = int)
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)}, {"following"})
    all_joods = mongo.db.joods.find({"user_id": {"$in": user["following"]}})
    # took amit's help to calculate this in week 15 day 4
    total_pages = int(math.ceil(len(str(all_joods))/2))
    out_put = {"page": page, "per_page": 2, "total": len(str(all_joods)), "total_pages": total_pages, "data": all_joods[(page*2)-2: page*2]}
    return dumps(out_put)

@app.route('/user/joods/<user_id>')
def user_joods(user_id):
    all_joods = mongo.db.joods.find({"user_id": user_id})
    return dumps(all_joods)

@app.route("/users")
def users():
    all_users = mongo.db.users.find()
    return dumps(all_users)

@app.route("/user/follow", methods=["POST"])
def user_follow():
    current_userid = request.json["current_userid"]
    user_id = request.json["user_id"]
    mongo.db.users.update_one({"_id": ObjectId(current_userid)}, {"$push": {"following": user_id}})
    return dumps({"success": "You are following"})

@app.route("/users/following/<user_id>")
def user_following(user_id):
    user_data = []
    users = mongo.db.users
    all_users = users.find()
    current_user = users.find_one({"_id": ObjectId(user_id)})

    for each_user in all_users:
        for following_id in current_user["following"]:
            if each_user["_id"] == ObjectId(following_id):
                user_data.append(each_user)
    return dumps(user_data)

@app.route("/users/picture", methods=["POST"])
def user_picture():
    users = mongo.db.users
    user_id = request.headers.get('user_id')
    user_picture = request.files['picture']
    location = "static/users/" + user_picture.filename
    user_picture.save(location)
    picture = location
    users.update_one({"_id": ObjectId(user_id)}, {"$set": {"picture": picture}})
    user_data = users.find_one({"_id": ObjectId(user_id)})
    return dumps({"user_id": user_id, "name": user_data["name"], "email": user_data["email"], "picture": user_data["picture"]})
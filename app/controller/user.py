from app.etc.response import success, fail
from app.constants import message
from app.constants.schema import user_schema
from app.etc.decorate import get_request_json, authorized, validate_schema, JWT_KEY, admin
import logging
import jwt
import json
from bson.json_util import loads, dumps
from app import model

from google.oauth2 import id_token
from google.auth.transport import requests


@get_request_json
async def login_google(request, body):
    token = body["token"]
    try:
        id_info = id_token.verify_oauth2_token(token, requests.Request())
    except ValueError:
        return fail(message=message.INVALID_TOKEN, status=422)
    email = id_info["email"]
    user = model.get_user_by_email(email)
    if user is None:
        user = {
            "email": email,
            "active": True,
            "name": id_info["name"],
            "avatar": id_info["picture"],
            "role": "user"
        }
        user = model.create_user(user)
    data = {"email": user["email"]}
    access_token = jwt.encode(key=JWT_KEY, payload=json.loads(dumps(data)), algorithm="HS256")
    return success(json.loads(dumps({"token": str(access_token, "utf-8")})))


@get_request_json
@authorized
async def update_user(request, body, user):
    try:
        validate_schema(body, user_schema)
        if "email" in body and model.get_user_by_email(body["email"]) is not None:
            return fail(message=message.EXISTING_EMAIL)
        user_id = user["_id"]["$oid"]
        result = model.update_user(loads(dumps(body)), user_id)
        if result is not None:
            return success(json.loads(dumps(result)))
    except Exception as e:
        logging.error(e)
    return fail(message=message.FAIL, status=400)


@authorized
async def get_my_info(request, user):
    return success(data=user)

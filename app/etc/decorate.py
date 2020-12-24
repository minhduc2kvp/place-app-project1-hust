from jsonschema import validate
import jwt
import os
import json
from bson.json_util import loads, dumps
from app.etc.response import fail
from app.constants.message import INVALID_TOKEN, EXPIRED_TOKEN, UNAUTHORIZED
from app import model

AUTHORIZATION = "Authorization"
JWT_KEY = os.environ.get(
    "SECRET_KEY", "project_hust_minhvu"
)


def validate_schema(data, schema):
    try:
        validate(instance=data, schema=schema)
    except Exception as e:
        raise e


def get_request_json(f):
    async def wrapper(*args, **kwargs):
        try:
            request_json = await args[0].json()
            kwargs.update({"body": request_json})
            return await f(*args, **kwargs)
        except Exception as e:
            raise e
    return wrapper


def authorized(f):
    async def wrapper(*agrs, **kwargs):
        access_token = agrs[0].headers.get(AUTHORIZATION)
        try:
            token = jwt.decode(access_token, JWT_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return fail(EXPIRED_TOKEN, 422)
        except jwt.InvalidTokenError:
            return fail(INVALID_TOKEN, 422)
        user = model.get_user_by_email(token["email"])
        if user is None:
            return fail(UNAUTHORIZED, 401)
        kwargs.update({"user": json.loads(dumps(user))})
        return await f(*agrs, **kwargs)
    return wrapper


def admin(f):
    async def wrapper(*agrs, **kwargs):
        access_token = agrs[0].headers.get(AUTHORIZATION)
        try:
            token = jwt.decode(access_token, JWT_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return fail(EXPIRED_TOKEN, 422)
        except jwt.InvalidTokenError:
            return fail(INVALID_TOKEN, 422)
        user = model.get_user_by_email(token["email"])
        if user is None or user["role"] != "admin":
            return fail(UNAUTHORIZED, 401)
        return await f(*agrs, **kwargs)
    return wrapper

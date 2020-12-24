from app.etc.response import success, fail
from app.constants import message
from app.constants.schema import place_schema, update_place_schema
from app.etc.decorate import get_request_json, validate_schema, admin
import logging
import json
from bson.json_util import loads, dumps
from app import model


@admin
@get_request_json
async def create_place(request, body):
    try:
        validate_schema(data=body, schema=place_schema)
        place = model.create_place(place=body)
        return success(data=json.loads(dumps(place)))
    except Exception as e:
        logging.error(e)
    return fail(message=message.FAIL, status=400)


@admin
@get_request_json
async def update_place(request, body):
    try:
        validate_schema(data=body, schema=update_place_schema)
        place_id = request.match_info.get("place_id")
        place = model.get_place_by_id(place_id)
        if place is None:
            return fail(message=message.NOTFOUND, status=404)
        place = model.update_place(data=body, place=place)
        return success(data=json.loads(dumps(place)))
    except Exception as e:
        logging.error(e)
    return fail(message=message.FAIL, status=400)


@admin
async def delete_place(request):
    try:
        place_id = request.match_info.get("place_id")
        place = model.get_place_by_id(place_id)
        if place is None:
            return fail(message=message.NOTFOUND, status=404)
        model.delete_site_by_place_id(place_id)
        model.delete_place(place_id)
        return success(data=message.SUCCESS)
    except Exception as e:
        logging.error(e)
    return fail(message=message.FAIL, status=400)


async def get_places(request):
    try:
        places = model.get_places()
        return success(data=json.loads(dumps(places)))
    except Exception as e:
        logging.error(e)
    return fail(message=message.FAIL, status=400)

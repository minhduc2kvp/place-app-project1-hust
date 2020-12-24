from app.etc.response import success, fail
from app.constants import message
from app.constants.schema import new_site_schema, update_site_schema
from app.etc.decorate import get_request_json, authorized, validate_schema, admin
import logging
import json
from bson.json_util import loads, dumps
from app import model


@admin
@get_request_json
async def create_site(request, body):
    try:
        validate_schema(data=body, schema=new_site_schema)
        if model.get_place_by_id(body["place_id"]) is None:
            return fail(message=message.NOTFOUND, status=404)
        site = model.create_site(site=body)
        return success(data=json.loads(dumps(site)))
    except Exception as e:
        logging.error(e)
    return fail(message=message.FAIL, status=400)


@admin
@get_request_json
async def update_site(request, body):
    try:
        validate_schema(data=body, schema=update_site_schema)
        site_id = request.match_info.get("site_id")
        site = model.get_site_by_id(site_id)
        if site is None:
            return fail(message=message.NOTFOUND, status=404)
        if "place_id" in body and model.get_place_by_id(body["place_id"]) is None:
            return fail(message=message.NOTFOUND, status=404)
        site = model.update_site(data=body, site=site)
        return success(data=json.loads(dumps(site)))
    except Exception as e:
        logging.error(e)
    return fail(message=message.FAIL, status=400)


@admin
async def delete_site(request):
    try:
        site_id = request.match_info.get("site_id")
        site = model.get_site_by_id(site_id)
        if site is None:
            return fail(message=message.NOTFOUND, status=404)
        model.delete_site(site_id)
        return success(data=message.SUCCESS)
    except Exception as e:
        logging.error(e)
    return fail(message=message.FAIL, status=400)


async def get_sites_by_place_id(request):
    try:
        place_id = request.match_info.get("place_id")
        place = model.get_place_by_id(place_id)
        if place is not None and place["vip"]:
            return fail(message=message.UNAUTHORIZED, status=401)
        sites = model.get_sites_by_place_id(place_id)
        return success(data=json.loads(dumps(sites)))
    except Exception as e:
        logging.error(e)
    return fail(message=message.FAIL, status=400)


@authorized
async def get_sites_by_place_id_vip(request, user):
    try:
        place_id = request.match_info.get("place_id")
        sites = model.get_sites_by_place_id(place_id)
        return success(data=json.loads(dumps(sites)))
    except Exception as e:
        logging.error(e)
    return fail(message=message.FAIL, status=400)


@admin
async def get_sites(request):
    try:
        sites = model.get_sites()
        return success(data=json.loads(dumps(sites)))
    except Exception as e:
        logging.error(e)
    return fail(message=message.FAIL, status=400)

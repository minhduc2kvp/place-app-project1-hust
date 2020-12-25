from app.etc.response import success, fail
from app.constants import message
import pandas as pd
from app.etc.decorate import get_request_json, admin
import logging
import json
from bson.json_util import loads, dumps
from app import model


# @admin
async def upload_file(request):
    try:
        data = await request.post()
        filename = data["file"].filename
        file = data["file"].file
        data_excel = pd.read_excel(file, engine='openpyxl')
        headers = []
        for item in data_excel:
            headers.insert(len(headers), item)
        data_excel.to_excel(filename)
        response = {
            "filename": filename,
            "headers": headers
        }
        return success(response)
    except Exception as e:
        logging.error(e)
    return fail(message=message.FAIL, status=400)


@get_request_json
async def import_file(request, body):
    try:
        data_excel = pd.read_excel(body["filename"], engine='openpyxl')
        site = dict()
        valid = data_excel[body["name"]].isna()
        for i in range(0, len(data_excel[body["name"]])):
            site = {
                "name": data_excel[body["name"]][i],
                "description": data_excel[body["description"]][i],
                "latitude": data_excel[body["latitude"]][i],
                "longitude": data_excel[body["longitude"]][i],
                "place_id": body["place_id"]
            }
            if valid[i]:
                site["name"] = "--- ? ---"
            model.create_site(site)
        return success(message.SUCCESS)
    except Exception as e:
        logging.error(e)
    return fail(message=message.FAIL, status=400)


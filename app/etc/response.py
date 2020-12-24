from aiohttp.web import json_response


def success(data, status=200):
    return json_response(
        {"status": "success", "data": data}, status=status
    )


def fail(message, status=200):
    return json_response(
        {"status": "fail", "data": {"message": message}}, status=status
    )

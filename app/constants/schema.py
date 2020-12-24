place_schema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "vip": {"type": "boolean"}
    },
    "required": ["name", "vip"]
}

update_place_schema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "vip": {"type": "boolean"}
    }
}

new_site_schema = {
    "type": "object",
    "properties": {
        "place_id": {"type": "string"},
        "name": {"type": "string"},
        "description": {"type": "string"},
        "latitude": {"type": "number"},
        "longitude": {"type": "number"}
    },
    "required": ["place_id", "name", "latitude", "longitude"]
}

update_site_schema = {
    "type": "object",
    "properties": {
        "place_id": {"type": "string"},
        "name": {"type": "string"},
        "description": {"type": "string"},
        "latitude": {"type": "number"},
        "longitude": {"type": "number"}
    }
}

user_schema = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "email": {
            "type": "string",
            "format": "email",
            "pattern": "^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$"
        },
        "birthday": {
            "type": "string",
            "format": "date",
            # "pattern": "^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"
        },
        "gender": {"enum": ["man", "woman", "other"]},
        "avatar": {"type": "string"},
        "active": {"type": "boolean"},
        "role": {"enum": ["user", "admin"]}
    }
}


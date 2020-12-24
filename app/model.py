from pymongo import MongoClient
from bson.json_util import ObjectId
from app.config import *

client = MongoClient(MONGO_CLIENT)
database = client[CLIENT]
places_collection = database[PLACES_COLLECTION]
sites_collection = database[SITES_COLLECTION]
users_collection = database[USERS_COLLECTION]


# PLACE
def create_place(place):
    try:
        id_generate = places_collection.insert_one(place).inserted_id
        return places_collection.find_one({"_id": ObjectId(id_generate)})
    except Exception as e:
        raise e


def update_place(data, place):
    try:
        data = {"$set": data}
        places_collection.update_one(place, data)
        return places_collection.find_one({"_id": place["_id"]})
    except Exception as e:
        raise e


def delete_place(place_id):
    try:
        places_collection.delete_one({"_id": ObjectId(place_id)})
    except Exception as e:
        raise e


def get_places():
    try:
        return places_collection.find()
    except Exception as e:
        raise e


def get_place_by_id(place_id):
    try:
        return places_collection.find_one({"_id": ObjectId(place_id)})
    except Exception as e:
        raise e


# SITE
def create_site(site):
    try:
        id_generate = sites_collection.insert_one(site).inserted_id
        return sites_collection.find_one({"_id": ObjectId(id_generate)})
    except Exception as e:
        raise e


def update_site(data, site):
    try:
        data = {"$set": data}
        sites_collection.update_one(site, data)
        return sites_collection.find_one({"_id": site["_id"]})
    except Exception as e:
        raise e


def delete_site(site_id):
    try:
        sites_collection.delete_one({"_id": ObjectId(site_id)})
    except Exception as e:
        raise e


def delete_site_by_place_id(place_id):
    try:
        sites_collection.delete_many({"place_id": place_id})
    except Exception as e:
        raise e


def get_sites():
    try:
        return sites_collection.find()
    except Exception as e:
        raise e


def get_site_by_id(site_id):
    try:
        return sites_collection.find_one({"_id": ObjectId(site_id)})
    except Exception as e:
        raise e


def get_sites_by_place_id(place_id):
    try:
        return sites_collection.find({"place_id": place_id})
    except Exception as e:
        raise e


# USER
def create_user(user):
    try:
        id_generate = users_collection.insert_one(user).inserted_id
        return users_collection.find_one({"_id": ObjectId(id_generate)})
    except Exception as e:
        raise e


def update_user(data, user_id):
    try:
        data = {"$set": data}
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        users_collection.update_one(user, data)
        return users_collection.find_one({"_id": ObjectId(user_id)})
    except Exception as e:
        raise e


def delete_user(user_id):
    try:
        users_collection.delete_one({"_id": ObjectId(user_id)})
    except Exception as e:
        raise e


def get_users():
    try:
        return users_collection.find()
    except Exception as e:
        raise e


def get_user_by_id(user_id):
    try:
        return users_collection.find_one({"_id": user_id})
    except Exception as e:
        raise e


def get_user_by_email(emai):
    try:
        return users_collection.find_one({"email": emai, "active": True})
    except Exception as e:
        raise e

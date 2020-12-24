import os

# CONFIG MONGO
MONGO_CLIENT = os.environ.get("MONGO_CLIENT", "mongodb://127.0.0.1:27017/")
CLIENT = os.environ.get("CLIENT", "place_app")
PLACES_COLLECTION = os.environ.get("PLACES_COLLECTION", "places")
SITES_COLLECTION = os.environ.get("SITES_COLLECTION", "sites")
USERS_COLLECTION = os.environ.get("USERS_COLLECTION", "users")

# CONFIG ROUTES API
URL = os.environ.get("URL", "/api/v1")

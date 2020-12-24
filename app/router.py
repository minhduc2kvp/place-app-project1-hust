from app.controller.view import home_page, admin_page
from app.controller.user import login_google, update_user, get_my_info
from app.controller.place import create_place, update_place, delete_place, get_places
from app.controller.site import create_site, update_site, delete_site, get_sites_by_place_id, get_sites_by_place_id_vip, get_sites
from app.controller.file import upload_file, import_file


def setup_routes(app):
    app.router.add_route("GET", "", home_page)
    app.router.add_route("GET", "/admin", admin_page)
    app.router.add_route("POST", "/api/login", login_google)

    app.router.add_route("GET", "/api/users", get_my_info)
    app.router.add_route("PUT", "/api/users", update_user)

    app.router.add_route("GET", "/api/places", get_places)
    app.router.add_route("POST", "/api/places", create_place)
    app.router.add_route("PUT", "/api/places/{place_id}", update_place)
    app.router.add_route("DELETE", "/api/places/{place_id}", delete_place)

    app.router.add_route("GET", "/api/sites", get_sites)
    app.router.add_route("GET", "/api/sites/{place_id}", get_sites_by_place_id)
    app.router.add_route("GET", "/api/sites/vip/{place_id}", get_sites_by_place_id_vip)
    app.router.add_route("POST", "/api/sites", create_site)
    app.router.add_route("PUT", "/api/sites/{site_id}", update_site)
    app.router.add_route("DELETE", "/api/sites/{site_id}", delete_site)

    app.router.add_route("POST", "/api/files/upload", upload_file)
    app.router.add_route("POST", "/api/files/import", import_file)


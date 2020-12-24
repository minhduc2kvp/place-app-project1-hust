from aiohttp import web
from app.router import setup_routes


app = web.Application()
setup_routes(app)
app.router.add_static(prefix="/static", path="app/templates/static")
web.run_app(app, host="localhost", port=8888)

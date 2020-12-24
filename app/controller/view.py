from aiohttp.web_response import Response
from app.etc.decorate import admin


async def home_page(request):
    file = open("app/templates/index.html", "r")
    html = file.read()
    return Response(text=html, content_type="text/html")


# @admin
async def admin_page(request):
    file = open("app/templates/admin.html", "r")
    html = file.read()
    return Response(text=html, content_type="text/html")

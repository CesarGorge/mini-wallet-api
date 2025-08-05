import os
import django

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wallet_project.settings')
django.setup()

handler = get_wsgi_application()

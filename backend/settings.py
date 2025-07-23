import os
from datetime import timedelta
from pathlib import Path
from decouple import config, Csv
import dj_database_url

# --------------------------------------------------------------------------------------
# BASE DIRECTORIES
# --------------------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# --------------------------------------------------------------------------------------
# SECURITY & DEBUG
# --------------------------------------------------------------------------------------



SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
MAILERSEND_API_TOKEN = os.getenv("MAILERSEND_API_TOKEN")
MAILERSEND_FROM_EMAIL = os.getenv("MAILERSEND_FROM_EMAIL")
MAILERSEND_FROM_NAME = os.getenv("MAILERSEND_FROM_NAME")

if DEBUG:
    ALLOWED_HOSTS = config('DEV_ALLOWED_HOSTS', cast=Csv())
    CORS_ALLOW_ORIGINS = config('DEV_CORS_ALLOW_ORIGINS', cast=Csv())
    CSRF_TRUSTED_ORIGINS = config('DEV_CSRF_TRUSTED_ORIGINS', cast=Csv())
else:
    ALLOWED_HOSTS = config('PROD_ALLOWED_HOSTS', cast=Csv())
    CORS_ALLOW_ORIGINS = config('PROD_CORS_ALLOW_ORIGINS', cast=Csv())
    CSRF_TRUSTED_ORIGINS = config('PROD_CSRF_TRUSTED_ORIGINS', cast=Csv())


# --------------------------------------------------------------------------------------
# MAILERSEND SETTINGS
# --------------------------------------------------------------------------------------

# --------------------------------------------------------------------------------------
# APPLICATIONS
# --------------------------------------------------------------------------------------
THIRD_PARTY_APPS = [
    'jazzmin',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'drf_yasg',
]

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

PROJECT_APPS = [
    'userauths',
    'api',
]

INSTALLED_APPS = THIRD_PARTY_APPS + DJANGO_APPS + PROJECT_APPS

# --------------------------------------------------------------------------------------
# MIDDLEWARE
# --------------------------------------------------------------------------------------
MIDDLEWARE = [
    # CORS
    'corsheaders.middleware.CorsMiddleware',

    # Seguridad
    'django.middleware.security.SecurityMiddleware',

    # Sesiones, Autenticación, Mensajes
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
    'backend.middleware.AppendSlashMiddleware',

    # WhiteNoise (opcional, si la usas en producción)
    # 'whitenoise.middleware.WhiteNoiseMiddleware',
]

# --------------------------------------------------------------------------------------
# URLS & WSGI
# --------------------------------------------------------------------------------------
ROOT_URLCONF = 'backend.urls'
WSGI_APPLICATION = 'backend.wsgi.application'

# --------------------------------------------------------------------------------------
# TEMPLATES
# --------------------------------------------------------------------------------------
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "frontend/dist")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# --------------------------------------------------------------------------------------
# DATABASE
# --------------------------------------------------------------------------------------
DATABASES = {
    'default': dj_database_url.config(
        default=f'sqlite:///{BASE_DIR / config("DATABASE_NAME")}'
    )
}

# --------------------------------------------------------------------------------------
# PASSWORD VALIDATION
# --------------------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# --------------------------------------------------------------------------------------
# INTERNATIONALIZATION
# --------------------------------------------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# --------------------------------------------------------------------------------------
# STATIC & MEDIA FILES
# --------------------------------------------------------------------------------------
STATIC_URL = '/assets/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "frontend/dist/assets"),
]
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")  # Solo para producción

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# --------------------------------------------------------------------------------------
# REST FRAMEWORK
# --------------------------------------------------------------------------------------
REST_FRAMEWORK = {
    # Según tu configuración original, si no definiste nada, puedes ajustarlo:
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}

# --------------------------------------------------------------------------------------
# SIMPLE JWT
# --------------------------------------------------------------------------------------
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=50),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',

    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

# --------------------------------------------------------------------------------------
# CUSTOM USER MODEL
# --------------------------------------------------------------------------------------
AUTH_USER_MODEL = 'userauths.User'


# --------------------------------------------------------------------------------------
# CORS & CSRF
# --------------------------------------------------------------------------------------
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'x-client-token',
]
CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_NAME = "csrftoken"
CSRF_TRUSTED_ORIGINS = config('DEV_CSRF_TRUSTED_ORIGINS', cast=Csv()) if DEBUG else config('PROD_CSRF_TRUSTED_ORIGINS', cast=Csv())

# --------------------------------------------------------------------------------------
# JAZZMIN SETTINGS
# --------------------------------------------------------------------------------------
JAZZMIN_SETTINGS = {
    "site_title": "RC Klean Admin",
    "site_header": "RC Klean",
    "site_brand": "Invoice Estimator",
    "site_icon": "wirk-logo-DSs3kRsd.png",
    "site_logo": "wirk-logo-DSs3kRsd.png",
    "welcome_sign": "Wlcome to admin dashboard",
    "copyright": "All rights reserved",
    "show_sidebar": True,
    "navigation_expanded": True,
    "order_with_respect_to": [
        "api.AreaType",
        "forms.ServiceType",
        "forms.AreaSize",
        "userauths",
        "userauths.user",
        "userauths.profile",
    ],
    "icons": {
        "admin.LogEntry": "fas fa-file",

        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",

        "userauths.User": "fas fa-user",
        "userauths.Profile": "fas fa-address-card",

        "api.Product": "fas fa-th",
        "api.EquipmentType": "fas fa-shopping-cart",
        "api.Invoice": "fas fa-cart-plus",
        "api.BusinessType": "fas fa-shopping-basket",
        "api.AreaType": "fas fa-check-circle"
        ''' "store.productfaq": "fas fa-question",
        "store.Review": "fas fa-star fa-beat",
        "store.Category": "fas fa-tag",
        "store.Coupon": "fas fa-percentage",
        "store.DeliveryCouriers": "fas fa-truck",
        "store.Address": "fas fa-location-arrow",
        "store.Tag": "fas fa-tag",
        "store.Wishlist": "fas fa-heart",
        "store.Notification": "fas fa-bell", '''

    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-arrow-circle-right",
    "related_modal_active": True,

    "custom_js": None,
    "show_ui_builder": False,

    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {
        "auth.user": "collapsible",
        "auth.group": "vertical_tabs",
    },
}
# coding=utf-8
import logging
import os
from dotenv import load_dotenv

_DOT_ENV_PATH = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(_DOT_ENV_PATH)

__author__ = 'Ductt'
_logger = logging.getLogger(__name__)

ROOT_DIR = os.path.abspath(os.path.join(
    os.path.dirname(__file__)
))
ENV_MODE = os.environ.get('ENV_MODE', '').upper()

DEBUG = True
TESTING = False
LOGGING_CONFIG_FILE = os.path.join(ROOT_DIR, 'etc', 'logging.ini')

FLASK_APP_SECRET_KEY = os.getenv('SECRET_KEY', 'ductt97')

MYSQL_DATABASE = os.getenv('MYSQL_DATABASE')
MYSQL_HOST = os.getenv('MYSQL_HOST')
MYSQL_USER = os.getenv('MYSQL_USER')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
MYSQL_PORT = os.getenv('MYSQL_FORWARD_PORT')
SECURITY_PASSWORD_SALT = "abc"

POSTGRESQL_DATABASE = os.getenv('POSTGRESQL_DATABASE')
POSTGRESQL_HOST = os.getenv('POSTGRESQL_HOST')
POSTGRESQL_USER = os.getenv('POSTGRESQL_USER')
POSTGRESQL_PASSWORD = os.getenv('POSTGRESQL_PASSWORD')
POSTGRESQL_PORT = os.getenv('POSTGRESQL_FORWARD_PORT')

MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USERNAME = 'oasis.uet.test@gmail.com'
MAIL_PASSWORD = 'UET123456789'
MAIL_DEFAULT_SENDER = 'oasis.uet.test@gmail.com'
MAIL_USE_TLS = 1

API_URL = os.getenv('API_URL')
TOKEN_EXPIRED_TIME = 36000

SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://{0}:{1}@{2}:{3}/{4}'.format(
    POSTGRESQL_USER, POSTGRESQL_PASSWORD, POSTGRESQL_HOST, POSTGRESQL_PORT, POSTGRESQL_DATABASE
)
SQLALCHEMY_TRACK_MODIFICATIONS = True
SQLALCHEMY_COMMIT_ON_TEARDOWN = True

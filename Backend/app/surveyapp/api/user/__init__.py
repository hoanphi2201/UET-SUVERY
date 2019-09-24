from surveyapp.extensions.namespace import Namespace

ns = Namespace('users', description='User operators')

from .user import User
from .user_add import UserAdd



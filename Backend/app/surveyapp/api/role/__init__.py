from surveyapp.extensions.namespace import Namespace

ns = Namespace('roles', description='Role operators')

from .role import Role
from .role_add import RoleAdd
from .functions import Function

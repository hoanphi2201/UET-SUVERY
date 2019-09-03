from surveyapp.extensions.namespace import Namespace

ns = Namespace('auth', description='Auth operator')

from .signup import SignUp
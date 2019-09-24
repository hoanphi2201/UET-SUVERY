from flask_restplus import Resource, fields
from flask_jwt_extended import jwt_required
from surveyapp.helpers.decorators import function_required
from surveyapp.constants.function import ADD_USER, VIEW_ALL_USER
from . import ns

user_add_response = ns.model(
    name='User Add Response',
    model={
        'created': fields.Boolean()
    }
)


@ns.route('/')
class UserAdd(Resource):
    @jwt_required
    @function_required(ADD_USER)
    def post(self):
        pass

    @jwt_required
    @function_required(VIEW_ALL_USER)
    def get(self):
        pass

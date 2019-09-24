from flask_restplus import Resource, fields
from flask_jwt_extended import jwt_required
from surveyapp.helpers.decorators import function_required
from surveyapp.constants.function import EDIT_USER, VIEW_ALL_USER, DELETE_USER
from . import ns


user_edit_response = ns.model(
    name='User Edit Response',
    model={
        'updated': fields.Boolean()
    }
)

user_delete_response = ns.model(
    name='User Delete Response',
    model={
        'deleted': fields.Boolean()
    }
)


@ns.route('/<string:user_id>')
class User(Resource):
    @jwt_required
    @function_required(VIEW_ALL_USER)
    def get(self, user_id):
        pass

    @jwt_required
    @function_required(EDIT_USER)
    def put(self, user_id):
        pass

    @jwt_required
    @function_required(DELETE_USER)
    def delete(self, user_id):
        pass

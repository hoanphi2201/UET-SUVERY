from flask_restplus import Resource, fields
from flask_jwt_extended import jwt_required
from surveyapp.helpers.decorators import function_required
from surveyapp.constants.function import EDIT_ROLE, DELETE_ROLE, VIEW_ALL_ROLE
from . import ns


role_edit_response = ns.model(
    name='Role Edit Response',
    model={
        'updated': fields.Boolean()
    }
)

role_delete_response = ns.model(
    name='Role Delete Response',
    model={
        'deleted': fields.Boolean()
    }
)


@ns.route('/<int:role_id>')
class Role(Resource):
    @jwt_required
    @function_required(VIEW_ALL_ROLE)
    def get(self, role_id):
        pass

    @jwt_required
    @function_required(EDIT_ROLE)
    def put(self, role_id):
        pass

    @jwt_required
    @function_required(DELETE_ROLE)
    def delete(self, role_id):
        pass

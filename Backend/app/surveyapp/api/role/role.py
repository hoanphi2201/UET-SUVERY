from flask_restplus import Resource, fields
from flask_jwt_extended import jwt_required
from surveyapp.helpers.decorators import function_required
from surveyapp.constants.function import EDIT_ROLE, DELETE_ROLE, VIEW_ALL_ROLE
from surveyapp import models, extensions, repositories
from . import ns

role_model = ns.model(
    name="Role Response",
    model={
        'id': fields.Integer(),
        'name': fields.String(),
        'description': fields.String(),
        'functions': fields.List(fields.Integer()),
        'created_at': fields.DateTime(),
        'updated_at': fields.DateTime()
    }
)

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
    # @jwt_required
    # @function_required(VIEW_ALL_ROLE)
    def get(self, role_id):
        role = models.Role.query.filter(models.Role.id == role_id).first()
        if not role:
            raise extensions.exceptions.NotFoundException(
                message="Not found role"
            )
        return role.to_dict()

    # @jwt_required
    # @function_required(EDIT_ROLE)
    @ns.marshal_with(role_edit_response)
    def put(self, role_id):
        pass

    # @jwt_required
    # @function_required(DELETE_ROLE)
    @ns.marshal_with(role_delete_response)
    def delete(self, role_id):
        repositories.role.delete_role_by_id(role_id=role_id)
        return {
            'deleted': True
        }

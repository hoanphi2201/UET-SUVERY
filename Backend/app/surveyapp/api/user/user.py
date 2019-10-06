from flask_restplus import Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from surveyapp.helpers.decorators import function_required
from surveyapp.constants.function import EDIT_USER, VIEW_USER, DELETE_USER
from . import ns
from surveyapp import repositories, extensions

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

user_model = ns.model('user_model', {
    'id': fields.String(),
    'username': fields.String(),
    'email': fields.String(),
    'fullname': fields.String(),
    'role_id': fields.Integer,
    'role_name': fields.String(),
    'functions': fields.List(fields.Integer),
    'created_at': fields.DateTime(),
    'updated_at': fields.DateTime(),
})


@ns.route('/<string:user_id>')
class User(Resource):
    @ns.marshal_with(user_model)
    def get(self, user_id):
        user = repositories.user.find_user_by_id(user_id)
        if not user:
            raise extensions.exceptions.NotFoundException(
                message="Not found user"
            )
        return user.to_dict_simple()

    @jwt_required
    @function_required(EDIT_USER)
    def put(self, user_id):
        pass

    def delete(self, user_id):
        curr_id = get_jwt_identity()
        if curr_id == user_id:
            raise extensions.exceptions.ForbiddenException(
                message="You can't delete by yourself"
            )
        repositories.user.delete_user_by_id(user_id)
        return {
            'deleted': True
        }

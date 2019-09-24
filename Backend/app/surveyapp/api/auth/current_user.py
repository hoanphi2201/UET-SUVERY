from flask_restplus import Resource, fields
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from surveyapp import models, extensions
from . import ns

user_response = ns.model(
    name='User response',
    model={
        'id': fields.String(),
        'username': fields.String(),
        'email': fields.String(),
        'fullname': fields.String(),
        'is_active': fields.Boolean(),
        'created_at': fields.DateTime(),
        'role_id': fields.String(),
        'contact': fields.List(fields.String())
    }
)


@ns.route('/me')
class CurrentUser(Resource):
    @jwt_required
    @ns.marshal_with(user_response)
    def get(self):
        user_id = get_jwt_identity()
        user = models.User.query.filter(models.User.id == user_id).first()
        if not user:
            raise extensions.exceptions.BadRequestException(
                message="Invalid"
            )
        return user.to_dict()


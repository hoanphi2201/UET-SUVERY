from flask_restplus import fields, Resource
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_refresh_token_required,
    get_jwt_identity
)
from . import ns


refresh_access_token_request = ns.model(
    name='Refresh token request',
    model={
        'refresh_token': fields.String(
            required=True
        )
    }
)

refresh_access_token_response = ns.model(
    name='Refresh token response',
    model={
        'new_access_token': fields.String(),
        'new_refresh_token': fields.String()
    }
)


@ns.route('/refresh')
class RefreshToken(Resource):
    @jwt_refresh_token_required
    @ns.expect(refresh_access_token_request)
    @ns.marshal_with(refresh_access_token_response)
    def post(self):
        current_user_id = get_jwt_identity()
        access_token = create_access_token(identity=current_user_id)
        refresh_token = create_refresh_token(identity=current_user_id)
        return {
            'new_access_token': access_token,
            'new_refresh_token': refresh_token
        }

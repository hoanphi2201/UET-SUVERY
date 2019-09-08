from flask_restplus import fields, Resource
from flask import request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_refresh_token_required,
    get_jwt_identity
)
from . import ns
from surveyapp import services


refresh_access_token_request = ns.model(
    name='Refresh token request',
    model={
        'refreshToken': fields.String(
            required=True
        )
    }
)

refresh_access_token_response = ns.model(
    name='Refresh token response',
    model={
        'newAccessToken': fields.String(),
        'newRefreshToken': fields.String()
    }
)


@ns.route('/refreshAccessToken')
class RefreshToken(Resource):
    @jwt_refresh_token_required
    @ns.expect(refresh_access_token_request)
    @ns.marshal_with(refresh_access_token_response)
    def post(self):
        current_user_id = get_jwt_identity()
        access_token = create_access_token(identity=current_user_id)
        refresh_token = create_refresh_token(identity=current_user_id)
        return {
            'newAccessToken': access_token,
            'newRefreshToken': refresh_token
        }

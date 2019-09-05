from flask_restplus import fields, Resource
from flask import request
from flask_jwt_extended import create_access_token, create_refresh_token
from . import ns
from surveyapp import services


sign_in_request = ns.model(
    name='Sign in request',
    model={
        'username_or_email': fields.String(
            required=True
        ),
        'password': fields.String(
            required=True
        )
    }
)

sign_in_response = ns.model(
    name='Sign in response',
    model={
        'accessToken': fields.String(),
        'refreshToken': fields.String()
    }
)


@ns.route('/signIn')
class SignIn(Resource):
    @ns.expect(sign_in_request, validate=True)
    @ns.marshal_with(sign_in_response)
    def post(self):
        data = request.json
        user = services.auth.signin(**data)
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return {
            'accessToken': access_token,
            'refreshToken': refresh_token
        }

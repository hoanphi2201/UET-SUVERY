from flask_restplus import fields, Resource
from flask import request
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
    def post(self):
        data = request.json
        user = services.auth.signin(**data)
        pass

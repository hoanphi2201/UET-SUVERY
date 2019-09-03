from flask_restplus import Resource, fields
from flask import request

from surveyapp import services
from . import ns

signup_request = ns.model(
    name='Signup request model',
    model={
        'username': fields.String(
            required=True
        ),
        'email': fields.String(
            required=True
        ),
        'password': fields.String(
            required=True
        )
    }
)

signup_response = ns.model(
    name='Signup response model',
    model={
        'created': fields.Boolean()
    }
)


@ns.route('/signUp')
class SignUp(Resource):
    @ns.expect(signup_request, validate=True)
    @ns.marshal_with(signup_response)
    def post(self):
        data = request.json
        result = services.auth.signup(**data)
        return result

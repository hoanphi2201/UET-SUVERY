from flask_restplus import fields, Resource
from flask import request, after_this_request
from flask_jwt_extended import create_access_token
from datetime import timedelta
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
        'access_token': fields.String(),
        'user': fields.Nested(model=ns.model('user_model_permission', {
            'id': fields.String(),
            'username': fields.String(),
            'email': fields.String(),
            'fullname': fields.String(),
            'is_active': fields.Boolean(),
            'created_at': fields.DateTime(),
            'roles': fields.Nested(model=ns.model('role_model_simple', {
                'key': fields.String(),
                'permissions': fields.List(fields.String())
            })),
            'contact': fields.List(fields.String())
        }))
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

        @after_this_request
        def set_access_token_cookie(response):
            response.set_cookie(
                "access_token",
                access_token,
                max_age=timedelta(minutes=5),
            )
            return response

        return {
            'access_token': access_token,
            'user': user.to_dict()
        }

from flask_restplus import Resource, fields
from flask import request
from surveyapp import services
from flask_jwt_extended import jwt_required
from surveyapp.helpers.decorators import function_required
from surveyapp.constants.function import ADD_ROLE, VIEW_ALL_ROLE
from . import ns

role_add_request = ns.model(
    name='Role Add Request',
    model={
        'name': fields.String(required=True),
        'description': fields.String(),
        'functions': fields.List(fields.Integer)
    }
)


role_add_response = ns.model(
    name='Role Add Response',
    model={
        'created': fields.Boolean()
    }
)


@ns.route('/')
class RoleAdd(Resource):
    @ns.expect(role_add_request, validate=True)
    @ns.marshal_with(role_add_response)
    @jwt_required
    @function_required(ADD_ROLE)
    def post(self):
        data = request.json
        services.role.role_add(**data)
        return {
            'created': True
        }

    @jwt_required
    @function_required(VIEW_ALL_ROLE)
    def get(self):
        pass
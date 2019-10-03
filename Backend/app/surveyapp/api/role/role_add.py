from flask_restplus import Resource, fields
from flask import request
from surveyapp import services
from flask_jwt_extended import jwt_required
from surveyapp.helpers.decorators import function_required
from surveyapp.constants.function import ADD_ROLE, VIEW_ALL_ROLE
from surveyapp import extensions, models
from .role import role_model
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

role_list_model = ns.model(
    name="Role List Response",
    model={
        'totalItems': fields.Integer,
        'results': fields.List(fields.Nested(role_model))
    }
)


@ns.route('/')
class RoleAdd(Resource):
    @ns.expect(role_add_request, validate=True)
    @ns.marshal_with(role_add_response)
    # @jwt_required
    # @function_required(ADD_ROLE)
    def post(self):
        data = request.json
        services.role.role_add(**data)
        return {
            'created': True
        }

    # @jwt_required
    # @function_required(VIEW_ALL_ROLE)
    @ns.doc(
        params={
            'pageSize': 'page size',
            'page': 'page number',
            'q': 'key search by name',
            'orderBy': 'Sort type',
        }
    )
    def get(self):
        params = request.args
        page = params.get('page', 1)
        page_size = params.get('pageSize', 10)
        q = params.get('q', "")
        order_by = params.get('orderBy', 'name')
        try:
            page = int(page)
            page_size = int(page_size)
        except ValueError:
            raise extensions.exceptions.BadRequestException(
                message="Invalid params integer field"
            )
        # validate other fields
        if order_by not in ["name", "-name", "created_at", "-created_at", "updated_at", "-updated_at"]:
            raise extensions.exceptions.BadRequestException(
                message="Invalid params 'order_by'"
            )
        else:
            if order_by[0] == "-":
                sort_order = "desc"
                sort_name = order_by[1:]
            else:
                sort_order = "asc"
                sort_name = order_by

        list_all = models.db.session.query(
            models.Role
        ).filter(
            models.Role.name.ilike('%{}%'.format(q))
        )
        total = len(list_all.all())
        if sort_order == 'desc':
            results = list_all \
                .order_by(getattr(models.Role, sort_name).desc()) \
                .limit(page_size) \
                .offset((page - 1) * page_size) \
                .all()
        else:
            results = list_all \
                .order_by(getattr(models.Role, sort_name).asc()) \
                .limit(page_size) \
                .offset((page - 1) * page_size) \
                .all()
        return {
            'totalItems': total,
            'results': [x.to_dict() for x in results]
        }

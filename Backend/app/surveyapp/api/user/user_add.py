from flask_restplus import Resource, fields
from flask import request
from sqlalchemy import or_
from flask_jwt_extended import jwt_required
from surveyapp.helpers.decorators import function_required
from surveyapp.constants.function import ADD_USER
from surveyapp import models, repositories, extensions
from .user import user_model
from . import ns

user_add_request = ns.model(
    name='User Add Request',
    model={
        'username': fields.String(required=True),
        'email': fields.String(required=True),
        'fullname': fields.String(),
        'role_id': fields.Integer(),
        'functions': fields.List(fields.Integer)
    }
)

user_add_response = ns.model(
    name='User Add Response',
    model={
        'created': fields.Boolean()
    }
)

user_list_response = ns.model(
    name="User List Response",
    model={
        'totalItems': fields.Integer,
        'results': fields.List(fields.Nested(user_model))
    }
)


@ns.route('/')
class UserAdd(Resource):
    @ns.expect(user_add_request, validate=True)
    @ns.marshal_with(user_add_response)
    def post(self):
        data = request.json
        user_exist = repositories.user.find_user_by_username_or_email_ignore_case(
            username=data.get('username', ''),
            email=data.get('email', '')
        )
        if user_exist:
            raise extensions.exceptions.BadRequestException(
                message="User existed"
            )
        data_insert = {
            'username': data.get('username'),
            'email': data.get('email'),
        }
        if data.get('fullname', None) not in [None, '']:
            data_insert.update({'fullname': data.get('fullname')})
        if data.get('role', None) is not None and data.get('role', None) != 0:
            data_insert.update({'role_id': data.get('role', None)})

        repositories.user.create_user(**data_insert)
        return {
            'created': True
        }

    @ns.doc(
        params={
            'pageSize': 'page size',
            'page': 'page number',
            'q': 'key search by username or email',
            'orderBy': 'Sort type',
            'role_id': 'Role'
        }
    )
    @ns.marshal_with(user_list_response)
    def get(self):
        params = request.args
        page = params.get('page', 1)
        page_size = params.get('pageSize', 10)
        q = params.get('q', "")
        order_by = params.get('orderBy', 'username')
        role_id = params.get('role_id', 0)
        try:
            page = int(page)
            page_size = int(page_size)
            role_id = int(role_id)
        except ValueError:
            raise extensions.exceptions.BadRequestException(
                message="Invalid params integer field"
            )
        # validate other fields
        if order_by not in ["username", "-username", "email", "-email", "fullname", "-fullname",
                            "created_at", "-created_at", "updated_at", "-updated_at"]:
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
            models.User
        ).filter(
            or_(
                models.User.username.ilike('%{}%'.format(q)),
                models.User.email.ilike('%{}%'.format(q)),
            )
        )
        if role_id != 0:
            list_all = list_all.filter(
                models.User.role_id == role_id
            )
        total = len(list_all.all())
        if sort_order == 'desc':
            results = list_all \
                .order_by(getattr(models.User, sort_name).desc()) \
                .limit(page_size) \
                .offset((page - 1) * page_size) \
                .all()
        else:
            results = list_all \
                .order_by(getattr(models.User, sort_name).asc()) \
                .limit(page_size) \
                .offset((page - 1) * page_size) \
                .all()
        return {
            'totalItems': total,
            'results': [x.to_dict_simple() for x in results]
        }

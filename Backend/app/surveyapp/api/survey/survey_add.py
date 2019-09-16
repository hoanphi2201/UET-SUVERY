from flask_restplus import Resource, fields
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from flask import request
from surveyapp import models, services
from .survey_list import survey_list_model
from . import ns

survey_add_request = ns.model(
    name='Survey Add Request',
    model=models.SurveyModel.survey_add_model
)

survey_add_response = ns.model(
    name='Survey Add Response',
    model={
        'created': fields.Boolean()
    }
)


@ns.route('/')
class SurveyAdd(Resource):
    @jwt_required
    @ns.expect(survey_add_request, validate=True)
    @ns.marshal_with(survey_add_response)
    def post(self):
        owner_id = get_jwt_identity()
        services.survey.survey_add(owner_id=owner_id, **request.json)
        return {
            'created': True
        }

    @ns.doc(
        params={
            'size': 'page size',
            'offset': 'page number',
            'q': 'key search by name',
            'sortName': 'Sort field',
            'sortOrder': 'Sort type',
            'status': 'all, draft, open or close',
            'visible': 'public or protected'
        }
    )
    @jwt_required
    @ns.marshal_with(survey_list_model)
    def get(self):
        owner_id = get_jwt_identity()
        params = request.args
        offset = params.get('offset', 1)
        size = params.get('size', 10)
        q = params.get('q', "")
        sort_name = params.get('sortName', 'created_at')
        sort_order = params.get('sortOrder', 'desc')
        status = params.get('status', 'all')
        visible = params.get('visible', 'all')
        result = services.survey.get_list(
            owner_id, offset, size, q, sort_name, sort_order, status, visible
        )
        return result

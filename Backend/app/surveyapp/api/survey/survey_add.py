from flask_restplus import Resource, fields
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from flask import request
from surveyapp import models, services
from surveyapp.helpers.decorators import function_required
from surveyapp.constants.function import ADD_SURVEY
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
    @ns.expect(survey_add_request, validate=True)
    @ns.marshal_with(survey_add_response)
    @jwt_required
    @function_required(ADD_SURVEY)
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
            'name': 'key search by name',
            'order_by': 'Sort type',
            'status': 'all, draft, open or close',
        }
    )
    @jwt_required
    @ns.marshal_with(survey_list_model)
    def get(self):
        owner_id = get_jwt_identity()
        params = request.args
        offset = params.get('offset', 1)
        size = params.get('size', 10)
        name = params.get('name', "")
        order_by = params.get('order_by', 'name')
        status = params.get('status', 'all')
        result = services.survey.get_list(
            owner_id, offset, size, name, order_by, status
        )
        return result

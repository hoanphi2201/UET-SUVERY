from flask_restplus import Resource, fields
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from flask import request
from surveyapp import models, services
from surveyapp.helpers.decorators import function_required
from .survey_list import survey_list_model
from . import ns

survey_add_request = ns.model(
    name='Survey Add Request',
    model=models.SurveyModel.survey_add_model
)

survey_add_response = ns.model(
    name='Survey Add Response',
    model={
        'id': fields.String()
    }
)


@ns.route('/')
class SurveyAdd(Resource):
    @ns.expect(survey_add_request, validate=True)
    @ns.marshal_with(survey_add_response)
    # @jwt_required
    # @function_required(ADD_SURVEY)
    def post(self):
        # owner_id = get_jwt_identity()
        new_survey = services.survey.survey_add(owner_id='f641730a08b04db0b450db2c9156c19e', **request.json)
        return {
            'id': new_survey.id
        }

    @ns.doc(
        params={
            'pageSize': 'page size',
            'page': 'page number',
            'q': 'key search by name',
            'orderBy': 'Sort type',
        }
    )
    # @jwt_required
    @ns.marshal_with(survey_list_model)
    def get(self):
        owner_id = 'f641730a08b04db0b450db2c9156c19e' or get_jwt_identity()
        params = request.args
        page = params.get('page', 1)
        page_size = params.get('pageSize', 10)
        q = params.get('q', "")
        order_by = params.get('orderBy', 'name')
        result = services.survey.get_list(
            owner_id, page, page_size, q, order_by
        )
        return result

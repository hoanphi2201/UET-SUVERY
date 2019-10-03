from flask_restplus import Resource, fields
from flask import request
from flask_jwt_extended import jwt_required
from surveyapp import models, services
from . import ns

survey_model = ns.model(
    name='Survey Model',
    model=models.SurveyModel.survey_model
)

survey_list_model = ns.model(
    name='Survey List Model',
    model={
        'totalItems': fields.Integer,
        'results': fields.List(fields.Nested(survey_model))
    })


@ns.route('/<string:owner_id>')
class SurveyList(Resource):
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
    @ns.marshal_with(survey_list_model)
    @jwt_required
    def get(self, owner_id):
        pass
        # params = request.args
        # offset = params.get('offset', 1)
        # size = params.get('size', 10)
        # q = params.get('q', "")
        # sort_name = params.get('sortName', 'created_at')
        # sort_order = params.get('sortOrder', 'desc')
        # status = params.get('status', 'all')
        # visible = params.get('visible', 'all')
        # result = services.survey.get_list(
        #     owner_id, offset, size, q, sort_name, sort_order, status, visible
        # )
        # return result

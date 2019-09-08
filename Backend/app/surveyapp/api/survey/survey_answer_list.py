from flask_restplus import Resource, fields
from . import ns


@ns.route('/answer/list')
class SurveyListPagination(Resource):
    def get(self):
        pass


@ns.route('/answer/all/<int:survey_form_id>')
class SurveyList(Resource):
    def get(self):
        pass

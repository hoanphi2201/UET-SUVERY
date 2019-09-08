from flask_restplus import Resource, fields
from . import ns


@ns.route('/answer/<string:survey_answer_id>')
class SurveyAnswer(Resource):
    def get(self):
        pass

    def put(self):
        pass

    def delete(self):
        pass

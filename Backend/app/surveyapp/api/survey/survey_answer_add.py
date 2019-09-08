from flask_restplus import Resource, fields
from . import ns


@ns.route('/answer')
class SurveyAnswerAdd(Resource):
    def post(self):
        pass

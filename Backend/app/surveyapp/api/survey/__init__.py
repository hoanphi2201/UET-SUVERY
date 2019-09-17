from surveyapp.extensions.namespace import Namespace

ns = Namespace('surveys', description='Survey operator')

from .survey import Survey
from .survey_add import SurveyAdd
from .survey_list import SurveyList
from .survey_answer import SurveyAnswer
from .survey_answer_add import SurveyAnswerAdd
from .survey_answer_list import SurveyAnswerList

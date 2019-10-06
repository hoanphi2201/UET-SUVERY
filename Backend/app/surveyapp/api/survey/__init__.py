from surveyapp.extensions.namespace import Namespace

ns = Namespace('surveys', description='Survey operators')

from .survey import Survey
from .survey_add import SurveyAdd
# from .survey_list import SurveyList
from .survey_answer import SurveyAnswer
from .survey_answer_add import SurveyAnswerAdd
from .survey_answer_list import SurveyAnswerList
from .survey_invite import SurveyInvite
from .survey_subscribe_link import SurveyLink, SurveyFromLink
from .survey_collection_add import CollectionCreateLink
from .survey_collection import CollectionLink, CollectionsList


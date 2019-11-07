import json
from surveyapp import extensions, repositories


def survey_answer_add(survey_form_id='', link='', user_id=None, answer=''):
    try:
        answer = json.loads(answer)
    except ValueError:
        raise extensions.exceptions.BadRequestException(
            message="Json field is invalid"
        )
    survey = repositories.survey_form.find_survey_by_id(
        survey_form_id
    )
    if not survey or link not in [l.id for l in survey.survey_link]:
        raise extensions.exceptions.BadRequestException(
            message="Survey not found"
        )
    repositories.survey_answer.add_survey_answer(survey_form_id, link, user_id, answer)

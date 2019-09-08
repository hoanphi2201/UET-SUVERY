from surveyapp import models
from sqlalchemy.exc import SQLAlchemyError
from .user import find_user_by_id


def add_survey(name='', json='', owner_id=None, **kwargs):
    try:
        new_survey = models.SurveyForm(
            name=name,
            json=json,
            **kwargs
        )
        models.db.session.add(new_survey)
        owner = find_user_by_id(user_id=owner_id)
        if owner:
            owner.survey_form.append(new_survey)

        is_visible = kwargs.get('is_visible', True)
        if not is_visible:
            respondents_id = kwargs.get('respondents_id', [])
            for re_id in respondents_id:
                respondents = find_user_by_id(user_id=re_id)
                if respondents:
                    new_survey.respondents.append(respondents)

        models.db.session.commit()
        return new_survey
    except SQLAlchemyError:
        return None

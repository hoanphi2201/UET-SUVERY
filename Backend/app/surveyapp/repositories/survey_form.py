from surveyapp import models
from sqlalchemy.exc import SQLAlchemyError
from .user import find_user_by_id


def get_list_survey(owner_id, offset, size, q, sort_name, sort_order, status, visible):
    list_all = models.db.session.query(
        models.SurveyForm
    ).filter(
        models.SurveyForm.name.ilike('%{}%'.format(q))
    ).filter(
        models.SurveyForm.is_visible.in_(visible)
    ).filter(
        models.SurveyForm.status.in_(status)
    )
    if owner_id:
        list_all = list_all.filter(
            models.SurveyForm.owner_id == owner_id
        )
    total = len(list_all.all())
    if sort_order == 'desc':
        results = list_all \
            .order_by(getattr(models.SurveyForm, sort_name).desc()) \
            .limit(size) \
            .offset((offset - 1) * size) \
            .all()
    else:
        results = list_all \
            .order_by(getattr(models.SurveyForm, sort_name).asc()) \
            .limit(size) \
            .offset((offset - 1) * size) \
            .all()
    return {
        'total': total,
        'data': [x.to_dict() for x in results]
    }


def find_survey_by_id(survey_id=None):
    if survey_id:
        survey = models.SurveyForm.query.filter(
            models.SurveyForm.id == survey_id
        ).first()
        return survey or None
    return None


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


def update_survey(survey_id, **kwargs):
    survey = find_survey_by_id(survey_id=survey_id)
    if not survey:
        return
    is_visible = kwargs.get('is_visible', None)
    respondents_id = kwargs.pop('respondents_id', None)
    if not is_visible and respondents_id:
        survey.respondents = []
        for re_id in respondents_id:
            respondents = find_user_by_id(user_id=re_id)
            if respondents:
                survey.respondents.append(respondents)
    survey.update_attr(**kwargs)
    models.db.session.commit()


def delete_survey(survey_id):
    survey = find_survey_by_id(survey_id=survey_id)
    if survey:
        models.db.session.delete(survey)
        models.db.session.commit()

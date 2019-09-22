from surveyapp import models
from sqlalchemy.exc import SQLAlchemyError


def get_list_survey(owner_id, offset, size, q, sort_name, sort_order, status):
    list_all = models.db.session.query(
        models.SurveyForm
    ).filter(
        models.SurveyForm.name.ilike('%{}%'.format(q))
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


def find_survey_by_id(survey_id):
    survey = models.SurveyForm.query.filter(
        models.SurveyForm.id == survey_id
    ).first()
    return survey or None


def add_survey(name='', config='', owner_id='', **kwargs):
    try:
        new_survey = models.SurveyForm(
            name=name,
            config=config,
            owner_id=owner_id,
            **kwargs
        )
        models.db.session.add(new_survey)
        models.db.session.commit()
        return new_survey
    except SQLAlchemyError:
        return None


def update_survey(survey_id='', **kwargs):
    survey = find_survey_by_id(survey_id=survey_id)
    if not survey:
        return
    survey.update_attr(**kwargs)
    models.db.session.commit()


def delete_survey(survey_id=''):
    survey = find_survey_by_id(survey_id=survey_id)
    if survey:
        models.db.session.delete(survey)
        models.db.session.commit()


def create_link(survey_id):
    survey = find_survey_by_id(survey_id=survey_id)
    if not survey:
        return None
    survey_link = models.SurveyLink(survey_form_id=survey_id)
    models.db.session.add(survey_link)
    models.db.session.commit()
    return survey_link.id


def find_survey_by_survey_link(survey_link):
    survey_link = models.SurveyLink.query.filter(
        models.SurveyForm.id == survey_link
    ).first()
    if survey_link:
        survey = survey_link.survey_form
        return survey.to_dict()
    return None

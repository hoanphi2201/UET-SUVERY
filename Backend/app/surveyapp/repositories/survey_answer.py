from surveyapp import models
from sqlalchemy.exc import SQLAlchemyError


def get_list_survey_answer(survey_form_id, offset, size, sort_order):
    list_all = models.db.session.query(
        models.SurveyAnswer
    ).filter(
        models.SurveyAnswer.survey_form_id == survey_form_id
    )
    total = len(list_all.all())
    if sort_order == 'desc':
        results = list_all \
            .order_by(models.SurveyAnswer.created_at.desc()) \
            .limit(size) \
            .offset((offset - 1) * size) \
            .all()
    else:
        results = list_all \
            .order_by(models.SurveyAnswer.created_at.asc()) \
            .limit(size) \
            .offset((offset - 1) * size) \
            .all()
    return {
        'total': total,
        'data': [x.to_dict_simple() for x in results]
    }


def get_all_survey_answer(survey_form_id):
    list_all = models.db.session.query(
        models.SurveyAnswer
    ).filter(
        models.SurveyAnswer.survey_form_id == survey_form_id
    )
    return {
        'total': len(list_all.all()),
        'data': [x.json for x in list_all.all()]
    }


def find_survey_answer_by_id(survey_answer_id=None):
    if survey_answer_id:
        survey_answer = models.SurveyAnswer.query.filter(
            models.SurveyAnswer.id == survey_answer_id
        ).first()
        return survey_answer or None
    return None


def add_survey_answer(json='', survey_form_id=None, user_id=None, **kwargs):
    if not survey_form_id:
        return None
    try:
        new_survey_answer = models.SurveyAnswer(
            json=json,
            user_id=user_id,
            survey_form_id=survey_form_id,
            **kwargs
        )
        models.db.session.add(new_survey_answer)
        models.db.session.commit()
        return new_survey_answer
    except SQLAlchemyError:
        return None


def delete_survey_answer(survey_answer_id):
    survey_answer = find_survey_answer_by_id(survey_answer_id=survey_answer_id)
    if survey_answer:
        models.db.session.delete(survey_answer)
        models.db.session.commit()

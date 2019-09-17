from surveyapp import extensions, repositories


def survey_add(name='', json='', owner_id=None, **kwargs):
    if not owner_id:
        raise extensions.exceptions.BadRequestException(
            message="Not found owned id"
        )
    new_survey = repositories.survey_form.add_survey(
        name=name,
        json=json,
        owner_id=owner_id,
        **kwargs
    )
    if not new_survey:
        raise extensions.exceptions.BadRequestException(
            message="Add survey failed"
        )
    return new_survey

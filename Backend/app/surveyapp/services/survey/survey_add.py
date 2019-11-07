import json
from surveyapp import extensions, repositories


def survey_add(name='', config='', owner_id=None, **kwargs):
    if not owner_id:
        raise extensions.exceptions.BadRequestException(
            message="Not found owned id"
        )
    try:
        config = json.loads(config)
    except ValueError:
        raise extensions.exceptions.BadRequestException(
            message="Json field is invalid"
        )
    new_survey = repositories.survey_form.add_survey(
        name=name,
        config=config,
        owner_id=owner_id,
        **kwargs
    )
    if not new_survey:
        raise extensions.exceptions.BadRequestException(
            message="Add survey failed"
        )
    return new_survey

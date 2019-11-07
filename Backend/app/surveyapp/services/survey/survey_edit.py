import json
from surveyapp import extensions, repositories
from surveyapp.models.survey_form import Status


def survey_edit(survey_id, **kwargs):
    field_can_edit = ['name', 'config', 'status']
    for k in kwargs.keys():
        if k not in field_can_edit:
            raise extensions.exceptions.BadRequestException(
                message=f"Not found field {k} in survey model"
            )
    name = kwargs.get('name')
    if name and not isinstance(name, str):
        raise extensions.exceptions.BadRequestException(
            message="Name must be string"
        )

    config = kwargs.get('config')
    if config:
        try:
            kwargs.update({'config': json.loads(config)})
        except ValueError:
            raise extensions.exceptions.BadRequestException(
                message="Json field is invalid"
            )
    status = kwargs.get('status')
    if status and status not in [e.value for e in Status]:
        raise extensions.exceptions.BadRequestException(
            message="Status not found"
        )
    repositories.survey_form.update_survey(survey_id, **kwargs)

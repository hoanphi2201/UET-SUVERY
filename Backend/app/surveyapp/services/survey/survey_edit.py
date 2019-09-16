from surveyapp import extensions, repositories


def survey_edit(survey_id, **kwargs):
    field_can_edit = ['name', 'json', 'status', 'is_visible', 'respondents_id']
    for k in kwargs.keys():
        if k not in field_can_edit:
            raise extensions.exceptions.BadRequestException(
                message=f"Not found field {k} in survey model"
            )
    repositories.survey_form.update_survey(survey_id, **kwargs)

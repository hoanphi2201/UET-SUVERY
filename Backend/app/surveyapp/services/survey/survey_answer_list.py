from surveyapp import repositories, extensions


def get_list_answer(survey_form_id, offset, size, sort_order):
    # validate number fields
    try:
        if survey_form_id:
            survey_form_id = int(survey_form_id)
        offset = int(offset)
        size = int(size)
    except ValueError:
        raise extensions.exceptions.BadRequestException(
            message="Invalid params integer field"
        )
    # validate other fields
    if sort_order not in ["desc", "asc"]:
        raise extensions.exceptions.BadRequestException(
            message="Invalid params 'sortOrder'"
        )
    return repositories.survey_answer.get_list_survey_answer(
        survey_form_id, offset, size, sort_order
    )

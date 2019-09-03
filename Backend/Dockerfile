FROM python:3.6

EXPOSE 8080
WORKDIR /code
ADD requirements.txt /code/

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

ADD . /code/

CMD ["python", "app.py"]



FROM python:3.11-slim-buster

WORKDIR /app

ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "wallet_project.wsgi:application"]
FROM python:3.11-slim-buster

WORKDIR /app

ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

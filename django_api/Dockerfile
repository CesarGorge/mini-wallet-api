FROM python:3.11-slim-bullseye

WORKDIR /app

ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
RUN apt-get update && apt-get install -y iputils-ping curl && pip install -r requirements.txt

COPY . .

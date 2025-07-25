FROM python:3.12
WORKDIR /database_service
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5430
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5430"]
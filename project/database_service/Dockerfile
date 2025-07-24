FROM python:3.12
WORKDIR /database_service
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5432
CMD sh -c "python3 main.py"
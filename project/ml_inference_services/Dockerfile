FROM python:3.12
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:${PATH}"
WORKDIR /ml_inference_services
COPY pyproject.toml poetry.lock .
RUN poetry config virtualenvs.create false \
 && poetry install --no-root --no-ansi
COPY . .
EXPOSE 8000
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
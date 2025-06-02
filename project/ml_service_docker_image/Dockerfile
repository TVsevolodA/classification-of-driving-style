FROM python:3.12
COPY pyproject.toml poetry.lock ./
RUN curl -sSL https://install.python-poetry.org | python3 -
RUN $HOME/.local/bin/poetry install --no-root
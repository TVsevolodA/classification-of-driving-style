FROM python:3
WORKDIR /ml_inference_services
COPY . .
RUN curl -sSL https://install.python-poetry.org | python3 -
RUN $HOME/.local/bin/poetry install
ENTRYPOINT ["tail", "-f", "/dev/null"]
FROM ml_service
WORKDIR /ml_inference_services
COPY . .
ENTRYPOINT ["tail", "-f", "/dev/null"]
# $HOME/.local/bin/poetry env activate
# $HOME/.local/bin/poetry run python main.py
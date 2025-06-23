FROM python:3.12

# Полезный материал про кэширование сборки docker контейнера с poetry:
# https://stackoverflow.com/questions/53835198/integrating-python-poetry-with-docker

# Устанавливаем системные зависимости
# RUN curl -sSL https://install.python-poetry.org | python3 -
# Задаем PATH переменную
# ENV PATH="/root/.local/bin:${PATH}"
WORKDIR /ml_inference_services
# Копируем файл со списком зависимостей. Для кэширования сборки.
# COPY pyproject.toml poetry.lock .
COPY requirements.txt .
# Выполняем установку без создания виртуального окружения,
# так как docker контейнер сам по себе изолирован.
# Флаг --no-root означает что папка не является конем проекта.
# Флаг --no-ansi - Отключает вывод ANSI. Делает журнал вывода менее награженным.
# RUN poetry config virtualenvs.create false \
#  && poetry install --no-root --no-ansi
RUN pip install -r requirements.txt
# Копируем все оставшиеся файлы
COPY . .
EXPOSE 8000
# CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
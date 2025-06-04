FROM python:3.12

# Полезный материал про кэширование сборки docker контейнера с poetry:
# https://stackoverflow.com/questions/53835198/integrating-python-poetry-with-docker

# Устанавливаем системные зависимости
RUN curl -sSL https://install.python-poetry.org | python3 -
# Задаем PATH переменную
ENV PATH="/root/.local/bin:${PATH}"
WORKDIR /gateway
# Копируем файл со списком зависимостей. Для кэширования сборки.
COPY pyproject.toml poetry.lock .
# Выполняем установку без создания виртуального окружения,
# так как docker контейнер сам по себе изолирован.
# Флаг --no-root означает что папка не является конем проекта.
# Флаг --no-ansi - Отключает вывод ANSI. Делает журнал вывода менее награженным.
RUN poetry config virtualenvs.create false \
 && poetry install --no-root --no-ansi
# Копируем все оставшиеся файлы
COPY . .
EXPOSE 7000
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7000"]
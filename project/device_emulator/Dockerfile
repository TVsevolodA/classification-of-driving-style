FROM python:3.12

# Полезный материал про кэширование сборки docker контейнера с poetry:
# https://stackoverflow.com/questions/53835198/integrating-python-poetry-with-docker

# Устанавливаем системные зависимости
RUN apt-get update && \
apt-get install nginx libnginx-mod-rtmp ffmpeg libsm6 libxext6  -y && \
curl -sSL https://install.python-poetry.org | python3 -
# Задаем PATH переменную
ENV PATH="/root/.local/bin:${PATH}"
WORKDIR /device_emulator
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
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 5010
ENTRYPOINT ["tail", "-f", "/dev/null"]
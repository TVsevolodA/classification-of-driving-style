import random
import datetime as dt
import re
import threading
import time
import websocket
import subprocess
import json

websocket._logging._logger.level = -99

def run_client(data: dict, stream_index: int):
    def get_speed(filename: str, timecode: int) -> int:
        """
        Получение скорости транспортного средства в конкретный момент времени
        :param filename:
        :param timecode: Время за записи
        :return: current_speed: Скорость в данный момент времени
        """
        with open(filename, 'r') as gps_data:
            time_since_start_stream = MIN_TIME + timecode
            for data in gps_data:
                if int(data.split(',')[0]) >= time_since_start_stream:
                    speed_cm_s = int(data.split(',')[5])
                    speed_km_h = round(speed_cm_s * 3600 / 1e5)  # 1e5 == 100_000
                    return speed_km_h
        return 0

    def get_timecode_with_stream() -> int:
        """
        Получение текущего времени воспроизведения видеопотока. Является основным способом получения времени.
        :return: past_time прошедшие секунды с начала видео
        """
        line = process.stderr.readline()
        if not line:
            return -1
        match = TIMECODE_PATTERN.search(line)
        if match:
            current_timecode = match.group(1)
            current_time_stream = time.strptime(current_timecode.split('.')[0], '%H:%M:%S')
            past_time = dt.timedelta(
                hours=current_time_stream.tm_hour,
                minutes=current_time_stream.tm_min,
                seconds=current_time_stream.tm_sec
            ).total_seconds()
            return int(past_time % 60)
        return -1

    def generate_route_data() -> dict:
        current_date = dt.datetime.now() # .strftime("%Y-%m-%d")
        routes = [
            {
                "place_departure": "Театральная площадь",
                "place_destination": "Парк Победы",
                "distance": random.uniform(3.2, 4.5),
                "duration": random.randint(7, 20),
            },
            {
                "place_departure": "Привокзальная площадь, 1",
                "place_destination": "Астраханская ул., 83",
                "distance": random.uniform(1, 2),
                "duration": random.randint(4, 20),
            },
            {
                "place_departure": "Набережная Космонавтов",
                "place_destination": "Театральная площадь",
                "distance": random.uniform(2.46, 3.5),
                "duration": random.randint(7, 20),
            },
            {
                "place_departure": "проспект имени Петра Столыпина",
                "place_destination": "Городской парк",
                "distance": random.uniform(3, 3.5),
                "duration": random.randint(9, 30),
            },
            {
                "place_departure": "Сенной рынок",
                "place_destination": "ГУК Саратовский областной музей краеведения",
                "distance": random.uniform(4.5, 6.1),
                "duration": random.randint(12, 50),
            },
        ]
        route_number = random.randint(0, len(routes)-1)
        data = {
            "driver_id": random.randint(2, 4),
            "car_id": random.randint(1, 2),
            "start_date": current_date,
            "end_date": current_date,
            "violations_per_trip": 0,
            "average_speed": random.randint(10, 25),
            "fuel_consumption": random.randint(8, 15),
        }
        data.update(routes[route_number])
        data["end_date"] += dt.timedelta(minutes=data.get("duration"))
        data["start_date"] = data["start_date"].strftime("%Y-%m-%d %H:%M:%S")
        data["end_date"] = data["end_date"].strftime("%Y-%m-%d %H:%M:%S")
        return data

    def on_message(wsapp, message):
        pass
        # print(f"Поток №{stream_index}:\nmessage")

    def on_error(wsapp, error):
        print(f"Поток №{stream_index}:\nВозникла ошибка в работе веб-сокета:\n{error}")

    def on_close(wsapp, close_status_code, close_msg):
        print(f"Поток №{stream_index}:\nСоединение закрыто.")

    def on_open(wsapp):
        print(f"Поток №{stream_index}:\nСоединение открыто.")

        trip_information = {
            "type": "identification",
            "trip": generate_route_data(),
        }
        wsapp.send(json.dumps(trip_information))

        start_time = dt.datetime.now()

        while True:
            time_stream = get_timecode_with_stream()
            if time_stream == -1:
                current_time = dt.datetime.now()
                diff_time = (current_time - start_time).total_seconds()
                if diff_time >= 60:
                    start_time = current_time
                current_speed = get_speed( filename=f"{data["name_data_file"]}.txt",  timecode=int(diff_time % 60) )
            else:
                current_speed = get_speed( filename=f"{data["name_data_file"]}.txt",  timecode=time_stream )

            messege = data["input_parametrs"]
            messege["veincle speed"] = current_speed
            data_send = {
                "input_parametrs": messege,
                "metadata": {
                    "speed": current_speed,
                    "stream": stream_index+1,
                }
            }
            if wsapp.sock and wsapp.sock.connected:
                wsapp.send(json.dumps(data_send))

    cmd = [
        'ffmpeg', '-re', '-stream_loop', '-1',
        '-i', f"{data["name_data_file"]}.MP4", # 'normal_test_drive.MP4'
        '-c:v', 'libx264', '-tune', 'zerolatency',
        '-preset', 'ultrafast', '-x264-params',
        'bframes=0', '-g', '30', '-keyint_min', '30',
        '-sc_threshold', '0', '-c:a', 'aac',
        '-s', '640x480',
        '-f', 'flv', data["url"] # 'rtmp://device_emulator:5000/hls/xxx'
    ]
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    TIMECODE_PATTERN = re.compile(r'time=(\d+:\d+:\d+)')

    with open(f"{data["name_data_file"]}.txt", 'r') as data_file: # 'normal_test_drive.txt'
        MIN_TIME = int(data_file.readline().split(',')[0])

    ws = websocket.WebSocketApp(url="ws://gateway:7000/tracking",
                                on_open=on_open,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.run_forever(reconnect=1)

stream_parameters = [
    {
        "url": "rtmp://device_emulator:5000/stream1/live",
        "name_data_file": "normal_test_drive",
        "input_parametrs": {
            "veincle length": 441,
            "veincle weight": 1380,
            "axles number": 2,
            "perceding veincle time-gap": 60,
            "Lane of the road": 1,
            "veincle speed": 35,
            "perceding veincle speed": 30,
            "perceding veincle weight": 2021,
            "perceding veincle length": 500,
            "road condition": 0,
            "Air temprture": 25,
            "perciption type": 0,
            "perciption intensity": -1,
            "relatve humadity": 60,
            "wind direction": 50,
            "wind speed": 8,
            "Lighting condition": 0
        }
    },
    {
        "url": "rtmp://device_emulator:5000/stream2/live",
        "name_data_file": "vague_test_drive",
        "input_parametrs": {
            "veincle speed":51,
            "perceding veincle speed":52,
            "axles number":2,
            "veincle length":440,
            "perceding veincle length":421,
            "veincle weight":1380,
            "perceding veincle weight":1010,
            "Air temprture":20,
            "perception type":1,
            "perception intensity":0,
            "relatve humadity":60,
            "wind direction":225,
            "wind speed":10,
            "Lane of the road":1,
            "preceding vehicle time-gap":5,
            "road_condition":2,
            "Lighting condition":2
        }
    }
]

for index, stream in enumerate(stream_parameters):
    t = threading.Thread(target=run_client, args=(stream, index))
    t.start()
    time.sleep(0.1)
import datetime as dt
import re
import threading
import time
from websocket import WebSocketApp
import subprocess
import json

def run_client(data: dict, stream_index: int):
    def get_speed(timecode: int) -> int:
        """
        Получение скорости транспортного средства в конкретный момент времени
        :param timecode: Время за записи
        :return: current_speed: Скорость в данный момент времени
        """
        with open('normal_test_drive.txt', 'r') as gps_data:
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

    def on_message(wsapp, message):
        pass
        # print(f"Поток №{stream_index}:\nmessage")

    def on_error(wsapp, error):
        print(f"Поток №{stream_index}:\nВозникла ошибка в работе веб-сокета:\n{error}")

    def on_close(wsapp, close_status_code, close_msg):
        print(f"Поток №{stream_index}:\nСоединение закрыто.")

    def on_open(wsapp):
        print(f"Поток №{stream_index}:\nСоединение открыто.")
        start_time = dt.datetime.now()

        while True:
            time_stream = get_timecode_with_stream()
            if time_stream == -1:
                current_time = dt.datetime.now()
                diff_time = (current_time - start_time).total_seconds()
                if diff_time >= 60:
                    start_time = current_time
                current_speed = get_speed( timecode=int(diff_time % 60) )
            else:
                current_speed = get_speed(timecode=time_stream)

            messege = data["input_parametrs"]
            messege["veincle speed"] = current_speed
            # messege = [
            #     '{"veincle length": 441,',
            #     ' "veincle weight": 1380,',
            #     ' "axles number": 2,',
            #     ' "perceding veincle time-gap": 60,',
            #     ' "Lane of the road": 1,',
            #     f' "veincle speed": {current_speed},',
            #     ' "perceding veincle speed": 30,',
            #     ' "perceding veincle weight": 2021,',
            #     ' "perceding veincle length": 500,',
            #     ' "road condition": 0,',
            #     ' "Air temprture": 25,',
            #     ' "perciption type": 0,',
            #     ' "perciption intensity": -1,',
            #     ' "relatve humadity": 60,',
            #     ' "wind direction": 50,',
            #     ' "wind speed": 8,',
            #     ' "Lighting condition": 0}',
            # ]
            # wsapp.send(''.join(messege))
            wsapp.send(json.dumps(messege))

    cmd = [
        'ffmpeg', '-re', '-stream_loop', '-1',
        '-i', f"{data["name_data_file"]}.MP4", # 'normal_test_drive.MP4'
        '-c:v', 'libx264', '-tune', 'zerolatency',
        '-preset', 'ultrafast', '-x264-params',
        'bframes=0', '-g', '30', '-keyint_min', '30',
        '-sc_threshold', '0', '-c:a', 'aac',
        '-s', '1280x720',
        '-f', 'flv', data["url"] # 'rtmp://device_emulator:5000/hls/xxx'
    ]
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    TIMECODE_PATTERN = re.compile(r'time=(\d+:\d+:\d+)')

    with open(f"{data["name_data_file"]}.txt", 'r') as data_file: # 'normal_test_drive.txt'
        MIN_TIME = int(data_file.readline().split(',')[0])

    ws = WebSocketApp(url="ws://gateway:7000/tracking",
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
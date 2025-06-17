import datetime as dt
from time import sleep

from websocket import create_connection, WebSocket
import subprocess

# 1. Запустить трансляцию
cmd = [
    'ffmpeg', '-re', '-stream_loop', '-1',
    '-i', 'normal_test_drive.MP4',
    '-c:v', 'libx264', '-tune', 'zerolatency',
    '-preset', 'ultrafast', '-x264-params',
    'bframes=0', '-g', '30', '-keyint_min', '30',
    '-sc_threshold', '0', '-c:a', 'aac',
    '-s', '1280x720',
    '-f', 'flv', 'rtmp://device_emulator:5000/hls/xxx'
]
# process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
subprocess.Popen(cmd)

# 2. Установить соединение с gateway
ws: WebSocket = create_connection("ws://gateway:7000/tracking")


# 3. Засечь время запуска
start_time = dt.datetime.now()

with open('normal_test_drive.txt', 'r') as data_file:
    MIN_TIME = int(data_file.readline().split(',')[0])

def get_speed(timecode: int) -> int:
    """
    Получение скорости транспортного средства в конкретный момент времени
    :param timecode: Время за записи
    :return: current_speed: Скорость в данный момент времени
    """
    with open('normal_test_drive.txt', 'r') as gps_data:
        CURRENT_TIME = MIN_TIME + timecode
        for data in gps_data:
            if int( data.split(',')[0] ) >= CURRENT_TIME:
                speed_cm_s = int( data.split(',')[5] )
                speed_km_h = round( speed_cm_s * 3600 / 1e5 )  # 1e5 == 100_000
                return speed_km_h
        return 0

while True:
    current_time = dt.datetime.now()
    diff_time = (current_time - start_time).total_seconds()
    if diff_time >= 60:
        start_time = current_time
    current_speed = get_speed( timecode=int(diff_time % 60) )

    messege = [
        '{"veincle length": 441,',
        ' "veincle weight": 1380,',
        ' "axles number": 2,',
        ' "perceding veincle time-gap": 60,',
        ' "Lane of the road": 1,',
        f' "veincle speed": {current_speed},',
        ' "perceding veincle speed": 30,',
        ' "perceding veincle weight": 2021,',
        ' "perceding veincle length": 500,',
        ' "road condition": 0,',
        ' "Air temprture": 25,',
        ' "perciption type": 0,',
        ' "perciption intensity": -1,',
        ' "relatve humadity": 60,',
        ' "wind direction": 50,',
        ' "wind speed": 8,',
        ' "Lighting condition": 0}',
    ]
    ws.send(''.join(messege))
    result = ws.recv()
    print(f"Сервер вернул, что на скорости {current_speed} \n{result}")
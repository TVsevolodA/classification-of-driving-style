from collections import deque
from datetime import datetime

class DrivingStyleAnalyzer:
    def __init__(self, accel_threshold=10.0, brake_threshold=-10.0, max_samples=60):
        """
        accel_threshold: порог резкого ускорения (м/c²)
        brake_threshold: порог резкого торможения (м/c², отрицательное значение)
        max_samples: количество сохраняемых последних точек данных
        """
        self.data = deque(maxlen=max_samples)
        self.accel_threshold = accel_threshold
        self.brake_threshold = brake_threshold
        self.datetime_event: datetime = None
        self.type_event: str = None

    def add_speed(self, timestamp: int, speed: int):
        """
        Добавить новое измерение скорости.
        timestamp - время в секундах (можно использовать datetime.timestamp())
        speed - скорость в м/c
        """
        self.data.append((timestamp, speed))
        if len(self.data) < 2:
            return

        t1, v1 = self.data[-2]
        t2, v2 = self.data[-1]
        dt = t2 - t1
        if dt == 0:
            return

        acceleration = (v2 - v1) / dt

        # Проверяем на резкое ускорение или торможение
        if acceleration >= self.accel_threshold:
            self.record_event(timestamp, acceleration, "резкое ускорение")
        elif acceleration <= self.brake_threshold:
            self.record_event(timestamp, acceleration, "резкое торможение")

    def record_event(self, timestamp: int, acceleration: float, event_type: str):
        self.datetime_event = datetime.fromtimestamp(timestamp)
        self.type_event = event_type
        # event = {
        #     "time": datetime.fromtimestamp(timestamp),
        #     "acceleration": acceleration,
        #     "type": event_type
        # }
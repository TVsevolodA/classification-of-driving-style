from websocket import create_connection, WebSocket

ws: WebSocket = create_connection("ws://gateway:7000/tracking")
ws.send('{"veincle length": 450, "veincle weight": 2500, "axles number": 2, "perceding veincle time-gap": 0.5, "Lane of the road": 2, "veincle speed": 200, "perceding veincle speed": 150, "perceding veincle weight": 1400, "perceding veincle length": 440, "road condition": 2, "Air temprture": -5, "perciption type": 2, "perciption intensity": 2, "relatve humadity": 40, "wind direction": 90, "wind speed": 25, "Lighting condition": 2}')
result =  ws.recv()
print(f"Сервер вернул\n{result}")
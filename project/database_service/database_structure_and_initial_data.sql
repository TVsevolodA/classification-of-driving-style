CREATE TABLE users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT NOT NULL UNIQUE,
full_name TEXT NULL DEFAULT '',
hashed_password TEXT NOT NULL,
role TEXT NOT NULL DEFAULT 'user' CHECK( role IN ('user', 'admin') ),
phone TEXT NULL DEFAULT '',
address TEXT NULL DEFAULT ''
);

CREATE TABLE cars (
id INTEGER PRIMARY KEY AUTOINCREMENT,
vin TEXT NOT NULL UNIQUE,
owner_id INTEGER NOT NULL,
brand TEXT NOT NULL,
model TEXT NOT NULL,
year INTEGER NOT NULL CHECK( year > 1949),
license_plate TEXT NULL DEFAULT '',    -- Гос. номер
insurance_expiry_date TEXT NULL, -- Дата окончания срока действия страховки
date_technical_inspection TEXT NOT NULL,    -- Дата последнего ТО
mileage INTEGER NOT NULL CHECK(mileage >= 0),
FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE drivers (
id INTEGER PRIMARY KEY AUTOINCREMENT,
director_id INTEGER NOT NULL,
license_number TEXT NOT NULL UNIQUE,    -- Серия и номер ВУ
expiration_driver_license TEXT NULL,  -- Дата окончания срока действия ВУ
full_name TEXT NOT NULL,
phone TEXT NOT NULL,
email TEXT NULL UNIQUE,
driving_experience INTEGER NOT NULL CHECK(driving_experience >= 0), -- Стаж вождения
issue_date TEXT NOT NULL CHECK(issue_date < expiration_driver_license),  -- Дата выдачи ВУ
driving_rating REAL NOT NULL DEFAULT 5, -- Рейтинг безопасности
number_violations INTEGER NOT NULL DEFAULT 0,    -- Количество нарушений
FOREIGN KEY (director_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE driver_car (
id INTEGER PRIMARY KEY AUTOINCREMENT,
driver_id INTEGER NOT NULL,
car_id INTEGER NOT NULL,
start_date TEXT NOT NULL CHECK(start_date <= end_date),
end_date TEXT NOT NULL,
place_departure TEXT NOT NULL,  -- Место отправления
place_destination TEXT NOT NULL,    -- Место назначения
distance REAL NOT NULL CHECK(distance > 0), -- Пройденное растояние
duration INTEGER NOT NULL CHECK(duration > 0),  -- Время поездки (мин)
fuel_consumption REAL NOT NULL CHECK(fuel_consumption > 0), -- Расход топлива
violations_per_trip INTEGER NOT NULL DEFAULT 0 CHECK(violations_per_trip >= 0), -- Нарушения за поездку
average_speed INTEGER NOT NULL CHECK(average_speed > 0),
FOREIGN KEY (driver_id) REFERENCES drivers (id) ON DELETE CASCADE,
FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE
);

-- Добавляем пользователей сервиса
INSERT INTO users ( username, full_name, hashed_password, role, phone, address ) VALUES
(
    'johndoe@example.com', 'Джон Доу',
    '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
    'admin', '+7 (999) 123-45-67', 'Москва, Россия'
),
(
    'triv@example.com', 'Володин Владимир',
    '$2b$12$KelOH415tiAnYwK2nfW6QePR/li73iWeP1FqDarf6ptzZtlMIoR1G',
    'user', '+7 (888) 987-65-43', 'Саратов, Россия'
),
(
    'ivanov@example.ru', 'Иванов Иван',
    '$2b$12$S/FiTOu6Juk3MV..BTr4Q.BbH4i8VXSXd.WIIJ/z9lGU6KFBESQbm',
    'user', '+7 (912) 345-67-89', 'Воронеж, Россия'
);

-- Добавляем ТС владельцев сервиса
INSERT INTO cars ( vin, owner_id, brand, model, year, license_plate,
insurance_expiry_date, date_technical_inspection, mileage ) VALUES
(
    '1HGCM82633A004352', 2, 'Hyundai', 'IX35', 2012,
    'T824MC|64RUS', '2025-06-30', '2025-06-05', 155000
),
(
    'WDDHF5KB6EA123456', 2, 'Lada', 'Granta', 2018,
'T206TC|64RUS', '2024-12-15', '2025-07-05', 100000
),
(
    'KL1AF6362AK000789', 3, 'Toyota', 'Camry', 2020,
    'А123ВC|777RUS', '2025-01-10', '2025-06-21', 45000
),
(
    '2T1BR18E5WC789012', 3, 'BMW', 'X5', 2019,
    'B456EK|123RUS', '2024-11-01', '2025-08-01', 62000
),
(
    '3VWDS71K08M345678', 3, 'Mercedes-Benz', 'C-class', 2021,
    'M789MO|164RUS', '2024-09-20', '2025-06-28', 28000
);

-- Добавляем водителей сервиса
INSERT INTO drivers
(
    director_id, license_number, expiration_driver_license,
    full_name, phone, email, driving_experience,
    issue_date, driving_rating, number_violations
) VALUES
(
    3, '1234 567890',  '2027-12-31',
    'Иванов Иван Иванович', '+7 (912) 345-67-89',
    'ivanov@example.ru', 5, '2018-11-15', 4.5, 1
),
(
    2, '2345 678901',  '2026-09-05',
    'Петров Петр Петрович', '+7 (923) 456-78-90',
    'petrov@example.ru', 7, '2016-04-22', 3.7, 5
),
(
    2, '3456 789012',  '2028-03-18',
    'Сидорова Елена Сергеевна', '+7 (934) 567-89-01',
    'sidorova@example.ru', 3, '2020-07-03', 4.8, 1
),
(
    2, '4567 890123',  '2027-11-28',
    'Кузнецов Артем Викторович', '+7 (945) 678-90-12',
    'kuznetsov@example.ru', 10, '2013-03-10', 4.2, 2
),
(
    3, '5678 901234',  '2026-07-14',
    'Смирнова Анастасия Дмитриевна', '+7 (967) 890-12-34',
    'smirnova@example.ru', 2, '2021-09-05', 3.9, 6
),
(
    3, '6789 012345',  '2029-05-22',
    'Федоров Максим Александрович', '+7 (978) 901-23-45',
    'fedorov@example.ru', 8, '2015-12-30', 4.0, 2
),
(
    3, '7890 123456',  '2026-02-10',
    'Морозова Ольга Игоревна', '+7 (989) 012-34-56',
    'morozova@example.ru', 6, '2017-08-17', 4.6, 1
),
(
    3, '8901 234567',  '2028-08-07',
    'Белов Денис Олегович', '+7 (990) 123-45-67',
    'belov@example.ru', 1, '2022-04-01', 3.0, 10
),
(
    3, '9012 345678',  '2025-10-19',
    'Григорьева Валентина Сергеевна', '+7 (901) 234-56-78',
    'grigorieva@example.ru', 12, '2011-05-25', 4.9, 0
),
(
    3, '0123 456789',  '2027-04-03',
    'Козлов Владимир Анатольевич', '+7 (918) 345-67-89',
    'kozlov@example.ru', 9, '2014-10-08', 3.5, 4
);

-- Добавляем поездки сервиса
INSERT INTO driver_car ( driver_id, car_id, start_date, end_date,
place_departure, place_destination, distance, duration,
fuel_consumption, violations_per_trip, average_speed ) VALUES
(
    1, 5, '2025-07-14 12:00:00', '2025-07-14 12:45:00', 'г. Энгельс, проспект Строителей',
    'г. Саратов, ул. Политехническая, 77', 17.5, 45, 10.5, 1, 27
),
(
    2, 1, '2025-07-15 10:19:00', '2025-07-15 10:58:00', 'г. Москва, Тверская ул.',
     'г. Химки, Шереметьево', 33.5, 39, 10.9, 2, 40
),
(
    4, 2, '2025-01-10 07:30:00', '2025-01-11 08:01:00', 'г. Москва, Арбат ул.',
    'г. Москва, ул. Сокольнический Вал', 11.3, 31, 8.6, 0, 36
),
(
    4, 1, '2025-01-11 17:15:00', '2025-01-12 17:42:00', 'г. Москва, ул. Косыгина',
    'г. Москва, площадь Красная, дом 1', 11.5, 27, 12.1, 1, 27
),
(
    7, 5, '2025-06-20 20:05:00', '2025-06-20 21:00:00', 'г. Саратов, Аэропорт гагарин',
    'г. Саратов, ул. имени Е.И. Пугачёва, 179А', 44, 55, 9, 0, 50
),
(
    3, 1, '2024-12-30 11:42:00', '2024-12-31 12:14:00', 'г. Энгельс, ул. Тельмана, 18',
    'г. Саратов, ул. имени Н.Г. Чернышевского, 61', 13.7, 32, 11.3, 1, 37
),
(
    10, 4, '2025-05-01 13:11:00', '2025-05-04 13:39:00', 'г. Саратов, площадь имени Г.К. Орджоникидзе, 1',
    'г. Саратов, ул. Лесная, 10', 11.6, 28, 12, 0, 28
);
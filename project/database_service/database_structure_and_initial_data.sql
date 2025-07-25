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
mileage INTEGER NOT NULL CHECK(mileage >= 0),
FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE drivers (
id INTEGER PRIMARY KEY AUTOINCREMENT,
director_id INTEGER NOT NULL,
license_number TEXT NOT NULL UNIQUE,    -- Серия и номер ВУ
expiration_driver_license TEXT NULL,  -- Дата окончания срока действия ВУ
insurance_expiry_date TEXT NULL, -- Дата окончания срока действия страховки
full_name TEXT NOT NULL,
phone TEXT NOT NULL,
email TEXT NULL,
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
INSERT INTO cars ( vin, owner_id, brand, model, year, license_plate, mileage ) VALUES
( '1HGCM82633A004352', 2, 'Hyundai', 'IX35', 2012, 'T824MC|64RUS', 155000 ),
( 'WDDHF5KB6EA123456', 2, 'Lada', 'Granta', 2018, 'T206TC|64RUS', 100000 ),
( 'KL1AF6362AK000789', 3, 'Toyota', 'Camry', 2020, 'А123ВC|777RUS', 45000 ),
( '2T1BR18E5WC789012', 3, 'BMW', 'X5', 2019, 'B456EK|123RUS', 62000 ),
( '3VWDS71K08M345678', 3, 'Mercedes-Benz', 'C-class', 2021, 'M789MO|164RUS', 28000 );

-- Добавляем водителей сервиса
INSERT INTO drivers
(
    director_id, license_number, expiration_driver_license,
    insurance_expiry_date, full_name, phone, email, driving_experience,
    issue_date, driving_rating, number_violations
) VALUES
(
    3, '1234 567890',  '2027-12-31',
    '2025-06-30', 'Иванов Иван Иванович', '+7 (912) 345-67-89',
    'ivanov@example.ru', 5, '2018-11-15', 4.5, 1
),
(
    2, '2345 678901',  '2026-09-05',
    '2024-12-15', 'Петров Петр Петрович', '+7 (923) 456-78-90',
    'petrov@example.ru', 7, '2016-04-22', 3.7, 5
),
(
    2, '3456 789012',  '2028-03-18',
    '2025-01-10', 'Сидорова Елена Сергеевна', '+7 (934) 567-89-01',
    'sidorova@example.ru', 3, '2020-07-03', 4.8, 1
),
(
    2, '4567 890123',  '2027-11-28',
    '2024-11-01', 'Кузнецов Артем Викторович', '+7 (945) 678-90-12',
    'kuznetsov@example.ru', 10, '2013-03-10', 4.2, 2
),
(
    3, '5678 901234',  '2026-07-14',
    '2024-09-20', 'Смирнова Анастасия Дмитриевна', '+7 (967) 890-12-34',
    'smirnova@example.ru', 2, '2021-09-05', 3.9, 6
),
(
    3, '6789 012345',  '2029-05-22',
    '2025-04-15', 'Федоров Максим Александрович', '+7 (978) 901-23-45',
    'fedorov@example.ru', 8, '2015-12-30', 4.0, 2
),
(
    3, '7890 123456',  '2026-02-10',
    '2024-08-05', 'Морозова Ольга Игоревна', '+7 (989) 012-34-56',
    'morozova@example.ru', 6, '2017-08-17', 4.6, 1
),
(
    3, '8901 234567',  '2028-08-07',
    '2024-12-31', 'Белов Денис Олегович', '+7 (990) 123-45-67',
    'belov@example.ru', 1, '2022-04-01', 3.0, 10
),
(
    3, '9012 345678',  '2025-10-19',
    '2025-03-01', 'Григорьева Валентина Сергеевна', '+7 (901) 234-56-78',
    'grigorieva@example.ru', 12, '2011-05-25', 4.9, 0
),
(
    3, '0123 456789',  '2027-04-03',
    '2024-10-15', 'Козлов Владимир Анатольевич', '+7 (918) 345-67-89',
    'kozlov@example.ru', 9, '2014-10-08', 3.5, 4
);

-- Добавляем поездки сервиса
INSERT INTO driver_car ( driver_id, car_id, start_date, end_date ) VALUES
(1, 1, '2025-07-14', '2025-07-14'),
(2, 2, '2025-07-15', '2025-07-15'),
(1, 2, '2025-01-10', '2025-01-11'),
(2, 5, '2025-06-20', '2025-06-20'),
(10, 5, '2024-12-30', '2024-12-31'),
(10, 5, '2025-05-01', '2025-05-04');
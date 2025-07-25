import sqlite3

def create_database():
    with sqlite3.connect('classification_driving_style.db') as connection:
        cursor = connection.cursor()
        with open("database_structure_and_initial_data.sql", "r") as sqlite_file:
            sql_script = sqlite_file.read()
            cursor.executescript(sql_script)
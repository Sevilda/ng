--
-- File generated with SQLiteStudio v3.3.3 on Szo jún. 11 10:43:20 2022
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: user
CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, username text, login date, logout date);
INSERT INTO user (id, username, login, logout) VALUES (1, 'test', '2010-01-01 00:00:01', '2010-01-01 00:01:00');

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;

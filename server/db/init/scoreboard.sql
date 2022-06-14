--
-- File generated with SQLiteStudio v3.3.3 on K jún. 14 15:50:48 2022
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: scoreboard
CREATE TABLE scoreboard (username TEXT, score INTEGER, id INTEGER PRIMARY KEY AUTOINCREMENT, date DATETIME);
INSERT INTO scoreboard (username, score, id, date) VALUES ('test_win', 9, 1, '2022-06-14 09:38:03');
INSERT INTO scoreboard (username, score, id, date) VALUES ('test_lose', 5, 2, '2022-06-14 09:38:03');
INSERT INTO scoreboard (username, score, id, date) VALUES ('admin', 9, 15, '2022-06-14 10:19:51');
INSERT INTO scoreboard (username, score, id, date) VALUES ('test2', 5, 27, '2022-06-14 10:35:41');
INSERT INTO scoreboard (username, score, id, date) VALUES ('test2', 5, 28, '2022-06-14 11:02:12');
INSERT INTO scoreboard (username, score, id, date) VALUES ('Test', 9, 29, '2022-06-14 11:02:12');
INSERT INTO scoreboard (username, score, id, date) VALUES ('Test', 4, 30, '2022-06-14 11:05:59');
INSERT INTO scoreboard (username, score, id, date) VALUES ('admin', 10, 31, '2022-06-14 11:05:59');
INSERT INTO scoreboard (username, score, id, date) VALUES ('test1', 5, 32, '2022-06-14 11:23:54');
INSERT INTO scoreboard (username, score, id, date) VALUES ('test2', 9, 33, '2022-06-14 11:23:54');
INSERT INTO scoreboard (username, score, id, date) VALUES ('test2', 5, 34, '2022-06-14 13:43:07');
INSERT INTO scoreboard (username, score, id, date) VALUES ('test1', 9, 35, '2022-06-14 13:43:07');
INSERT INTO scoreboard (username, score, id, date) VALUES ('test1', 8, 36, '2022-06-14 13:43:46');
INSERT INTO scoreboard (username, score, id, date) VALUES ('test2', 6, 37, '2022-06-14 13:43:46');
INSERT INTO scoreboard (username, score, id, date) VALUES ('test2', 6, 38, '2022-06-14 13:43:46');
INSERT INTO scoreboard (username, score, id, date) VALUES ('test1', 8, 39, '2022-06-14 13:43:46');

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;

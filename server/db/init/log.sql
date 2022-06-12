--
-- File generated with SQLiteStudio v3.3.3 on Szo jún. 11 10:42:11 2022
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: log
CREATE TABLE log (id INTEGER PRIMARY KEY AUTOINCREMENT, date DATETIME, log_type CHAR);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;

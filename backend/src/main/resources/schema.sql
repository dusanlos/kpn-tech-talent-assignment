-- Customers table (same as before)
CREATE TABLE IF NOT EXISTS customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    address TEXT,
    phone_number TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL
);
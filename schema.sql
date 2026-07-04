CREATE TABLE IF NOT EXISTS week_progress (
  user_email TEXT NOT NULL,
  week INTEGER NOT NULL,
  completed_at TEXT NOT NULL,
  PRIMARY KEY (user_email, week)
);

CREATE TABLE IF NOT EXISTS attendance (
  user_email TEXT NOT NULL,
  session_date TEXT NOT NULL,
  checked_in_at TEXT NOT NULL,
  PRIMARY KEY (user_email, session_date)
);

-- Insert 16 users with easy passwords
INSERT INTO users (email, password, name) VALUES
  ('alice@gmail.com',   'alice', 'Alice'),
  ('bob@gmail.com',     'bob', 'Bob'),
  ('charlie@gmail.com', 'charlie', 'Charlie'),
  ('diana@gmail.com',   'diana', 'Diana'),
  ('edward@gmail.com',  'edward', 'Edward'),
  ('fiona@gmail.com',   'fiona', 'Fiona'),
  ('george@gmail.com',  'george', 'George'),
  ('hannah@gmail.com',  'hannah', 'Hannah'),
  ('ian@gmail.com',     'ian', 'Ian'),
  ('julia@gmail.com',   'julia', 'Julia'),
  ('kevin@gmail.com',   'kevin', 'Kevin'),
  ('laura@gmail.com',   'laura', 'Laura'),
  ('michael@gmail.com', 'michael', 'Michael'),
  ('nancy@gmail.com',   'nancy', 'Nancy'),
  ('oscar@gmail.com',   'oscar', 'Oscar'),
  ('peter@gmail.com',   'peter', 'Peter');

-- Insert 16 books, one per subject, linked to those users
INSERT INTO books (title, author, subject, description, contact_email, owner_id, status) VALUES
  -- Medicine (owner_id = 1)
  ('Essentials of Human Anatomy', 'Gray''s Anatomy', 'Medicine',
   'A comprehensive guide to human anatomy.',
   'alice@gmail.com', 1, 'AVAILABLE'),

  -- Law (owner_id = 2)
  ('Constitutional Law Basics', 'Erwin Chemerinsky', 'Law',
   'Intro to constitutional law principles.',
   'bob@gmail.com', 2, 'AVAILABLE'),

  -- Fiction (owner_id = 3)
  ('The Great Adventure', 'Charlie Brown', 'Fiction',
   'A heartwarming tale of friendship.',
   'charlie@gmail.com', 3, 'BORROWED'),

  -- Non-Fiction (owner_id = 4)
  ('The Science of Well-Being', 'Diana Prince', 'Non-Fiction',
   'Psychological insights into happiness.',
   'diana@gmail.com', 4, 'AVAILABLE'),

  -- Science (owner_id = 5)
  ('Quantum Mechanics Simplified', 'Edward Norton', 'Science',
   'A beginner''s guide to quantum physics.',
   'edward@gmail.com', 5, 'AVAILABLE'),

  -- Technology (owner_id = 6)
  ('Future Tech Trends', 'Fiona Gallagher', 'Technology',
   'Overview of emerging technologies.',
   'fiona@gmail.com', 6, 'BORROWED'),

  -- Engineering (owner_id = 7)
  ('Structural Engineering 101', 'George Orwell', 'Engineering',
   'Key principles of structural design.',
   'george@gmail.com', 7, 'AVAILABLE'),

  -- Mathematics (owner_id = 8)
  ('Linear Algebra in Action', 'Hannah Lee', 'Mathematics',
   'Applications of linear algebra.',
   'hannah@gmail.com', 8, 'AVAILABLE'),

  -- History (owner_id = 9)
  ('A People''s History of the World', 'Ian McKellen', 'History',
   'Inclusive global history overview.',
   'ian@gmail.com', 9, 'BORROWED'),

  -- Philosophy (owner_id = 10)
  ('Meditations on First Philosophy', 'René Descartes', 'Philosophy',
   'Foundational Western philosophy text.',
   'julia@gmail.com', 10, 'AVAILABLE'),

  -- Literature (owner_id = 11)
  ('Modern Literary Criticism', 'Kevin Hart', 'Literature',
   'Contemporary literary theories.',
   'kevin@gmail.com', 11, 'AVAILABLE'),

  -- Arts (owner_id = 12)
  ('The Story of Art', 'E. H. Gombrich', 'Arts',
   'Illustrated art history guide.',
   'laura@gmail.com', 12, 'BORROWED'),

  -- Business (owner_id = 13)
  ('Principles of Management', 'Michael Scott', 'Business',
   'Core concepts in management.',
   'michael@gmail.com', 13, 'AVAILABLE'),

  -- Economics (owner_id = 14)
  ('Introduction to Economics', 'Nancy Drew', 'Economics',
   'Economic theories in plain language.',
   'nancy@gmail.com', 14, 'BORROWED'),

  -- Social Sciences (owner_id = 15)
  ('Understanding Society', 'Oscar Wilde', 'Social Sciences',
   'Exploration of human behavior.',
   'oscar@gmail.com', 15, 'AVAILABLE'),

  -- Computer Science (owner_id = 16)
  ('Data Structures & Algorithms', 'Peter Parker', 'Computer Science',
   'DS&A with code examples.',
   'peter@gmail.com', 16, 'AVAILABLE');
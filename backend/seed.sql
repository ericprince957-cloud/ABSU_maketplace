-- ABSU Marketplace — seed data (verified sellers)
-- Run AFTER schema.sql.

INSERT INTO profiles (id, name, email, phone, department, role, status, category, created_at) VALUES
  ('u_001', 'Chinedu Okafor',               'chinedu@student.absu.edu.ng', '2348012345678', 'Computer Science',   'student', 'verified', NULL,              '2024-09-01T08:00:00Z'),
  ('u_002', 'Amara Eze',                    'amara@student.absu.edu.ng',  '2348023456789', 'Mass Communication', 'student', 'verified', NULL,              '2024-09-02T09:00:00Z'),
  ('u_003', 'Vector Codes',                 'vectorcodes@gmail.com',      '2347084547988', 'Computer Science',   'seller',  'verified', 'Web Development', '2024-08-15T10:00:00Z'),
  ('u_004', 'Egbeike Precious Chukwuebuka', 'egbeikeprecious@gmail.com',  '2349047587912', 'Engineering',        'seller',  'verified', 'Fashion',         '2024-08-16T11:00:00Z'),
  ('u_005', 'Uchechukwu Divine Chidiamara', 'uchechukwudvine@gmail.com',  '2347013519900', 'Pharmacy',           'seller',  'verified', 'Beauty',          '2024-08-17T12:00:00Z'),
  ('u_006', 'Udo Favour Chinoyeremu',       'udofavour@gmail.com',        '2347064580909', 'Public Health',      'seller',  'verified', 'Fashion',         '2024-08-18T13:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Products and orders start EMPTY: sellers add products via their dashboard.


-- Insert 15 dummy donors with realistic data
INSERT INTO public.donors (name, phone, blood_type, address, registered_at, last_donation_date, never_donated) VALUES
('Ahmed Hassan', '01711-123456', 'A+', 'Dhanmondi, Dhaka', '2024-01-15 10:30:00+06', '2024-06-01 09:00:00+06', false),
('Fatima Rahman', '01812-234567', 'B+', 'Gulshan, Dhaka', '2024-02-20 14:15:00+06', NULL, true),
('Mohammad Ali', '01913-345678', 'O+', 'Uttara, Dhaka', '2024-03-10 09:45:00+06', '2024-05-15 11:30:00+06', false),
('Rashida Begum', '01714-456789', 'AB+', 'Mirpur, Dhaka', '2024-03-25 16:20:00+06', '2024-07-10 10:15:00+06', false),
('Karim Uddin', '01815-567890', 'A-', 'Wari, Dhaka', '2024-04-05 11:30:00+06', NULL, true),
('Nasreen Akter', '01916-678901', 'B-', 'Lalmatia, Dhaka', '2024-04-18 13:45:00+06', '2024-06-20 08:45:00+06', false),
('Rafique Ahmed', '01717-789012', 'O-', 'Banani, Dhaka', '2024-05-02 08:15:00+06', '2024-08-01 14:20:00+06', false),
('Salma Khatun', '01818-890123', 'AB-', 'Panthapath, Dhaka', '2024-05-15 15:30:00+06', NULL, true),
('Ibrahim Hossain', '01919-901234', 'A+', 'Shantinagar, Dhaka', '2024-05-28 12:00:00+06', '2024-07-25 16:30:00+06', false),
('Rozina Begum', '01720-012345', 'B+', 'Tejgaon, Dhaka', '2024-06-03 10:45:00+06', NULL, true),
('Hafizur Rahman', '01821-123456', 'O+', 'Ramna, Dhaka', '2024-06-08 14:30:00+06', '2024-08-15 09:20:00+06', false),
('Sharmin Akter', '01922-234567', 'AB+', 'Motijheel, Dhaka', '2024-06-12 09:20:00+06', '2024-07-30 11:45:00+06', false),
('Jahangir Alam', '01723-345678', 'A-', 'Farmgate, Dhaka', '2024-06-15 16:45:00+06', NULL, true),
('Ruma Khatun', '01824-456789', 'B-', 'New Market, Dhaka', '2024-06-18 11:15:00+06', '2024-08-05 13:10:00+06', false),
('Aminul Islam', '01925-567890', 'O-', 'Elephant Road, Dhaka', '2024-06-20 13:30:00+06', '2024-08-20 15:40:00+06', false);


create table public.doctors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  specialization text not null,
  city text not null,
  hospital_name text,
  consultation_type text not null default 'both' check (consultation_type in ('online','physical','both')),
  available_timings text[] default '{}',
  experience_years int default 0,
  rating numeric(2,1) default 4.5,
  bio text,
  profile_image text,
  email text not null,
  is_available boolean default true,
  created_at timestamptz default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  patient_contact text not null,
  doctor_id uuid references public.doctors(id) on delete cascade,
  symptoms text,
  appointment_type text,
  selected_slot text,
  status text default 'confirmed',
  user_id uuid,
  created_at timestamptz default now(),
  unique (doctor_id, selected_slot, patient_contact)
);

create table public.ai_inquiries (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  contact_info text not null,
  symptoms text not null,
  suggested_specialization text,
  assigned_doctor uuid references public.doctors(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.doctors enable row level security;
alter table public.appointments enable row level security;
alter table public.ai_inquiries enable row level security;

create policy "doctors_public_read" on public.doctors for select using (true);
create policy "appointments_public_insert" on public.appointments for insert with check (true);
create policy "appointments_owner_read" on public.appointments for select using (auth.uid() = user_id);
create policy "inquiries_public_insert" on public.ai_inquiries for insert with check (true);

insert into public.doctors (full_name, specialization, city, hospital_name, consultation_type, available_timings, experience_years, rating, bio, profile_image, email, is_available) values
('Dr. Ayesha Khan', 'Dermatologist', 'Karachi', 'Aga Khan Hospital', 'both', array['Mon 10:00','Mon 14:00','Tue 11:00','Wed 16:00'], 12, 4.9, 'Board-certified dermatologist specializing in acne, eczema, and cosmetic skin care.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', 'ayesha@example.com', true),
('Dr. Bilal Ahmed', 'Cardiologist', 'Lahore', 'Shaukat Khanum', 'physical', array['Mon 09:00','Tue 09:00','Thu 15:00'], 18, 4.8, 'Interventional cardiologist with expertise in coronary procedures.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400', 'bilal@example.com', true),
('Dr. Sana Iqbal', 'General Physician', 'Islamabad', 'Shifa International', 'both', array['Mon 11:00','Tue 13:00','Fri 10:00'], 8, 4.7, 'Family medicine practitioner focused on preventive care.', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400', 'sana@example.com', true),
('Dr. Imran Malik', 'Orthopedic', 'Karachi', 'Liaquat National', 'physical', array['Wed 10:00','Thu 14:00','Sat 11:00'], 15, 4.6, 'Orthopedic surgeon — joint replacement and sports injuries.', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400', 'imran@example.com', true),
('Dr. Hina Raza', 'Neurologist', 'Lahore', 'Doctors Hospital', 'both', array['Tue 10:00','Thu 11:00'], 11, 4.8, 'Neurologist treating migraine, epilepsy, and stroke recovery.', 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400', 'hina@example.com', true),
('Dr. Usman Tariq', 'Gastroenterologist', 'Islamabad', 'PIMS', 'physical', array['Mon 15:00','Wed 12:00'], 14, 4.5, 'Gastro and liver specialist.', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400', 'usman@example.com', false),
('Dr. Maria Shah', 'Psychiatrist', 'Karachi', 'South City Hospital', 'online', array['Mon 18:00','Wed 19:00','Fri 17:00'], 9, 4.9, 'Mental health specialist — anxiety, depression, therapy.', 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400', 'maria@example.com', true),
('Dr. Faisal Sheikh', 'Orthopedic', 'Lahore', 'Hameed Latif Hospital', 'both', array['Tue 14:00','Fri 11:00'], 20, 4.7, 'Spine and back-pain specialist.', 'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=400', 'faisal@example.com', true),
('Dr. Nida Aslam', 'Dermatologist', 'Lahore', 'National Hospital', 'both', array['Mon 12:00','Thu 16:00'], 7, 4.6, 'Cosmetic and clinical dermatology.', 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400', 'nida@example.com', true),
('Dr. Adeel Rana', 'General Physician', 'Karachi', 'South City Hospital', 'both', array['Tue 09:00','Wed 09:00','Fri 09:00'], 6, 4.4, 'Primary care for adults and children.', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400', 'adeel@example.com', true),
('Dr. Sara Javed', 'Cardiologist', 'Islamabad', 'Maroof International', 'physical', array['Mon 16:00','Thu 10:00'], 13, 4.8, 'Preventive cardiology and heart-failure management.', 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400', 'sara@example.com', true),
('Dr. Kamran Ali', 'Ophthalmologist', 'Lahore', 'LRBT', 'physical', array['Mon 10:00','Wed 14:00'], 16, 4.7, 'Cataract and LASIK surgeon.', 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400', 'kamran@example.com', true);

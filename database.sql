-- Tạo bảng tasks
create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text null,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'done')),
  attachment_url text null,
  attachment_name text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tạo bảng messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  user_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Expense Tracker
create table transactions (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  amount numeric not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz not null default now()
);

-- Inventory Management
create table items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text not null unique,
  description text null,
  created_at timestamptz not null default now()
);

create table stock_logs (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references items(id) on delete cascade,
  quantity int not null,
  type text not null check (type in ('in', 'out')),
  created_at timestamptz not null default now()
);

-- Quiz System
create table questions (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  created_at timestamptz not null default now()
);

create table answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) on delete cascade,
  content text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now()
);

create table quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_name text not null,
  score int not null,
  total_questions int not null,
  created_at timestamptz not null default now()
);

-- Event Registration
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text null,
  date timestamptz not null,
  created_at timestamptz not null default now()
);

create table registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  user_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

-- Simple CRM
create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text null,
  address text null,
  created_at timestamptz not null default now()
);
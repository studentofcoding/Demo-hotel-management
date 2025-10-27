-- Supabase schema for hotel management app
-- Run this in the Supabase SQL editor or via psql on your Supabase project

create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  password text not null,
  first_name text not null,
  last_name text not null,
  created_at timestamptz default now()
);

create table if not exists hotels (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  city text not null,
  country text not null,
  description text not null,
  type text not null,
  adult_count int not null,
  child_count int not null,
  facilities text[] not null,
  price_per_night int not null,
  star_rating int not null,
  image_urls text[] not null,
  last_updated timestamptz not null default now()
);

create table if not exists bookings (
  id uuid default uuid_generate_v4() primary key,
  hotel_id uuid not null references hotels(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  adult_count int not null,
  child_count int not null,
  check_in timestamptz not null,
  check_out timestamptz not null,
  total_cost int not null,
  created_at timestamptz default now()
);
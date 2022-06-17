CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table product (
id uuid not null DEFAULT uuid_generate_v4 () PRIMARY KEY,
title text not null,
description text,
price integer
);

create table stocks (
product_id uuid references product(id),
count integer
);

create table customer (
id uuid not null default uuid_generate_v4 () primary key,
first_name text not null,
last_name text not null,
is_active bool not null
);

create table "order" (
id uuid not null default uuid_generate_v4 () primary key,
product_id uuid not null references product(id),
customer_id uuid not null references customer(id),
amount integer not null
);

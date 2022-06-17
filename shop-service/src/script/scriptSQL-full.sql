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

create table personal_info (
	id uuid not null primary key,
	address text not null,
	city text not null,
	country text not null,
	foreign key (id) references customer(id)	
);

/*products */
insert into product (title, description, price) values ('Custom knife', 'Cobra movie replica', 123 );

insert into product (title, description, price) values ('Knife Damascus', 'Damscus steel VG10', 230 );

insert into product (title, description, price) values ('Hunting Knife', 'Knife made of steel N690', 80 );

insert into product (title, description, price) values ('War Axe', 'Double sided axe', 310 );

insert into product (title, description, price) values ('Tanto knife', 'Japanese style knife', 500 );

insert into product (title, description, price) values ('Sword cane', 'Woden cane with hidden N690 steel blade', 520 );

/*stock */
insert into stocks (product_id, count) values ('cfe11cdb-3db5-42f0-95ad-7f06601672a0', 1);

insert into stocks (product_id, count) values ('74697980-eeed-4f96-9adf-69d89fdb39ec', 3);

insert into stocks (product_id, count) values ('d4a4243b-6454-4e75-bbfc-c658b3b45c1e', 10);

insert into stocks (product_id, count) values ('cb6892fa-df75-4138-8909-8420321ee311', 1);

insert into stocks (product_id, count) values ('7ca667b2-548f-4f23-8661-22e47f4bbc5f', 2);

insert into stocks (product_id, count) values ('02219ff1-5675-4bb7-8af3-9077bf338c29', 1);
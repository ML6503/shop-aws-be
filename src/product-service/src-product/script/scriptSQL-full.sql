CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table product (
id uuid not null DEFAULT uuid_generate_v4 () PRIMARY KEY,
title text not null unique,
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

/*stocks*/
insert into stocks (product_id, count) values
((select id from product where title = 'Custom knife'), 1),
((select id from product where title = 'Knife Damascus'), 3),
((select id from product where title = 'Hunting Knife'), 10),
((select id from product where title = 'War Axe'), 1),
((select id from product where title = 'Tanto knife'), 2),
((select id from product where title = 'Sword cane'), 1);

/* join product with stocks*/
select id, title, description, price, count from product
inner join stocks  on stocks.product_id = product.id order by stocks.count;

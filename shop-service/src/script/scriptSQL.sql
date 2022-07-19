CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table IF NOT EXISTS product (
id uuid not null DEFAULT uuid_generate_v4 () PRIMARY KEY,
title text not null unique,
description text,
price integer
);

create table IF NOT EXISTS stocks (
product_id uuid references product(id),
count integer
);

/*products*/
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
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table IF NOT EXISTS product (
id uuid not null DEFAULT uuid_generate_v4 () PRIMARY KEY,
title text not null unique,
description text,
image text,
price integer
);

create table IF NOT EXISTS stocks (
product_id uuid references product(id),
count integer
);

/*products*/
insert into product (title, description, image, price) values ('Custom knife', 'Cobra movie replica', 'https://d1hanza5iosnsr.cloudfront.net/custom.jpg', 153 ) ON CONFLICT (title) DO NOTHING;

insert into product (title, description, image, price) values ('Knife Damascus', 'Damascus steel VG10', 'https://d1hanza5iosnsr.cloudfront.net/damascus.jpg', 230 ) ON CONFLICT (title) DO NOTHING;

insert into product (title, description, image, price) values ('Hunting Knife', 'Knife made of steel N690', 'https://d1hanza5iosnsr.cloudfront.net/hunting.jpg', 130 ) ON CONFLICT (title) DO NOTHING;

insert into product (title, description, image, price) values ('War Axe', 'Double sided axe', 'https://d1hanza5iosnsr.cloudfront.net/axe.jpg',310 ) ON CONFLICT (title) DO NOTHING;

insert into product (title, description, image, price) values ('Tanto knife', 'Japanese style knife', 'https://d1hanza5iosnsr.cloudfront.net/tanto.jpg', 200 ) ON CONFLICT (title) DO NOTHING;

insert into product (title, description, image, price) values ('Dagger', 'Damascus steel blade with olive and stone handle', 'https://d1hanza5iosnsr.cloudfront.net/dagger.jpg', 220 ) ON CONFLICT (title) DO NOTHING;

-- insert into product (title, description, price) values ('Sword cane', 'Woden cane with hidden N690 steel blade', 520 );

/*stocks*/
insert into stocks (product_id, count) values
((select id from product where title = 'Custom knife'), 1),
((select id from product where title = 'Knife Damascus'), 3),
((select id from product where title = 'Hunting Knife'), 10),
((select id from product where title = 'War Axe'), 1),
((select id from product where title = 'Tanto knife'), 2),
((select id from product where title = 'Dagger'), 4);
--((select id from product where title = 'Sword cane'), 1);

/* join product with stocks*/
select id, title, description, price, count from product
inner join stocks  on stocks.product_id = product.id order by stocks.count;
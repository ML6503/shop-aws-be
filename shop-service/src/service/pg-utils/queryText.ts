
const INSERT_ONE_PRODUCT = 'INSERT INTO product (title, description, price) VALUES ($1, $2, $3) returning *';
const INSERT_ONE_PRODUCT_STOCK = 'INSERT INTO stocks (product_id, count) VALUES ($1, $2)';

const SELECT_ALL_PRODUCTS_JOIN_STOCK = `SELECT p.id, s.count, p.price, p.title, p.description
                                        FROM product p
                                        INNER JOIN stocks s ON s.product_id = p.id order by s.count DESC`;
const DELETE_ONE_PRODUCT_BY_ID = `DELETE FROM product p
                                  WHERE p.id = $1
                                  AND * IN stocks s
                                  WHERE s.product_id = $1`;

const UPDATE_PRODUCT_TITLE = `UPDATE product SET title = $2 WHERE id = $1`;

const UPDATE_PRODUCT_PRICE = `UPDATE product SET price = $2 WHERE id = $1`;

const UPDATE_PRODUCT_DESCRIPTION = `UPDATE product SET description = $2 WHERE id = $1`;

const UPDATE_PRODUCT_STOCK = `UPDATE stocks SET count = $2 WHERE product_id = $1`;

const SELECT_ONE_PRODUCT_WITH_STOCK_BY_ID = `SELECT p.id, s.count, p.price, p.title, p.description
                                             FROM product p
                                             INNER JOIN stocks s ON s.product_id =  p.id WHERE p.id = $1`;

                                             
export {
    SELECT_ALL_PRODUCTS_JOIN_STOCK,
    SELECT_ONE_PRODUCT_WITH_STOCK_BY_ID,
    UPDATE_PRODUCT_DESCRIPTION,
    UPDATE_PRODUCT_PRICE,
    UPDATE_PRODUCT_STOCK,
    UPDATE_PRODUCT_TITLE,
    DELETE_ONE_PRODUCT_BY_ID,
    INSERT_ONE_PRODUCT,
    INSERT_ONE_PRODUCT_STOCK
};

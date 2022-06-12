# Task 3. shop-aws-be
Link to the task:
https://github.com/EPAM-JS-Competency-center/cloud-development-course-initial/blob/main/3_serverless_api/task.md

1. What was done?
 

```
   My own Frontend application is integrated with product service (/products API) and products from product-service are represented on Frontend. AND POINT1 and POINT2 are done.

   Additional scope:
    - [x] Async/await is used in lambda functions
    - [x] ES6 modules are used for product-service implementation
    - [ ] Webpack is configured for product-service
    - [ ] SWAGGER documentation is created for product-service
    - [ ] Lambda handlers are covered by basic UNIT tests (NO infrastructure logic is needed to be covered)
    - [x] Lambda handlers (getProductsList, getProductsById) code is written not in 1 single module (file) and separated in codebase.
    - [x] Main error scenarious are handled by API ("Product not found" error).
```

2. Link to product-service API
## Endpoints:

  GET - https://rxqgzhje6j.execute-api.eu-west-1.amazonaws.com/dev/products
  GET - https://rxqgzhje6j.execute-api.eu-west-1.amazonaws.com/dev/products/{productId}

3. Link to FE PR:
https://github.com/ML6503/nodejs-aws-fe/pull/2

## Cloudfront FE shop URL

https://d3kdjtzujfvruo.cloudfront.net/

4. In case SWAGGER file is not provided - please provide product schema in PR description





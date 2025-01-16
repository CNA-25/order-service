# order-service

## How to use
1. Clone the project git clone https://github.com/CNA-25/order-service.git
2. Make sure Node.js is installed with npm -v, if not, install it
3. Install dependencies with npm install
4. Run app.js with node app.js

## Uppgiftsfördelning
-


## To-do lista:
Order Service

1.	Hämta beställningar från vår DB som hör till en viss user_id
GET -> user_id, lista med information om beställningen (order_items, products)
Respons = data eller not found

2.	Skapa beställning för en viss userId med de produkter som finns i dens köpkorg och spara i vår DB
POST -> user_id, lista med information om produkter (productId)
Respons = success eller fail

3.	/cartAPI
GET information om produkterna i userId köpkorg

4.	/emailAPI
POST? information om userId med dens beställning -> skickar ett email

5.	/invoicingAPI
POST? information om userId med dens beställning -> skapar en faktura

6.	/productsAPI
GET information om produkterna ur produktregistret

7.	/inventoryAPI
PATCH? att minska productId saldo från lagret

+ error handling

## Databas

Orders table:
- order_id - SERIAL & auto-increment
- user_id - INTEGER - den inloggades användarend unika id
- timestamp - TIMESTAMP - när beställningen gjordes
- order_price - DECIMAL - totala priset för hela beställningen (amount * price)

Order_items table:
- order_id - INTEGER - foreign key som är kopplad till Orders.order_id
- product_id - INTEGER - produktens id, kommer från productsAPI
- amount - INTEGER - antal produkter

Products table: (denna information kommer från productsAPI, men sparas också i vår egen DB)
- product_id - INTEGER - produktens unika id
- name - VARCHAR - namnet på produkten
- price - DECIMAL - produktens pris
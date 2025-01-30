# order-service

## How to use
1. Clone the project git clone https://github.com/CNA-25/order-service.git
2. Make sure Node.js is installed with npm -v, if not, install it
3. Install dependencies with npm install

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
GET information om produkterna ur produktregistret (ännu oklart om detta behövs)

7.	/inventoryAPI
PATCH? att minska productId saldo från lagret

+ error handling

## Databas

Orders table:
- order_id - SERIAL & auto-increment, primary key
- user_id - INTEGER - den inloggades användarens unika id
- timestamp - TIMESTAMP - när beställningen gjordes
- order_price - NUMERIC - totala priset för hela beställningen (amount * price)

Order_items table:
- order_item_id - INTEGER (behövs denna?)
- order_id - INTEGER - foreign key som är kopplad till Orders.order_id
- product_id - VARCHAR (123-ABC) - produktens id, kommer från cartAPI?
- amount - INTEGER - antal produkter, kommer från cartAPI?
- product_price - NUMERIC - produktens pris, kommer från cartAPI?
- product_price - STRING - produktens namn, kommer från cartAPI?

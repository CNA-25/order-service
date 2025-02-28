# order-service

## What this service does
- När en user klickar "beställ" på Store frontend, skickar Store en POST till Orders
- Orders hämtar produkternas id från Cart
- Dessa produkt ids används för att hämta information om produkterna från Products
- En ny Order skapas i vår databas med en success response
- Produktmängden i Inventory uppdateras enligt mängden i Cart
- En POST skickas också till Email och Invoicing för att skicka till användaren, när en Order skapats

## Swagger
- https://order-service-api-order-service.2.rahtiapp.fi/api/docs/#/

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
POST -> user_id, lista med information om produkter (product_id)
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
POST att minska productId saldo från lagret

+ error handling
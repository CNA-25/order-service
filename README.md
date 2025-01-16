# order-service

## How to use
-

## Uppgiftsfördelning
-


## To-do lista:
Order Service

1.	Hämta beställningar som hör till en viss userId
GET -> userId, lista med information om produkter (productId)
Respons = data eller not found

2.	Skapa beställning för en viss userId med de produkter som finns i dens köpkorg och spara i vår DB
POST -> userId, lista med information om produkter (productId)
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

Databas: orderId, userId, productId, amount, timestamp
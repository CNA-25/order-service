# Order-Service API

## Overview
The Order-Service is responsible for handling the creation, retrieval, and management of orders within the eCommerce platform.

## Functionality

When a user clicks the "Order" button on the Store frontend, the following sequence of actions occurs:

1. **Cart Data Retrieval**: A POST request is sent from the Store frontend to the Orders service to fetch the cart data.
2. **Product Details Fetch**: The Order service retrieves the product IDs from the cart and fetches detailed product information from the Products API.
3. **Order Creation**: A new order is created in the orders table of the database, including the product data and the shipping address provided by the user.
4. **Inventory Update**: The quantities of the products in the inventory are updated based on the cart items that were ordered.
5. **Email and Invoicing Notification**: A POST request is sent to the Email Service to send an order confirmation email to the user and to the Invoicing Service to generate an invoice for the order.

## API
The Order-Service API is available at:  
[https://order-service-api-order-service.2.rahtiapp.fi/](https://order-service-api-order-service.2.rahtiapp.fi/)

## Swagger Documentation
Access the full Swagger documentation for API usage:  
[https://order-service-api-order-service.2.rahtiapp.fi/api/docs/](https://order-service-api-order-service.2.rahtiapp.fi/api/docs/)

## How to Use
1. Clone the project git clone https://github.com/CNA-25/order-service.git
2. Make sure Node.js is installed with npm -v, if not, install it
3. Install dependencies with npm install

## Endpoints

### 1. **Get All Orders (Admin only)**  
- **Method**: `GET`  
- **Endpoint**: `/api/admin/orders`  
- **Description**: Fetches all orders from the database for admin purposes.

### 2. **Get Orders for a Specific User**  
- **Method**: `GET`  
- **Endpoint**: `/api/orders`  
- **Description**: Fetches all orders related to a specific user based on their user ID.

### 3. **Create a New Order**  
- **Method**: `POST`  
- **Endpoint**: `/api/orders`  
- **Description**: Creates a new order by fetching cart data, checking inventory, and sending order details to the invoicing and email services.

### 4. **Delete an Order (Admin only)**  
- **Method**: `DELETE`  
- **Endpoint**: `/api/admin/delete/{order_id}`  
- **Description**: Deletes an order by its ID (Admin privilege required).

## Database
The database consists of two main tables: orders and order_items.

### 1. **orders Table**

| Field             | Type                          | Description                                           |
|-------------------|-------------------------------|-------------------------------------------------------|
| `order_id`        | `Int` (Primary Key, Auto-increment) | Unique identifier for each order.                    |
| `user_id`         | `Int`                          | User ID associated with the order.                   |
| `timestamp`       | `DateTime`                     | Date and time the order was created (default: current time). |
| `order_price`     | `Decimal(10, 2)`               | Total price of the order.                            |
| `order_items`     | `Relation`                     | Relationship to the `order_items` table.             |
| `shipping_address`| `String`                       | Shipping address provided by the user.               |

### 2. **order_items Table**

| Field                | Type                          | Description                                           |
|----------------------|-------------------------------|-------------------------------------------------------|
| `order_item_id`      | `Int` (Primary Key, Auto-increment) | Unique identifier for each order item.               |
| `order_id`           | `Int` (Foreign Key to `orders` table) | Reference to the associated order.                   |
| `product_id`         | `String`                       | Unique identifier for the product.                   |
| `product_name`       | `String`                       | Name of the product.                                 |
| `quantity`           | `Int`                          | Quantity of the product ordered.                     |
| `product_price`      | `Decimal(10, 2)`               | Price per unit of the product.                       |
| `total_price`        | `Decimal(10, 2)`               | Total price for the quantity of the product.         |
| `product_description`| `String (Text)`                | Description of the product.                          |
| `product_image`      | `String`                       | URL to the product image.                            |
| `product_country`    | `String`                       | Country of origin of the product.                    |
| `product_category`   | `String`                       | Category of the product.                             |
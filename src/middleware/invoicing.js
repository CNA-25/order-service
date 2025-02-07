// invoicingAPI POST med information om user_id och dens beställning
// todo viktor, in progress


// https://invoicing-service-git-invoicing-service.2.rahtiapp.fi/shipments
/* {
"user_id": 2,
"timestamp": "2025-01-01T12:00:00",
"order_price": 199.99,
"order_id": 2,
"order_item_id": 2,
"product_id": 2,
"amount": 2,
"product_price": 99.99,
"product_name": "Mega Craft Beer XL"
} */ 

// Skicka ordern till fakturering / invoicing
// Information om beställningen kommer från getCartData funktion
// dens return kan användas i /orders POST i orderRoutes för att köra sendOrder
export async function sendOrderToInvoicing() {
    // URL to send the POST request to
    const url = "https://invoicing-service-git-invoicing-service.2.rahtiapp.fi/shipments${userId}";
    sendData();
}

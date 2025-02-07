const INVOICING_SERVICE_URL = process.env.INVOICING_SERVICE_URL;

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
async function sendOrder(newOrder) {

    const { userId, orderPrice, orderId, orderItems, timestamp } = newOrder;

    try {
        // Format the shipment data to match the expected structure
        const shipmentData = orderItems.map(item => ({
            user_id: userId,               // Same as `userId` in the order
            timestamp: timestamp,           // Use the timestamp from the `newOrder` object
            order_price: orderPrice,        // Total price of the order
            order_id: orderId,              // Order ID from the database
            order_item_id: item.order_item_id, // Order item ID (from Prisma)
            product_id: item.product_id,    // Product ID (from Prisma)
            amount: item.amount,            // Amount (from Prisma)
            product_price: item.product_price, // Price for each product (from Prisma)
            product_name: item.product_name,  // Product name (from Prisma)
        }));

        console.log('newOrder: ', newOrder);
        console.log('shipmentData: ', shipmentData)

        // Send to invoicing
        // Sending the POST request using async/await
        const resInvoice = await fetch(INVOICING_SERVICE_URL, {
            method: 'POST', // We're sending data to the server
            headers: {
                // Tells the server that we are sending JSON
                'Content-Type': 'application/json'
            },
            // Convert the data object into JSON
            body: JSON.stringify(shipmentData)
        });
        console.log("resInvoice: ", resInvoice);

        // Check if the INVOICE is OK (status code 200-299)
        if (!resInvoice.ok) {
            console.error('Failed to send order data');
            return null;
        }

        // Send to email
        // Sending the POST request using async/await
        /* const resEmail = await fetch(INVOICING_SERVICE_URL, {
            method: 'POST', // We're sending data to the server
            headers: {
                // Tells the server that we are sending JSON
                'Content-Type': 'application/json'
            },
            // Convert the data object into JSON
            body: JSON.stringify(data)
        }); */

        // Check if the EMAIL is OK (status code 200-299)
        /* if (!resEmail.ok) {
            console.error('Failed to send order data');
            return null;
        } */

        // If successful, parse the response as JSON
        const responseDataInvoice = await resInvoice.json();
        console.log("responseDataInvoice: ", responseDataInvoice);
        /*         const responseDataEmail = await resEmail.json();
         */
        // Return the server's responses
        return { responseDataInvoice/* , responseDataEmail */ };

    } catch (error) {
        console.error('Error sending order data:', error);
        return null;
    }
}

module.exports = sendOrder;
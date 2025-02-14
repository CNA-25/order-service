const INVOICING_SERVICE_URL = process.env.INVOICING_SERVICE_URL;

// invoicingAPI POST med information om user_id och dens beställning

// Skicka ordern till fakturering / invoicing
// Information om beställningen kommer från getCartData funktion
// dens return kan användas i /orders POST i orderRoutes för att köra sendOrder
async function sendOrder(newOrder) {
    const { user_id, order_price, order_id, order_items, timestamp } = newOrder;

    let invoiceStatus = 'success';
    let emailStatus = 'success';
    let invoiceMessage = "Order sent to invoice successfully.";
    let emailMessage = "Order sent to email successfully.";

    try {
        const shipmentData = {
            user_id,          
            timestamp,        
            order_price,      
            order_id,         
            order_items: order_items.map(item => ({
                order_item_id: item.order_item_id,
                product_id: Number(item.product_id), // BORDE VARA STRING! Men invoicing APIn kräver atm en INT
                amount: item.quantity,
                product_price: item.product_price,
                product_name: item.product_name
            }))
        };

        console.log('newOrder: ', newOrder);
        console.log('shipmentData: ', shipmentData)

        // Send to invoicing
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

        if (!resInvoice.ok) {
            invoiceStatus = 'failed';
            invoiceMessage = 'Failed to send order data to invoicing.';
            console.error('Failed to send order data to invoicing.');
        }

        // Send to email
        const resEmail = await fetch(EMAIL_SERVICE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shipmentData) // Antar att email använder samma format som invoice
        });

        if (!resEmail.ok) {
            emailStatus = 'failed';
            emailMessage = 'Failed to send order data to email.';
            console.error('Failed to send order data to email.');
        }

        // Returnerar responsen från både email och invoicing
        return {
            invoiceStatus,
            invoiceMessage,
            emailStatus,
            emailMessage,
        };

    } catch (error) {
        console.error('Error sending order data:', error);
        return null;
    }
}

module.exports = sendOrder;
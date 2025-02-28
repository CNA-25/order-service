const INVOICING_SERVICE_URL = process.env.INVOICING_SERVICE_URL;
const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL;

// invoicingAPI POST med information om user_id och dens beställning

// Skicka ordern till fakturering / invoicing
// Information om beställningen kommer från getCartData funktion
// dens return kan användas i /orders POST i orderRoutes för att köra sendOrder
async function sendOrder(newOrder, user_email) {
    const { user_id, order_price, order_id, order_items, timestamp } = newOrder;

    // Invoice payload
    const invoiceData = {
        user_id,
            timestamp,
            order_price,
            order_id,
            order_items: order_items.map(item => ({
                order_item_id: item.order_item_id,
                product_id: item.product_id,
                amount: item.quantity,
                product_price: item.product_price, 
                product_name: item.product_name,
            })),
    }

    // Email payload
    const emailData = {
        to: user_email,
            subject: "Beställningsbekräftelse",
            body: [
                {
                    orderId: order_id,
                    userId: user_id,
                    timestamp,
                    orderPrice: order_price,
                    orderItems: order_items.map(item => ({
                        product_image: item.product_image,
                        product_name: item.product_name,
                        product_description: item.product_description,
                        product_country: item.product_country,
                        product_category: item.product_category,
                        order_item_id: item.order_item_id,
                        order_id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        product_price: item.product_price,
                        total_price: item.total_price,
                    })),
                },
            ],
    }

    console.log("Invoicing Data:", JSON.stringify(invoiceData, null, 2));
    console.log("Email Data:", JSON.stringify(emailData, null, 2));

    // Kör båda requests parallellt
    const [invoiceResult, emailResult] = await Promise.allSettled([
        fetch(INVOICING_SERVICE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(invoiceData),
        }).then(res => res.ok ? res.json() : Promise.reject(`Invoice API status: ${res.status}`)),

        fetch(EMAIL_SERVICE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(emailData),
        }).then(res => res.ok ? res.json() : Promise.reject(`Email API status: ${res.status}`)),
    ])

    // Checkar om promisen returnerar 'fulfilled'
    const invoiceStatus = invoiceResult.status === "fulfilled" ? "success" : "failed";

    // Ternary conditional operator -> const A = B === "fulfilled" ? (C ? D : F) : E;
    // Checkar om invoiceResult.status === "fulfilled"
    // TRUE -> Checkar om invoiceResult.value är error. 
    //      Yes -> använd invoiceResult.value.error.message
    //      No  -> använd "Order data sent to invoicing successfully."
    // FALSE -> använd invoiceResult.reason
    const invoiceMessage = invoiceResult.status === "fulfilled"
        ? (invoiceResult.value.error ? invoiceResult.value.error.message : "Order data sent to invoicing successfully.")
        : invoiceResult.reason;

    // Gör samma med emailStatus
    const emailStatus = emailResult.status === "fulfilled" ? "success" : "failed";
    const emailMessage = emailResult.status === "fulfilled"
        ? (emailResult.value.error ? emailResult.value.error.message : "Order sent to email successfully.")
        : emailResult.reason;

    // Returnerar status för email och invoice
    return {
        invoiceStatus,
        invoiceMessage,
        emailStatus,
        emailMessage,
    };
}

module.exports = sendOrder;
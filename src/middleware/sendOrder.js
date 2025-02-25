const INVOICING_SERVICE_URL = process.env.INVOICING_SERVICE_URL;
const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL;

// invoicingAPI POST med information om user_id och dens beställning

// Skicka ordern till fakturering / invoicing
// Information om beställningen kommer från getCartData funktion
// dens return kan användas i /orders POST i orderRoutes för att köra sendOrder
async function sendOrder(newOrder, user_email) {
    const { user_id, order_price, order_id, order_items, timestamp } = newOrder;

    try {
        // --- SKICKA ORDER TILL INVOICE ---
        const invoiceData = {
            user_id,
            timestamp,
            order_price,
            order_id,
            order_items: order_items.map(item => ({
                order_item_id: item.order_item_id,
                product_id: parseInt(item.product_id.replace(/\D/g, '')),  // TA BORT DÅ DET INTE BEHÖVS (INVOICE BYTT TILL VARCHAR)
                amount: item.quantity,
                product_price: item.product_price, 
                product_name: item.product_name,
            })),
        };

        console.log("Invoicing Data:", JSON.stringify(invoiceData, null, 2));

        const resInvoice = await fetch(INVOICING_SERVICE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoiceData),
        });

        let invoiceStatus = "failed";
        let invoiceMessage = "Failed to send order data to invoicing.";

        if (resInvoice.ok) {
            const invoiceResponse = await resInvoice.json();
            if (invoiceResponse.error) {
                invoiceMessage = invoiceResponse.error.message || invoiceMessage;
            } else {
                invoiceStatus = "success";
                invoiceMessage = "Order data sent to invoicing successfully.";
            }
        } else {
            invoiceMessage = `Invoice API returned status: ${resInvoice.status}`;
        }

        // --- SKICKA ORDER TILL EMAIL ---
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
                        order_item_id: item.order_item_id,
                        order_id,
                        product_id: item.product_id,
                        product_name: item.product_name,
                        amount: item.quantity,
                        product_price: item.product_price,
                        total_price: item.total_price,
                    })),
                },
            ],
        };

        console.log("Email Data:", JSON.stringify(emailData, null, 2));

        const resEmail = await fetch(EMAIL_SERVICE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData),
        });

        let emailStatus = "failed";
        let emailMessage = "Failed to send order data to email.";

        if (resEmail.ok) {
            const emailResponse = await resEmail.json();
            if (emailResponse.error) {
                emailMessage = emailResponse.error.message || emailMessage;
            } else {
                emailStatus = "success";
                emailMessage = "Order sent to email successfully.";
            }
        } else {
            emailMessage = `Email API returned status: ${resEmail.status}`;
        }

        // Returnera status för fakturering och email
        return {
            invoiceStatus,
            invoiceMessage,
            emailStatus,
            emailMessage,
        };

    } catch (error) {
        console.error('Error sending order data:', error);
        return {
            invoiceStatus: "failed",
            invoiceMessage: error.message,
            emailStatus: "failed",
            emailMessage: "Error occurred while sending the email data."
        };
    }
}

module.exports = sendOrder;

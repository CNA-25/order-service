// the data to send
const data = {
    user_id: 42,
    timestamp: "2026-01-01T12:00:00",
    order_price: 420,
    order_id: 43,
    order_item_id: 2,
    product_id: 2,
    amount: 55,
    product_price: 99.99,
    product_name: "Order-Test-Beer"
};

try {
    // Sending the POST request using async/await
    const response = await fetch(url, {
        method: 'POST', // We're sending data to the server
        headers: {
            // Tells the server that we are sending JSON
            'Content-Type': 'application/json'
        },
        // Convert the data object into JSON
        body: JSON.stringify(data)
    });

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
        console.error('Failed to send order data');
        return null;
    }

    // If successful, parse the response as JSON
    const responseData = await response.json();

    // You can process the response data here if needed
    console.log('Response from server:', responseData);

    // Return the server's response
    return responseData;
} catch (error) {
    console.error('Error sending order data:', error);
    return null;
}
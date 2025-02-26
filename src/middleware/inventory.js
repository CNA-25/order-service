const INVENTORY_SERVICE_URL = `${process.env.INVENTORY_SERVICE_URL}/inventory/decrease`;

// Middleware som kontrollerar och reducerar lagersaldo för varje produkt i kundvagnen
const checkInventory = async (req, res, next) => {
    const cartData = req.cartData; // cartData från föregående middleware
    const user_email = req.user.email; // email från request body - byt ut mot inloggad användares email i jwt

    const token = req.token;

    if (!user_email) {
        return res.status(400).json({ error: "Email is required in the request body" });
    }

    if (!token) {
        return res.status(500).json({
            error: "Missing authentication token",
            message: "Inventory service requires an authentication token"
        });
    }

    try {
        const inventoryRequest = {
            email: user_email,
            items: cartData.cart.map(item => ({
                productCode: String(item.product_id),
                quantity: item.quantity
            })),
        };

        console.log("Sending to inventory-service...:", JSON.stringify(inventoryRequest, null, 2));

        // Skickar en POST request till inventory service för att minska lagersaldot
        const inventoryResponse = await fetch(INVENTORY_SERVICE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.trim()}`
            },
            body: JSON.stringify(inventoryRequest),
        });

        // Om responsen från inventory service inte är ok, returnera ett felmeddelande
        if (!inventoryResponse.ok) {
            const errorData = await inventoryResponse.json();
            return res.status(400).json({
                error: errorData.error || "Uppdatering av lagersaldo misslyckades",
                message: errorData.message || "Går inte att uppdatera lagersaldo",
            });
        }

        console.log("Inventory check successful");
        next(); // Om allt ok, fortsätt till nästa middleware
    } catch (error) {
        console.error("Error checking inventory", error);
        return res.status(500).json({
            error: "Internal server error",
            message: "Failed to validate or update inventory stock",
        });
    }
};

module.exports = checkInventory;
const CART_SERVICE_URL = process.env.CART_SERVICE_URL;

/**
 * Hämtar kundvagnen för en specifik användare från API:n.
 * 
 * Args:
 *  - userId (int): Unik user_id
 *  - token (string): Giltig JWT token
 * 
 * Returns:
 *  - (Object | null): Ett objekt med kundvagnsdata om anropet lyckas, annars `null`
 * 
 * Exempel: 
 *  - const cartData = await getCartData(3, 'din-jwt-token');
 *  - console.log(cartData);
 */

const getCartData = async (req, res, next) => {
    const { user_id, token } = req.body; // userId och token kommer från JWT via front-end till vår /orders POST

    if (!user_id || !token) {
        return res.status(400).json({
            error: "Saknar user_id och token",
            message: "user_id och token krävs för att hämta kundvagnsdata",
        });
    }

    try {
        // Hämta kundvagnen för en specifik användare
        const response = await fetch(`${CART_SERVICE_URL}/cart/${user_id}`, {
            method: "GET",
            headers: {
                'token': token // Kommer från JWT token
            }
        });

        // Om hämtningen misslyckas
        if (!response.ok) {
            console.error(`Misslyckades med att hämta kundvagnsdata för användare ${user_id}`);
            return res.status(500).json({
                error: "Kundvagnshämtning misslyckades",
                message: "Det gick inte att hämta kundvagnsdata. Försök igen senare."
            });
        }

        // Får cartData i JSON format
        const cartData = await response.json();

        // Kollar att cartData existerar och inte är tom
        if (!cartData || !cartData.cart || !cartData.cart.length) {
            console.warn(`Ingen kundvagn hittades för användare ${user_id}`);
            return res.status(200).json({
                message: "Kundvagnen är tom",
                cart: []
            });
        }

        // Lägg till cartData i request objektet för att användas i nästa middleware
        req.cartData = cartData;

        // Fortsätt till nästa middleware (checkInventory)
        next();

    } catch (error) { // Om något annat går fel...
        console.error(`Misslyckades med att hämta kundvagnsdata för användare ${user_id}`, error);
        return res.status(500).json({
            error: "Oväntat fel",
            message: "Ett oväntat fel inträffade vid hämtning av kundvagnsdata"
        });
    }
};

module.exports = getCartData;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;

const getProductData = async (req, res, next) => {
    const cartData = req.cartData;
    const token = process.env.PRODUCT_SERVICE_AUTH_TOKEN || req.token;

    try {
        // hämta produktinformation
        const getProductDetails = async (item) => {
            try {
                const response = await fetch(`${PRODUCT_SERVICE_URL}/products/${item.product_id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token.trim()}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch product data, status: ${response.status}`);
                }

                const data = await response.json();

                if (!data || !data.product || data.product.price == null) {
                    throw new Error(`Missing product data or price for ${item.product_id}`);
                }

                // räkna ut totalpris för varje produkt
                const product_price = parseFloat(data.product.price);
                const total_price = parseFloat(product_price * item.quantity);

                // lägg till produktinformation till varje item (produkt), använd default-värden om information saknas
                return {
                    ...item,
                    product_price,
                    total_price,
                    product_name: data.product?.name || "Okänd produkt",
                    product_description: data.product?.description || 'Ingen beskrivning tillgänglig',
                    product_image: data.product?.image || '/default-image.jpg',
                    product_country: data.product?.country || 'Okänt land',
                    product_category: data.product?.category || 'Okategoriserad'
                };

            } catch (err) {
                console.error(`Error fetching product data for ${item.product_id}:`, err.message);
                throw new Error(`Failed to fetch product data for ${item.product_id}: ${err.message}`);
            }
        };

        // Hämta och uppdatera produktdata för alla produkter
        const updatedCartData = await Promise.all(cartData.cart.map(getProductDetails));

        // Uppdatera cartData med produktinformation
        req.cartData.cart = updatedCartData;

        // fortsätt till nästa middleware
        next();
    } catch (error) {
        console.error("Error fetching product data:", error.message);
        return res.status(500).json({
            error: "Product data fetch failed",
            message: error.message
        });
    }
};

module.exports = getProductData;
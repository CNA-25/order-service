const express = require('express');
const router = express.Router();
const prisma = require('../prisma'); // Import Prisma Client

// GET beställningar från vår DB som hör till en viss user_id. Return data or not found
// Uppgift 1 i README. Ungefärlig kod eftersom databasen inte ännu är gjord
router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const orders = await prisma.order.findMany({
            where: { userId: parseInt(user_id)},
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (orders.length === 0) {
            return res.status(400).json({ msg: "No orders found for this user." })
        }

        res.status(200).json(orders);
        console.log(orders);
    } catch(err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ msg: "Internal server error" })
    }
})

module.exports = router;

// POST som sparar en beställning för en viss user_id med de produkter som finns i user_id beställning. Return success or fail
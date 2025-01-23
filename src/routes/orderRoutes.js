const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// GET beställningar från vår DB som hör till en viss user_id. Return data or not found
// Uppgift 1 i README. Ungefärlig kod eftersom databasen inte ännu är gjord
router.get("orders/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(user_id) },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (orders.length === 0) {
      return res.status(400).json({ msg: "No orders found for this user." });
    }

    res.status(200).json(orders);
    console.log(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// POST som sparar en beställning för en viss user_id med de produkter som finns i user_id beställning. Return success or fail
// Uppgift 2 i README.

router.post("/orders", async (req, res) => {
  const { user_id, products, total_amount } = req.body;

  if (!user_id || !products || !total_amount) {
    return res.status(400).json({
      error: "Saknar user_id, products eller total_amount",
      message: "Alla fält obligatoriska",
    });
  }

  try {
    const newOrder = await prisma.order.create({
      data: {
        user_id,
        products: JSON.stringify(products),
        total_amount,
      },
    });
    res.status(201).json({ message: "Beställningen skapades", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Beställningen misslyckades", message: error.message });
  }
});

// Hämta alla beställningar
router.get("/orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hämtningen misslyckades", message: error.message });
  }
});



module.exports = router;

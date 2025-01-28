const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// GET beställningar från vår DB som hör till en viss user_id. Return data or not found
// Uppgift 1 i README.
router.get("/orders/:user_id", async (req, res) => { // URL t.ex /orders/101
  const { user_id } = req.params; // Hämtar user_id från URLen

  try {
    const orders = await prisma.orders.findMany({ // Hittar alla orders som hör till denna user_id
      where: { userId: parseInt(user_id) },
      include: { // Inkluderar orderItems
        orderItems: true,
      },
    });

    if (orders.length === 0) { // Om användaren inte har någon order
      return res.status(404).json({ msg: `No orders found for user with ID: ${user_id}.` });
    }

    // Om allt ok, returnerar orders
    res.status(200).json(orders);
    console.log(orders);
  } catch (err) { // Om någonting misslyckas, returnera error kod 500
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
    const newOrder = await prisma.orders.create({
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
    const orders = await prisma.orders.findMany();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hämtningen misslyckades", message: error.message });
  }
});

module.exports = router;
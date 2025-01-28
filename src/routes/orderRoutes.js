const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// Hämta alla beställningar
router.get("/orders", async (req, res) => {
  try {
    const orders = await prisma.orders.findMany();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Hämtningen misslyckades", message: error.message });
  }
});

// GET beställningar från vår DB som hör till en viss user_id. Return data or not found
// Uppgift 1 i README.
router.get("/orders/:user_id", async (req, res) => {
  // URL t.ex /orders/101
  const { user_id } = req.params; // Hämtar user_id från URLen

  try {
    const orders = await prisma.orders.findMany({
      // Hittar alla orders som hör till denna user_id
      where: { userId: parseInt(user_id) },
      include: {
        // Inkluderar orderItems
        orderItems: true,
      },
    });

    if (orders.length === 0) {
      // Om användaren inte har någon order
      return res
        .status(404)
        .json({ msg: `No orders found for user with ID: ${user_id}.` });
    }

    // Om allt ok, returnerar orders
    res.status(200).json(orders);
    console.log(orders);
  } catch (err) { // Om någonting misslyckas, returnera error kod 500
    console.error("Error fetching orders:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Skapa en ny beställning
router.post("/orders", async (req, res) => {
  const { userId, orderPrice, orderItems } = req.body;

  // Kontrollera att alla fält är ifyllda
  if (!userId || !orderPrice || !Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({
      error: "Saknade fält",
      message: "userId, orderPrice och orderItems krävs",
    });
  }

  try {
    // Skapa beställningen
    const newOrder = await prisma.orders.create({
      data: {
        userId: userId,
        orderPrice: parseFloat(orderPrice),
        orderItems: {
          create: orderItems.map((item) => ({
            product_id: item.product_id,
            amount: item.amount,
            product_price: parseFloat(item.product_price),
            product_name: item.product_name,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });
    // Returnera success
    res.status(201).json({
      message: "Beställning skapad",
      order: newOrder,
    });
    // Returnera error
  } catch (error) {
    console.error("Misslyckades med att skapa beställning:", error);
    res.status(500).json({
      error: "Misslyckades med att skapa beställning",
      message: error.message,
    });
  }
});

module.exports = router;
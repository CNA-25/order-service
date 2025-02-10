const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// Importera middlewares
const getCartData = require('../middleware/cart.js');
const checkInventory = require('../middleware/inventory.js');
const sendOrder = require("../middleware/sendOrder.js");

// Hämta alla beställningar (oklart om detta behövs, admin eventuellt?)
router.get("/orders", async (req, res) => {
  try {
    const orders = await prisma.orders.findMany();
    res.status(200).json(orders);

    if (orders.length === 0) {
      return res.status(404).json({ error: "Inga ordrar hittades" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Hämtningen misslyckades", message: error.message });
  }
});

/**
 * Hämtar alla ordrar för en specifik användare.
 * 
 * Args:
 *  - user_id (int): Unikt user_id som hämtas från URL-parametern
 * 
 * Returns:
 *  - (Array | Object): En lista med ordrar inklusive orderdetaljer om de finns
 *  - (Object): Ett felmeddelande om inga ordrar hittas eller om ett serverfel uppstår
 * 
 * Exempel:
 *  - GET /orders/101
 *  - Response: [{ order_id: 1, user_id: 101, order_price: 299.99, order_items: [...] }, ...]
 */
router.get("/orders/:user_id", async (req, res) => {
  const { user_id } = req.params; // Hämtar user_id från URLen

  try {
    const orders = await prisma.orders.findMany({
      // Hittar alla orders som hör till denna user_id
      where: { user_id: parseInt(user_id) },
      include: { // Inkluderar orderItems
        order_items: true,
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
  } catch (err) { // Om någonting misslyckas, returnera error kod 500
    console.error("Error fetching orders:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Skapa en ny order
router.post("/orders", getCartData, checkInventory, async (req, res) => {
  const { user_id } = req.body; // Hämtar userId från request body
  const cartData = req.cartData; // Hämtar cartData från middleware

  try {
    // Beräkna totalpriset för ordern
    const order_price = cartData.cart.reduce((sum, item) => sum + item.total_price, 0);

    // Skapa order i databasen
    const newOrder = await prisma.orders.create({
      data: {
        user_id,
        order_price,
        order_items: {
          create: cartData.cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            product_price: item.price,
            product_name: item.product_name,
            total_price: item.total_price,
          })),
        },
      },
      include: { order_items: true },
    });

  

    /* Send the new order to invoice and email

    const orderSent = await sendOrder(newOrder);
    console.log(orderSent);
    if (!orderSent) {
      throw new Error("Kunde inte skicka beställningen vidare.");
    }

    */

    // Returnera success
    res.status(201).json({
      message: "Order skapad",
      order: newOrder,
    });
  } catch (error) {
    // Returnera error
    res.status(500).json({
      error: "Misslyckades att skapa order",
      message: error.message,
    });
  }
});

module.exports = router;
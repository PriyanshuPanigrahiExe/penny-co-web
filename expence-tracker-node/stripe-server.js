require("dotenv").config();

const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Penny & Co. Stripe Payment Server is running!");
});

app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",

            line_items: [
                {
                    price: "price_1ULOISLc5R0k8AKxGJsG8bGk",
                    quantity: 1
                }
            ],

            success_url: "http://localhost:3000/premium-success",
            cancel_url: "http://localhost:3000/premium",

            billing_address_collection: "auto"
        });

        res.json({
            url: session.url
        });

    } catch (error) {
        console.error("Stripe Error:", error.message);

        res.status(500).json({
            error: "Unable to create Stripe checkout session"
        });
    }
});

app.listen(3002, () => {
    console.log("Stripe server running on http://localhost:3002");
});
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(express.json());

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Origin",
        "http://localhost:3000"
    );

    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});


mongoose
    .connect("mongodb://127.0.0.1:27017/pennyco")
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);


const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Expense = mongoose.model("Expense", expenseSchema);


/* EXPRESS WEB PAGE */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


/* SIGN UP */

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists."
            });
        }

        const newUser = new User({
            name,
            email,
            password
        });

        const savedUser = await newUser.save();

        res.json({
            success: true,
            message: "Registration successful!",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Registration failed."
        });

    }
});


/* LOGIN */

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email,
            password
        });

        if (!user) {
            return res.json({
                success: false,
                message: "Incorrect email or password."
            });
        }

        res.json({
            success: true,
            message: "Login successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Login failed."
        });

    }
});


/* ADD EXPENSE */

app.post("/expenses", async (req, res) => {
    try {

        const { title, amount, date, userId } = req.body;

        const newExpense = new Expense({
            title,
            amount,
            date,
            userId
        });

        const savedExpense = await newExpense.save();

        res.json({
            success: true,
            message: "Expense added successfully!",
            expense: savedExpense
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to save expense."
        });

    }
});


/* GET EXPENSES */

app.get("/expenses/:userId", async (req, res) => {
    try {

        const expenses = await Expense.find({
            userId: req.params.userId
        }).sort({
            date: -1
        });

        res.json(expenses);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to get expenses."
        });

    }
});


/* DELETE EXPENSE */

app.delete("/expenses/:id", async (req, res) => {
    try {

        await Expense.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Expense deleted successfully!"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to delete expense."
        });

    }
});


app.listen(PORT, () => {

    console.log(`Express server running at http://localhost:${PORT}`);

});
const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const otpGenerator = require('otp-generator');
const path = require('path');

// Corrected config path and destructured imports
const { adminCollection, stockCollection, orderCollection, OTPCollection } = require("./confnig");

let USERNAME = "";

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'hardbosamiya9b@gmail.com',
        pass: process.env.EMAIL_PASS || 'jsbw quqt tkul zoft'
    }
});

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Debug logs
console.log("Database Models Loaded:");
console.log("- adminCollection:", adminCollection ? "OK" : "Missing");
console.log("- stockCollection:", stockCollection ? "OK" : "Missing");
console.log("- orderCollection:", orderCollection ? "OK" : "Missing");
console.log("- OTPCollection:", OTPCollection ? "OK" : "Missing");

// Routes
app.get("/", async (req, res) => {
    try {
        const products = await stockCollection.find({}, { 
            image: 1, 
            buyingPrice: 1, 
            sellingPrice: 1, 
            productName: 1,
            productId: 1
        }).limit(100);

        res.render("home", { products, USERNAME });
    } catch (error) {
        console.error("Homepage error:", error);
        res.status(500).send("Error fetching products.");
    }
});

app.get("/logout", (req, res) => {
    USERNAME = "";
    res.send(`
        <html>
            <body>
                <p>Logging out...</p>
                <script>
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                </script>
            </body>
        </html>
    `);
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        if (req.body.which == 1) {
            const orders = await orderCollection.find({}, {
                _id: 1,
                userName: 1,
                productName: 1,
                quantity: 1,
                Address: 1,
                phoneNumber: 1
            });
            return res.render("orders", { orders });
        }

        if (req.body.which == 2) {
            const products = await stockCollection.find({}, { 
                _id: 1, 
                productName: 1, 
                quantity: 1, 
                buyingPrice: 1, 
                sellingPrice: 1, 
                category: 1, 
                quantityType: 1, 
                image: 1 
            });

            const modifiedProducts = products.map(product => ({
                ...product._doc,
                image: product.image ? `data:image/png;base64,${product.image.toString('base64')}` : null
            }));

            return res.render("myproduct", { products: modifiedProducts });
        }

        const user = await adminCollection.findOne({ name: req.body.name });
        if (!user) return res.send("User not found.");

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        
        if (isPasswordMatch) {
            USERNAME = req.body.name;
            return user.userType == "admin" ? res.render("admin") : res.redirect("/");
        } else {
            return res.send("Wrong password.");
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Error logging in.");
    }
});

// [Include all your other routes here...]
// (Signup, Admin, Order Placement, OTP, etc. - they remain exactly as you wrote them)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).send("Something broke!");
});

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
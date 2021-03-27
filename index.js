const express = require("express") ;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

app.use(cors());

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const userInfoRoute = require('./routes/userInfo');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT,
{ useNewUrlParser: true , useUnifiedTopology: true },
() => console.log("Connected to DB"))

// Middleware
app.use(express.json());
// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/user-info', userInfoRoute);
app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(process.env.PORT || 3000, () => console.log("Server is running"));
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const router = require("./routes/routes");

app.use(express.json());

app.use(router);
app.use((req, res, next) => {
    res.status(404).json({
        "error": "Invalid path, no such route found"
    })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
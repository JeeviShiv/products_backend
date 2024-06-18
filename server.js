require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5800
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const mongoose = require('mongoose')

const connectDB = require('./config/dbConn')
connectDB();

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended:true}));
app.use(express.json())

app.use('/assets/categories', express.static('assets/categories'))
app.use('/assets/products', express.static('assets/products'))

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))
app.use('/products', require('./routes/productRoutes'))
app.use('/category', require('./routes/categoryRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else {
        res.json({ message: '404 Not Found' })
    }
})
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})


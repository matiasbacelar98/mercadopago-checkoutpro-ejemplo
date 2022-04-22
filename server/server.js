const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { payProducts, returnInfoPayment } = require('./controllers');
const mercadopago = require('mercadopago');
const app = express();
const PORT = 5000;
const ACCESS_TOKEN_PAYMENTS = process.env.MERCADOPAGO_ACCESS_TOKEN_TEST;

// PARSE JSON
app.use(express.json());

// CORS
app.use(cors());

// ADD CREDENTIALS TO MERCADOPAGO
mercadopago.configure({
  access_token: ACCESS_TOKEN_PAYMENTS,
});

// ROUTES
app.post('/api/pay', payProducts);
app.post('/api/feedback', returnInfoPayment);

// RUN SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

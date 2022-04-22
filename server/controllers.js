const asyncHandler = require('express-async-handler');
const mercadopago = require('mercadopago');

const payProducts = asyncHandler(async (req, res) => {
  const { productItems } = req.body;

  const preference = {
    items: [...productItems],
    back_urls: {
      success: 'http://localhost:3000/',
      failure: 'http://localhost:3000/',
    },
    auto_return: 'approved',
    binary_mode: true,
  };

  const paymentResponse = await mercadopago.preferences.create(preference);
  const preferenceId = paymentResponse.body.id;

  res.send({ preferenceId });
});

const returnInfoPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;

  // FETCH informacion de pago
  const payment = await mercadopago.payment.findById(paymentId);

  const paymentData = {
    items: payment.body.additional_info.items,
    description: payment.body.description,
    order_id: payment.body.order.id,
    payer: [payment.body.payer.email, payment.body.payer.identification.number],
    payment_status: payment.body.status,
    amount: payment.body.transaction_amount,
    card_type: payment.body.payment_method_id,
  };

  // RETURN INFO
  res.json(paymentData);
});

module.exports = {
  payProducts,
  returnInfoPayment,
};

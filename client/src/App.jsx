import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentInfo = ({ info }) => {
  const {
    items,
    description,
    order_id,
    payer,
    payment_status,
    amount,
    card_type,
  } = info;

  return (
    <>
      <h2>Informacion de Pago</h2>
      <ul>
        <h3>Items</h3>
        {items.map(
          (
            item,
            key // EN UNA APP REAL, NO SE USA EL KEY !!!
          ) => (
            <li key={key}>
              {item.title} - {item.unit_price} - {item.quantity}
            </li>
          )
        )}
      </ul>

      <div style={{ margin: '2rem 0' }} />

      <p>{description}</p>
      <p>ID de compra : {order_id}</p>
      <p>{payment_status}</p>
      <p>{amount}</p>
      <p>{card_type}</p>

      <ul>
        <h3>Informacion Comprador</h3>
        {payer.map(
          (
            item,
            key // EN UNA APP REAL, NO SE USA EL KEY !!!
          ) => (
            <li key={key}>{item}</li>
          )
        )}
      </ul>
    </>
  );
};

function App() {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [searchParams] = useSearchParams();
  const paymentIdQueryString = searchParams.get('payment_id');

  useEffect(() => {
    const getPaymentInfo = async () => {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentIdQueryString }),
      });
      const data = await response.json();

      setPaymentInfo(data);
    };

    if (paymentIdQueryString) getPaymentInfo();
  }, []);

  const openPaymentModal = preferenceId => {
    const PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_KEY;

    const mp = new MercadoPago(PUBLIC_KEY, {
      locale: 'es-AR',
    });

    const checkout = mp.checkout({
      preference: {
        id: preferenceId, // Indica el ID de la preferencia
      },
    });

    // ABRIR MODAL
    checkout.open();
  };

  const payProducts = async () => {
    const productItems = [
      {
        title: 'Producto 1',
        unit_price: 100,
        quantity: 1,
        currency_id: 'ARS',
      },
      {
        title: 'Producto 2',
        unit_price: 200,
        quantity: 2,
        currency_id: 'ARS',
      },
    ];

    const response = await fetch('http://localhost:5000/api/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productItems }),
    });
    const { preferenceId } = await response.json();

    // CREATE MERCADOPAGO UI
    openPaymentModal(preferenceId);
  };

  return (
    <>
      <h1>Mercado Pago API - Integracion Checkout PRO</h1>
      <button type='button' onClick={payProducts}>
        Pay Products
      </button>

      <hr style={{ margin: '3rem 0' }} />

      {paymentInfo ? <PaymentInfo info={paymentInfo} /> : null}
    </>
  );
}

export default App;

import Head from 'next/head';
import { useEffect } from 'react';

import { loadStripe } from '@stripe/stripe-js';

import checkoutStyles from '../styles/Checkout.module.css';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function Checkout() {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log(
        'Order canceled -- continue to shop around and checkout when you’re ready.'
      );
    }
  }, []);
  return (
    <>
      <Head>
        <title>Console.job | Checkout</title>
      </Head>
      <div className={checkoutStyles.checkout_screen___container}>
        <h2 className={checkoutStyles.checkout_screen___title}>
          The job listing is ready. The final step is payment.
        </h2>
        <p className={checkoutStyles.checkout_screen___disclaimer}>
          By clicking checkout, you agree to the{' '}
          <a
            target='_blank'
            href='https://stripe.com/'
            rel='noopener noreferrer'
            style={{ textDecoration: 'none', color: '#e21865' }}
          >
            Terms of Service
          </a>
          , the{' '}
          <a
            target='_blank'
            href='https://stripe.com/'
            rel='noopener noreferrer'
            style={{ textDecoration: 'none', color: '#e21865' }}
          >
            Privacy Policy
          </a>{' '}
          and that all payment transactions will be handled through{' '}
          <span>
            <a
              target='_blank'
              href='https://stripe.com/'
              rel='noopener noreferrer'
              style={{ textDecoration: 'none', color: 'blue' }}
            >
              Stripe
            </a>
          </span>
          , and that you are an awsome person for supporting a small buisness!
        </p>
        <form action='/api/checkout_sessions' method='POST'>
          <section>
            <button
              type='submit'
              role='link'
              className={checkoutStyles.checout_screen__checkout_btn}
            >
              Checkout
            </button>
          </section>
        </form>
      </div>
    </>
  );
}

export default Checkout;

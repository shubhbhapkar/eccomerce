// PaymentForm.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;  // Stripe.js has not loaded yet

        setIsProcessing(true);

        // Create the token with card details
        const { token, error } = await stripe.createToken(elements.getElement(CardElement));

        if (error) {
            // Handle error (e.g., invalid card details)
            alert(error.message);
            setIsProcessing(false);
            return;
        }

        // Send the token to the backend to process the payment
        const response = await fetch('http://localhost:8000/create-charge/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stripe_token: token.id }),
        });

        const data = await response.json();
        
        if (data.status === 'succeeded') {
            alert('Payment succeeded!');
        } else {
            alert('Payment failed: ' + data.error);
        }
        
        setIsProcessing(false);
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="card-element">Card Details</label>
                <CardElement id="card-element" />
            </div>
            <button type="submit" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Pay'}
            </button>
        </form>
        </>
    );
};

export default PaymentForm;

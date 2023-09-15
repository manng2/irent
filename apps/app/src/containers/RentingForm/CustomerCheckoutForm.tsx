import {
    CardElement,
    LinkAuthenticationElement,
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@/components/Common/Button';
import { Spinner } from '@/components/Common/Spinner';
import { formatPrice } from '@/utils/format-price.util';

const Title = styled.div`
  margin-bottom: 20px;
`;

const Price = styled.span`
  font-weight: 700;
`;

const PayButton = styled(Button)`
  margin-top: 12px;
  border-radius: 5px;
  width: calc(100% - 30px);
`;

const Error = styled.div`
  margin-top: 12px;
`;

type CustomerCheckoutFormProp = {
    total: number;
    clientSecret: string;
    onSucceed?: () => void;
};

export function CustomerCheckoutForm(props: CustomerCheckoutFormProp) {
    const stripe = useStripe();
    const { total, clientSecret } = props;

    const [message, setMessage] = useState<string>('');
    const [isLoading, setLoading] = useState(false);
    const [isResponded, setResponded] = useState(false);

    const handleSubmit = async () => {
        if (!stripe) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setLoading(true);

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret);

        console.log(paymentIntent, error);

        switch (error?.type) {
            case undefined:
                break;
            case 'card_error':
            case 'validation_error':
                setMessage(error.message as string);
                break;
            default:
                break;
        }

        switch (paymentIntent?.status) {
            case undefined:
                break;
            case 'succeeded':
                setResponded(true);
                setMessage('Payment succeeded!');
                props.onSucceed?.();
                break;
            case 'processing':
                setResponded(true);
                setMessage('Your payment is processing.');
                break;
            case 'requires_payment_method':
                setResponded(true);
                setMessage('Your payment was not successful, please try again.');
                break;
            default:
                setMessage('Something went wrong.');
                break;
        }

        setLoading(false);
    };

    const paymentElementOptions: StripePaymentElementOptions = {
        layout: 'tabs',
    };

    return (
        <>
            {isResponded ? (
                <div>{message}</div>
            ) : (
                <div className="checkout-form">
                    <Title className="title">
                        You have to pay <Price>{formatPrice(total)} VND</Price>
                    </Title>
                    <div id="payment-form">
                        <PayButton disabled={isLoading || isResponded || !stripe} onClick={handleSubmit}>
                            {isLoading ? <Spinner innerSize={15} outerSize={25}></Spinner> : 'Pay now'}
                        </PayButton>
                        {message && <Error id="payment-message">{message}</Error>}
                    </div>
                </div>
            )}
        </>
    );
}

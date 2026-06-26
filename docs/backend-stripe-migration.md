# Backend: Migrate Stripe PaymentIntent to Checkout Session (ui_mode: custom)

## Current Implementation

The endpoint `POST /api/v1/orders/{orderId}/payment-intent` currently calls Stripe's `paymentIntents.create()` and returns `client_secret` + `publishable_key` to the frontend.

## Why Migrate

Per Stripe best practices, the recommended integration for embedded payment UI is **Checkout Sessions** with `ui_mode: 'custom'` rather than a raw PaymentIntent. This gives:

- Automatic tax calculation
- Promo code / coupon support
- Built-in shipping address collection
- Adaptive pricing
- Dynamic payment methods (enabled by default)
- No need to manually manage `payment_method_types` (Stripe handles it)

## Changes Required

### 1. Replace `paymentIntents.create()` with `checkout.sessions.create()`

```php
$session = \Stripe\Checkout\Session::create([
    'mode' => 'payment',
    'ui_mode' => 'custom',
    'line_items' => [
        [
            'price_data' => [
                'currency' => $order->currency,
                'product_data' => [
                    'name' => "Order #{$order->nanoId}",
                ],
                'unit_amount' => (int) (bcmul($order->total, '100')),
            ],
            'quantity' => 1,
        ],
    ],
    'customer_creation' => 'always',
    'metadata' => [
        'order_nano_id' => $order->nanoId,
    ],
]);
```

### 2. Return `client_secret` from the session

The frontend expects:

```json
{
  "data": {
    "client_secret": "{{SESSION_CLIENT_SECRET}}",
    "publishable_key": "{{STRIPE_PUBLISHABLE_KEY}}"
  }
}
```

The Checkout Session's `client_secret` is available as `$session->client_secret` (note: this differs from `$session->payment_intent->client_secret`).

### 3. Key Rules (Stripe Best Practices)

- **Do NOT** pass `payment_method_types` — omit it entirely. Dynamic payment methods are the default.
- **Do NOT** create a PaymentIntent separately — the Checkout Session handles this internally.
- Use `mode: 'payment'` for one-time payments (not `subscription` or `setup`).
- The `ui_mode: 'custom'` parameter enables embedded UI with the Payment Element (current frontend pattern).

### 4. Frontend Impact

**No frontend changes needed.** The frontend's `StripePaymentPage` already calls `getPaymentIntent(orderId, bizId)` and uses the returned `clientSecret` + `publishableKey` with `<Elements>` + `<PaymentElement>`. The Checkout Session's `client_secret` is compatible with the same frontend flow.

The frontend calls `stripe.confirmPayment()` which works identically with a Checkout Session client_secret.

### 5. Verify

After deploying:

1. Place an order
2. Navigate to `/checkout/{orderId}/payment`
3. The Payment Element should render with the brand theme (already configured in frontend)
4. Complete payment → should redirect to `/checkout/success?orderId=...`
5. Stripe Dashboard should show a Checkout Session (not just a PaymentIntent)

## Resources

- [Checkout Sessions API](https://docs.stripe.com/api/checkout/sessions/create)
- [Custom checkout (ui_mode: custom)](https://docs.stripe.com/payments/checkout/custom)
- [Dynamic payment methods](https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods)

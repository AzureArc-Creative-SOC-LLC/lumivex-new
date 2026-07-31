# Central Order Management — API Documentation

**Base URL:** `https://www.microservices.tech`

This microservice exposes a REST/JSON API for order creation, payments (Klyme,
AabanPay, and manual bank-transfer capture), authentication, affiliate/wallet
features, an AI assistant, and several data-collection utilities.

> All paths below are relative to the base URL, e.g.
> `POST https://www.microservices.tech/api/user-orders`.

---

## Table of contents

1. [Global conventions](#1-global-conventions)
2. [Health & meta](#2-health--meta)
3. [Authentication](#3-authentication)
4. [Wallet & affiliate](#4-wallet--affiliate)
5. [Promo codes](#5-promo-codes)
6. [Products — Klyme availability](#6-products--klyme-availability)
7. [Orders](#7-orders)
8. [Manual payment capture](#8-manual-payment-capture)
9. [Klyme payments](#9-klyme-payments)
10. [AabanPay payments](#10-aabanpay-payments)
11. [Bot check (Fengyu)](#11-bot-check-fengyu)
12. [Client IP utilities](#12-client-ip-utilities)
13. [AI chat](#13-ai-chat)
14. [Data-collection utilities](#14-data-collection-utilities)
15. [Newsletter](#15-newsletter)

---

## 1. Global conventions

### Content types
- JSON endpoints expect `Content-Type: application/json`. The JSON body limit is **5 MB**.
- File-upload endpoints expect `multipart/form-data` (field names are exact and case-sensitive — see each endpoint).
- There is **no** `express.urlencoded` parser; plain URL-encoded form bodies are not parsed globally (multipart form fields are parsed per-route).

### CORS
- Controlled by the server's `CORS_ORIGIN` env var, currently set to `*` → **all origins are allowed**, for both requests and responses.
- `credentials: true` (cookies / `Authorization` header are permitted).
- Default methods `GET, HEAD, PUT, PATCH, POST, DELETE`; preflight (`OPTIONS`) is handled for all routes.

### Authentication
Only a small set of endpoints require auth. They expect a **JWT** in the header:

```
Authorization: Bearer <token>
```

- Token is obtained from `POST /api/auth/login` or `POST /api/auth/register`.
- Payload: `{ id, email, role }`; **expires in 30 days**; algorithm `HS256`.
- Middleware failures return **HTTP 401**:
  - `{ "error": "Missing token" }` — no/empty Bearer token
  - `{ "error": "Invalid token" }` — bad/expired token or invalid `id`

**Endpoints requiring auth:** `GET /api/wallet`, `GET /api/affiliate/status`,
`POST /api/affiliate/request`, `GET /api/affiliate/dashboard`,
`GET /api/auth/verify` (plus their path aliases). **Everything else is public** —
no token is read. (If you front this service with an API gateway, that gateway
is responsible for any additional access control.)

### Error response shapes
There is **no single error envelope** — the shape varies by area. Always branch defensively:

| Area | Typical shape |
|---|---|
| Auth / orders / lookups | `{ "error": "<message>" }` |
| Wallet / affiliate / promo / payments | `{ "ok": false, "error": "<message>" }` |
| Upload / verification utilities | `{ "message": "<message>" }` |

Success responses similarly use `success: true`, `ok: true`, or a bare payload depending on the endpoint. Each endpoint below documents its exact shapes.

### Rate limits
Only two endpoints are rate-limited (per client IP):
- `POST /api/ai-chat` — 15 requests / 60 seconds
- `POST /api/newsletter/subscribe` — 5 submissions / hour

No other endpoints are throttled.

### Notes
- Currency is always **USD** server-side.
- Client IP is derived from proxy headers server-side; never send it yourself.
- There is no global 404/error handler — unmatched routes return Express's default 404 HTML.

---

## 2. Health & meta

### `GET /health` &nbsp;·&nbsp; `GET /api/user-orders/health`
Liveness + DB ping. **Auth:** none. No params.

**200**
```json
{ "ok": true, "service": "user-order-creation", "db": "connected" }
```
**500** (DB unreachable)
```json
{ "ok": false, "service": "user-order-creation", "db": "disconnected", "error": "<message>" }
```

### `GET /api/user-orders` &nbsp;·&nbsp; `GET /api/user-orders/`
Guard route — order creation is a **POST**. Always returns **405** with header `Allow: POST`:
```json
{ "ok": false, "error": "Method Not Allowed. Use POST /api/user-orders to create an order.", "service": "user-order-creation" }
```

---

## 3. Authentication

### `POST /api/auth/register`
Creates a user (or **overwrites** an existing user with the same email — it does not reject duplicates). **Auth:** none. JSON body:

| Field | Type | Required |
|---|---|---|
| `name` | string | ✅ |
| `email` | string | ✅ |
| `password` | string | ✅ |
| `date_of_birth` | string (date) | ✅ |
| `nationality` | string | ✅ |
| `country_of_residence` | string | ✅ |

**201**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {
    "id": 42, "name": "Jane Doe", "email": "jane@example.com",
    "phone": null, "date_of_birth": "1990-05-14",
    "nationality": "Canadian", "country_of_residence": "Canada", "role": "user"
  }
}
```
**Errors:** `400 {"error":"Name, email and password are required"}` ·
`400 {"error":"Date of birth, nationality and country of residence are required"}` ·
`500 {"error":"Registration failed"}`

### `POST /api/auth/login`
**Auth:** none. JSON body: `email` (✅), `password` (✅).

**200** — same `{ success, token, user }` shape as register (`user` exposes exactly the 8 fields: `id, name, email, phone, date_of_birth, nationality, country_of_residence, role`; no password hash).

**Errors:** `400 {"error":"Email and password are required"}` ·
`401 {"error":"Invalid credentials"}` ·
`503 {"error":"Login temporarily unavailable. Please try again."}` (DB/bcrypt timeout) ·
`500 {"error":"Login failed"}`

### `GET /api/auth/verify`
Validates a JWT and returns the current DB user. **Auth:** required (`Authorization: Bearer <token>`). No body.

**200**
```json
{ "success": true, "user": { "id": 42, "name": "Jane Doe", "email": "jane@example.com", "phone": "+1555...", "date_of_birth": "1990-05-14", "nationality": "Canadian", "country_of_residence": "Canada", "role": "user" } }
```
**Errors:** `401 {"error":"Missing token"}` · `401 {"error":"Invalid token"}` ·
`401 {"error":"User not found"}` · `500 {"error":"Verify failed"}`

### `POST /api/auth/forgot-password`
Emails a reset link if the account exists (always returns success to prevent account enumeration). **Auth:** none. JSON body: `email` (✅).

**200** — `{ "success": true, "message": "Password reset link has been sent to your email." }`
(non-existent email returns `{ "success": true, "message": "If an account exists with this email, a password reset link has been sent." }`)

**Errors:** `400 {"error":"Email is required"}` · `500 {"error":"Failed to process password reset request"}`

> Email delivery is currently disabled in this deployment (no-op email layer), so reset emails will not actually arrive until email is configured.

### `POST /api/auth/reset-password`
Consumes the emailed reset token. **Auth:** none. JSON body:

| Field | Type | Required | Notes |
|---|---|---|---|
| `token` | string | ✅ | hex token from the reset link |
| `password` | string | ✅ | **min 6 characters** |

**200** — `{ "success": true, "message": "Password has been reset successfully" }`

**Errors:** `400 {"error":"Token and password are required"}` ·
`400 {"error":"Password must be at least 6 characters long"}` ·
`400 {"error":"Invalid or expired reset token"}` · `500 {"error":"Failed to reset password"}`

---

## 4. Wallet & affiliate

All endpoints in this section **require** `Authorization: Bearer <token>` and identify the user from the token (no user id in the body). Each has multiple aliases that hit the same handler — use whichever fits your routing.

### `GET /api/wallet`
Aliases: `/api/auth/wallet`, `/api/user-orders/wallet`. No params.

**200**
```json
{
  "success": true,
  "balance": 42.5,
  "ledger": [
    { "amount": 40, "source": "affiliate_reward", "order_number": "ORD-10231",
      "admin_username": null, "note": "Referral reward", "created_at": "2026-06-20T14:33:10.000Z" }
  ]
}
```
`ledger` = up to 50 most recent entries, newest first. **Errors:** `401` (auth) · `500 {"ok":false,"error":"Failed to load wallet"}`

### `GET /api/affiliate/status`
Alias: `/api/auth/affiliate/status`. No params.

**200** (no request): `{ "ok": true, "hasRequest": false }`
**200** (exists):
```json
{ "ok": true, "hasRequest": true,
  "request": { "id": 17, "status": "approved", "promo_code": "AJOHN10",
    "promo_percent": 10, "created_at": "...", "decided_at": "..." } }
```
**Errors:** `401` · `500 {"ok":false,"error":"Failed to load affiliate status"}`

### `POST /api/affiliate/request`
Alias: `/api/auth/affiliate/request`. Submits an affiliate request — **auto-approves** and issues a promo code. Email taken from JWT. JSON body:

| Field | Type | Required | Validation |
|---|---|---|---|
| `first_name` | string | ✅ | non-empty, ≤64 |
| `last_name` | string | ✅ | non-empty, ≤64 |
| `tiktok_link` | string | ✅ | ≤255; must contain `tiktok.com` or start with `@` |

**200** (newly approved):
```json
{ "ok": true, "approved": true, "status": "approved", "promo_code": "AJOHN10", "promo_percent": 10, "reward_amount": 40 }
```
**200** (already requested):
```json
{ "ok": true, "alreadyRequested": true, "status": "pending", "promo_code": "AJOHN10", "promo_percent": 10, "reward_amount": 40 }
```
**Errors:** `401` · `400 {"ok":false,"error":"Missing user email"}` ·
`400` for `First name is required` / `Last name is required` / `TikTok link is required` /
`TikTok link must contain tiktok.com or start with @` ·
`500 {"ok":false,"error":"Failed to request affiliate"}`

### `GET /api/affiliate/dashboard`
Alias: `/api/auth/affiliate/dashboard`. No params.

**200** (not an affiliate): `{ "ok": true, "is_affiliate": false }`
**200** (affiliate):
```json
{
  "ok": true, "is_affiliate": true,
  "promo_code": "AJOHN10", "promo_percent": 10, "reward_amount": 40, "status": "approved",
  "first_name": "John", "last_name": "Doe", "tiktok_link": "@johndoe",
  "wallet_balance": 80.0, "total_earned": 120.0, "unique_customers": 3,
  "recent_redemptions": [
    { "order_number": "ORD-10231", "customer_email_masked": "j***@example.com",
      "reward_amount": 40, "created_at": "2026-06-20T14:33:10.000Z" }
  ]
}
```
`recent_redemptions` is capped at 10; customer emails are masked. **Errors:** `401` · `500 {"ok":false,"error":"Failed to load affiliate dashboard"}`

---

## 5. Promo codes

### `POST /api/promos/validate`
Alias: `/api/auth/promos/validate`. **Auth:** none. JSON body — send `code` (or `promoCode` as fallback); value is trimmed and upper-cased.

**200** — `{ "ok": true, "valid": true, "percent": 10 }`

**Errors:** `400 {"ok":false,"error":"code is required"}` ·
`404 {"ok":false,"valid":false}` (unknown code) ·
`500 {"ok":false,"error":"Failed to validate promo"}`

---

## 6. Products — Klyme availability

Three public POST endpoints that return whether Klyme checkout is enabled per product. **Auth:** none. Each returns `{ "klyme_settings": { <key>: <boolean> } }`. Certain products are hard-coded to always return `true`. Unknown keys default to `false`.

| Endpoint | Body field | Key casing in response |
|---|---|---|
| `POST /api/products/klyme-status` | `product_ids` (string[]) | as-sent (lowercased slugs) |
| `POST /api/products/klyme-status-by-sku` | `product_skus` (string[]) | **UPPERCASE** |
| `POST /api/products/klyme-status-by-name` | `product_names` (string[]) | lowercase, whitespace-collapsed |

Each array must contain ≥1 non-empty value.

**200**
```json
{ "klyme_settings": { "retatrutide-20mg": true, "some-other-product": false } }
```
**Errors:** `400 {"error":"Product IDs array is required"}` (or `SKUs`/`names` variant) ·
`500 {"error":"Failed to check products Klyme status"}`

---

## 7. Orders

> ⚠️ **None of the order endpoints require authentication.**

### `POST /api/user-orders` — create order (primary)
Alias: `POST /api/user-orders/`. **Auth:** none.

**Content-Type:** `multipart/form-data` if attaching a screenshot, otherwise `application/json` works too (the file is optional; everything else is read from the body).

**File field:** `paymentScreenshot` — single file, **max 25 MB**, no type filter. When present, the server sets `screenshotFilename`/`screenshotUrl` for you.

**Body fields** (with multipart, all scalars arrive as strings):

*Customer*
| Field | Required | Notes / aliases |
|---|---|---|
| `email` | ✅ | must contain `@`; alias `customerEmail` |
| `firstName`, `lastName` | — | combined into the name |
| `customerName` | — | overrides first/last; defaults `"Customer"` |
| `phone` | — | alias `customerPhone` |

*Shipping*
| Field | Aliases |
|---|---|
| `address` | `shippingAddress` |
| `city` | `shippingCity` |
| `postcode` | `shippingZip` |
| `country` | `shippingCountry` |

*Order identity / timing*
| Field | Notes |
|---|---|
| `orderId` / `orderNumber` | desired order number; server generates one if omitted/colliding |
| `createdAtIso` | ISO date for `created_at`; defaults to now |

*Money* (numbers or numeric strings)
| Field | Aliases / notes |
|---|---|
| `subtotal`, `total` | |
| `discountAmount` | `discount_amount` |
| `promoCode` | `promo_code`; `""`, `-`, `none` mean no promo |
| `promoDiscount` | `promo_discount_percent`; a percent |

*Items* — send **either**:
1. `itemsArray` — JSON array of item objects (preferred; JSON-stringify it under multipart), or
2. `items` / `itemsText` — string `"Name xQTY @ $PRICE | Name2 xQTY @ $PRICE"`.

Item object shape:
| Field | Required | Notes / aliases |
|---|---|---|
| `name` | ✅ per item | alias `title`; nameless items skipped |
| `quantity` | — | alias `qty`; default 1 |
| `unitPrice` | — | falls back to `priceNumber`, then `price`; default 0 |
| `productId` | — | aliases `product_id`, `id`; unknown numeric IDs stored as NULL |
| `sku` | — | falls back to `id`, then a name slug |

*Payment method*
| Field | Notes |
|---|---|
| `payment_method` | aliases `paymentMethod`, `provider`, `payment_provider`; `"manual"` forces the manual capture-link flow |
| `providerId` | provider reference; defaults `CHECKOUT-<orderNumber>` |

**200** (note: 200, not 201)
```json
{
  "success": true,
  "orderId": 12345,
  "orderNumber": "ORD-1001",
  "email_debug": {
    "paymentLinkCreated": true,
    "orderConfirmation": { "attempted": false, "ok": false, "error": null },
    "paymentCapture": { "attempted": false, "ok": false, "error": null }
  }
}
```
`orderId` = numeric DB id; `orderNumber` = canonical string id (the server may assign its own even if you sent one). Email/payment-link failures do **not** fail the request.

**Errors:** `403 {"success":false,"error":"<message>"}` (customer blacklisted) ·
`500 {"success":false,"error":"<message>"}` (e.g. `Missing/invalid required field: email`, DB errors)

### `POST /api/central/orders` — details-only intake
Aliases: `/api/user-orders/central`, `/api/user-orders/collect`, `/api/orders/collect`. **Auth:** none. For sites that collect order details and take **no on-site payment**; always stored as pending `Manual`. **Content-Type:** `application/json` (nested shape):

```json
{
  "customer":        { "firstName": "", "lastName": "", "email": "", "mobile": "" },
  "shippingAddress": { "line1": "", "line2": "", "city": "", "postcode": "", "country": "" },
  "promoCode":       "VORA10",
  "items":           [ { "name": "", "price": 0, "qty": 1 } ],
  "subtotal": 0, "shipping": 0, "discount": 0, "total": 0
}
```
Required: `customer.email` (must contain `@`) and ≥1 `items` entry (each item needs a `name`). Many aliases are accepted (e.g. `email` top-level, `zip`/`postalCode` for postcode, `itemsArray` for items).

**201**
```json
{
  "ok": true, "success": true, "orderNumber": "ORD-1002", "orderId": 12346,
  "status": "pending", "paymentStatus": "pending", "paymentMethod": "Manual",
  "totals": { "subtotal": 100.00, "shipping": 5.00, "discount": 10.00, "total": 95.00 },
  "message": "Order received. No on-site payment was taken; the order is recorded as pending."
}
```
**Errors:** `400 {"ok":false,"error":"Missing or invalid customer.email"}` ·
`400 {"ok":false,"error":"At least one item is required"}` ·
`400` for blacklist/missing-field messages · `500 {"ok":false,"error":"<message>"}`

### `GET /api/user-orders/by-email?email=<email>`
**Auth:** none. Returns up to 200 orders (newest first).

**200** — `{ "orders": [ /* full orders rows */ ] }`
**Errors:** `400 {"error":"Valid email is required"}` · `500 {"error":"<message>"}`

### `GET /api/user-orders/:orderNumber`
**Auth:** none.

**200**
```json
{ "order": { /* orders row */ }, "items": [ /* order_items */ ], "payments": [ /* payments */ ] }
```
**Errors:** `400 {"error":"orderNumber is required"}` ·
`404 {"error":"Order not found"}` · `500 {"error":"<message>"}`

### `PUT /api/user-orders/:orderNumber`
**Auth:** none. JSON body — only these updatable fields (include at least one): `status`, `payment_status`, `tracking_number`.

**200** — `{ "success": true }`
**Errors:** `400 {"error":"orderNumber is required"}` ·
`400 {"error":"No updatable fields provided"}` ·
`404 {"error":"Order not found"}` · `500 {"error":"<message>"}`

### `DELETE /api/user-orders/:orderNumber`
**Auth:** none. No body.

**200** — `{ "success": true }`
**Errors:** `400 {"error":"orderNumber is required"}` ·
`404 {"error":"Order not found"}` · `500 {"error":"<message>"}`

---

## 8. Manual payment capture

Flow for orders paid by bank transfer: the customer receives an emailed link
containing an opaque **`token`**, which authorizes these three endpoints
(no `Authorization` header involved). All use the `{ "ok": boolean, ... }` envelope.

> Token validation errors can be **400 or 404** (e.g. `Invalid or expired link`,
> `Order not found`) — handle both as "invalid link" on the client.

### `POST /api/payment-capture/validate`
JSON body: `token` (✅). Returns order, items, payments, promo eligibility, and bank details.

**200**
```json
{
  "ok": true,
  "order": { /* orders row */ },
  "items": [ /* order_items */ ],
  "payments": [ /* payments */ ],
  "allowPromo": true,
  "bank": { "payeeName": "1066 Detailing Ltd", "sortCode": "60-83-82", "accountNumber": "46672542", "reference": "Beauty" }
}
```
`allowPromo` is `true` only if no promo is applied yet and there's no bundle item.
**Errors:** `{ "ok": false, "error": "<reason>" }` with status 400/404 (token reasons) or 500.

### `POST /api/payment-capture/apply-promo`
JSON body: `token` (✅), `promoCode` (✅, upper-cased server-side).

**200**
```json
{ "ok": true, "promoCode": "SAVE10", "promoDiscountPercent": 10, "discountAmount": 5.00, "total": 45.00 }
```
**Errors (all `{ "ok": false, "error": ... }`):** `400 code/promo required` ·
`400 Invalid promo code` · `400 Promo codes cannot be applied to bundle products` ·
`400 Promo already applied` · token validation 400/404 · `500 Failed to apply promo`

### `POST /api/payment-capture/upload`
**Content-Type:** `multipart/form-data`.
- File field `paymentScreenshot` (✅, single, **max 25 MB**, no type filter)
- Form field `token` (✅)

Saves the screenshot, runs verification, and sets payment status.

**200**
```json
{
  "ok": true,
  "screenshotUrl": "https://www.microservices.tech/uploads/JohnDoe-ORD123.jpg",
  "screenshotFilename": "JohnDoe-ORD123.jpg",
  "verification": { /* verify result, or null */ },
  "payment_status": "received"
}
```
> ⚠️ A `200`/`ok:true` does **not** mean approved — read `payment_status`:
> `received` (approved), `rejected`, or `pending` (verification unavailable; response
> also includes `"verification_error"`).

**Errors:** `400 token is required` · `400 paymentScreenshot file is required` ·
token validation 400/404 · `500 Failed to update payment status` (may include `verification`) · `500 Upload failed`

---

## 9. Klyme payments

Hosted card payments. **None require auth.** The frontend calls **create-payment**
and **verify-payment**; the **webhook** is gateway-to-server only.

### `POST /api/klyme/create-payment`
JSON body:
| Field | Required | Notes |
|---|---|---|
| `orderId` | ✅ | matched against `order_number` |
| `amount` | ✅ | `Number(amount)`; may be overridden by credit logic |
| `currency` | — | default `USD` |

Customer details are read from the stored order, not the body.

**200 (A) — normal Klyme payment**
```json
{ "ok": true, "paymentUuid": "f7c2a9e1-...", "orderId": "ALU-100237", "klymeEnv": "production" }
```
> ⚠️ **No redirect/payment URL is returned** — only `paymentUuid`. The server
> configures Klyme to redirect the user to `${FRONTEND_URL}/checkout/klyme-callback`
> after payment. Use `paymentUuid` to launch the Klyme flow and to call verify-payment
> on the callback page. (If you need the hosted-payment URL itself, confirm with backend —
> it is persisted server-side but not returned.)

**200 (B) — fully paid by store credits (Klyme skipped)**
```json
{ "ok": true, "paidByCredits": true, "orderId": "ALU-100237", "klymeEnv": "production" }
```
**Errors (all `{ "ok": false, "error": ... }`):**
`500 Klyme credentials not configured (...)` ·
`400 Missing required fields: orderId, amount` (includes `klymeEnv`) ·
`404 Order not found` · `<klyme status or 500>` on Klyme failure ·
`500 Klyme did not return payment UUID` · `500 Failed to create payment`

### `POST /api/klyme/webhook`
Called by the Klyme gateway (not the frontend). **Always returns 200** so Klyme won't retry:
```json
{ "ok": true, "status": "success" }
```
or `{ "ok": true, "ignored": true, "reason": "Missing payment UUID" | "Payment session not found" | "Webhook processing failed" }`.

### `GET /api/klyme/verify-payment/:uuid`
Re-checks status against Klyme and updates the order. Call from the callback page with the `paymentUuid`.

**200**
```json
{
  "ok": true,
  "session": { "uuid": "f7c2a9e1-...", "status": "success", "orderId": 12345 },
  "payment": { "status": "success", "finalStatus": "PAYMENT_COMPLETE", "amount": "19.99", "currency": "USD" },
  "klyme": { /* raw Klyme status, or null */ }
}
```
Branch UI on `session.status`: `success` | `failed` | `pending`. `payment` may be `null`.
**Errors:** `400 {"ok":false,"error":"Missing payment UUID"}` ·
`404 {"ok":false,"error":"Payment session not found"}` ·
`500 {"ok":false,"error":"Verification failed"}`

---

## 10. AabanPay payments

Two flows: **hosted redirect** (`create-payment` → redirect → webhook + verify polling)
and **direct card charge** (`charge` → optional 3DS → `callback`). **None require auth.**
Provider base: `AABANPAY_API_URL` (default `https://aabanpay.com/rest/api`). All JSON
responses use `{ "ok": ... }` except `callback` (redirects/plain text).

### `POST /api/aabanpay/create-payment`
Alias: `/api/user-orders/aabanpay/create-payment`. JSON body:
| Field | Required | Notes |
|---|---|---|
| `orderId` | ✅ | matched against `order_number` |
| `amount` | ✅ | `Number(amount).toFixed(2)` |
| `currency` | — | default `USD` |
| `returnUrl` | — | default `${FRONTEND_URL}/checkout/aabanpay-callback?status=success` |
| `cancelUrl` | — | default `${FRONTEND_URL}/checkout/aabanpay-callback?status=cancelled` |

**200**
```json
{ "ok": true, "sessionId": "sess_abc123", "paymentUrl": "https://aabanpay.com/pay/sess_abc123", "orderId": "ORD-100245" }
```
`paymentUrl` is the redirect target for the browser. **Errors:**
`500 AabanPay API key not configured` · `400 Missing required fields: orderId, amount` ·
`404 Order not found` · `400 Order not eligible for AabanPay` ·
`<provider status> AabanPay API error: <status>` ·
`500 AabanPay did not return session details` · `500 Failed to create payment`

### `POST /api/aabanpay/webhook`
Alias: `/api/user-orders/aabanpay/webhook`. Gateway-to-server. **Always 200:**
`{ "ok": true, "status": "success" | "pending" | "failed" }` or
`{ "ok": true, "ignored": true, "reason": "Missing session ID" | "Payment session not found" | "Webhook processing failed" }`.

### `GET /api/aabanpay/verify-payment/:sessionId`
Alias: `/api/user-orders/aabanpay/verify-payment/:sessionId`. Re-queries the provider live.

**200**
```json
{
  "ok": true,
  "session": { "sessionId": "sess_abc123", "status": "success", "orderId": 4521 },
  "payment": { "status": "success", "finalStatus": "completed" },
  "aabanpay": { /* raw provider response */ }
}
```
Status values normalize to `success` | `failed` | `pending`. **Errors:**
`400 Missing session ID` · `500 AabanPay API key not configured` ·
`404 Payment session not found` · `<provider status> AabanPay API error: <status>` ·
`500 Verification failed`

### `POST /api/user-orders/aabanpay/charge` (no alias)
Direct card charge. Card data is never logged/stored. JSON body:
| Field | Required | Notes |
|---|---|---|
| `orderId` | ✅ | matched against `order_number` |
| `cardNumber` | ✅ | |
| `cardType` | ✅ | `visa` / `mastercard` / `amex` / `discover` |
| `expMonth` | ✅ | |
| `expYear` | ✅ | 2-digit expanded to `20YY` |
| `cvv` | ✅ | |

**200 (approved)**
```json
{ "ok": true, "status": "APPROVED", "transactionId": "txn_789", "descriptor": "ALLUVI*STORE" }
```
**200 (3DS required)**
```json
{ "ok": true, "status": "3DS", "transactionId": "txn_789", "descriptor": "ALLUVI*STORE", "threeDsUrl": "https://aabanpay.com/3ds/txn_789" }
```
Redirect the browser to `threeDsUrl`; the provider then hits the callback below.
**Errors:** `500 AabanPay API key not configured` · `400 orderId is required` ·
`400 Missing card fields` · `400 Invalid cardType (...)` · `404 Order not found` ·
`400 Order not eligible for AabanPay` · `502 AabanPay request failed (<status>)` ·
`400 {"ok":false,"status":"DECLINED","error":"<reason>","provider":...}` · `500 Charge failed`

### `GET /api/user-orders/aabanpay/callback` (no alias)
Browser redirect target after 3DS. Returns **HTTP 302 redirects, not JSON.** Query param `order_id` (✅).

| Provider status | Redirect target |
|---|---|
| approved/success/completed | `${FRONTEND_URL}/payment-completed?order=<id>&amount=<$total currency>` |
| declined/failed/rejected/cancelled | `${FRONTEND_URL}/payment-review?order=<id>&amount=...&reason=<reason>` |
| other | `${FRONTEND_URL}/payment-review?order=<id>&amount=...&reason=Payment status: <status>` |

**Errors (plain text):** `400 Missing order_id` · `502 Failed to fetch transaction` ·
`404 Transaction not found` · `404 Order not found` · `500 Callback failed`

---

## 11. Bot check (Fengyu)

### `POST /api/fengyu/check` &nbsp;·&nbsp; `POST /api/user-orders/fengyu/check`
Server-side proxy to the Fengyu visitor/bot-detection API. **Auth:** none. JSON body:

| Field | Type | Required |
|---|---|---|
| `userAgent` | string | ✅ |
| `visitUrl` | string | ✅ |
| `timestamp` | number | ✅ |
| `clientLanguage` | string | — |
| `referer` | string | — |

Do **not** send `clientIp` — it's computed server-side. The proxy **passes through the upstream Fengyu status code and JSON body verbatim** (treat the success body as Fengyu's own schema).

**Errors:** `405 {"error":"Method not allowed"}` ·
`400 {"error":"Missing required fields","required":["userAgent","visitUrl","timestamp"]}` ·
upstream error passthrough · `503 {"error":"Service unavailable","message":"Failed to connect to Fengyu API"}` ·
`500 {"error":"Internal server error","message":"<msg>"}`

---

## 12. Client IP utilities

All **public**, no params. Resolution order: `cf-connecting-ip` → `true-client-ip` → `x-real-ip` → `x-forwarded-for` (first) → socket address.

### `GET /api/client-ip` &nbsp;·&nbsp; `GET /api/user-orders/client-ip`
**200** — `{ "ip": "203.0.113.45", "source": "server", "headers": { ... } }`
Fallback `{ "ip": "8.8.8.8", "source": "fallback", "warning": "Invalid IP format detected" }`;
error `500 { "ip": "8.8.8.8", "source": "error", "error": "Failed to get client IP" }`.

### `GET /api/test-ip`
Diagnostic variant. **200** — `{ "success": true, "clientIp": "...", "timestamp": "...", "headers": { ... } }`;
error `500 { "success": false, "error": "Failed to test IP detection" }`.

---

## 13. AI chat

### `POST /api/ai-chat`
RAG peptide assistant (Gemini primary, HuggingFace fallback). **Auth:** none.
**Rate limit: 15 requests / IP / 60s.** JSON body:

| Field | Type | Required | Notes |
|---|---|---|---|
| `message` | string | ✅ | non-empty, **max 1000 chars** |
| `history` | array | — | last 6 used; items `{ "role": "user"\|"assistant", "text": "..." }` |

(Any 5+ digit sequence in `message` is auto-checked against the anti-counterfeit seal DB and folded into the answer.)

**200**
```json
{
  "reply": "Retatrutide (LY-3437943) is a triple agonist ...",
  "sources": [ { "id": "retatrutide-overview", "title": "Retatrutide Overview" } ],
  "provider": "gemini"
}
```
**Errors:** `503 {"error":"AI chat is not configured"}` ·
`429 {"error":"Too many requests. Please wait a moment."}` ·
`400 {"error":"Message is required"}` · `400 {"error":"Message too long (max 1000 chars)"}` ·
`502 {"error":"AI service temporarily unavailable. Please try again."}` ·
`500 {"error":"Failed to process chat message"}`

### `GET /api/ai-chat/suggestions`
**Auth:** none. Static list, always **200**:
```json
{ "suggestions": [ "What is Retatrutide and how does it work?", "Compare Retatrutide vs Tirzepatide", "What research exists on BPC-157?", "Tell me about the Glow product", "How should peptides be stored for research?", "What products does Alluvi have in stock?" ] }
```

---

## 14. Data-collection utilities

Public utilities for image/fingerprint capture. **No auth** (one delete endpoint uses a password in the body). Multipart field names are exact/case-sensitive.

> Caution: several of these return **200 even if the DB write fails** (file is still
> saved), and the list endpoints return an empty array instead of an error. A 200 here
> does not guarantee a persisted row.

### `POST /api/user-orders/spot-a-fake/submit`
`multipart/form-data`. File field `images` (up to **10**, any `image/*`, **25 MB** each).
Fields: `latitude` (✅), `longitude` (✅), `accuracy`, `timestamp`, `userAgent`, `existingSubmissionId` (append to existing).
**200** — `{ "success": true, "submissionId": "SAF-..." }`
**Errors:** `400 {"message":"Location data is required."}` · `500 {"message":"Submission failed."}`

### `GET /api/user-orders/spot-a-fake/submissions`
200 most recent. **200** — `{ "submissions": [ { id, submission_id, latitude, longitude, accuracy, location_timestamp, user_agent, image_paths: [...], ip_address, created_at } ] }`.
Error: `500 {"message":"Failed to fetch submissions."}`.

### `POST /api/user-orders/train-model/upload`
`multipart/form-data`. File field `photos` (up to **50**; `jpeg/jpg/png/gif/heic/heif/webp`; **15 MB** each).
Fields: `email`, `userAgent`.
**200** — `{ "success": true, "sessionId": "TM-...", "count": 12 }`
**Errors:** `400 {"message":"No photos uploaded."}` · `500 {"message":"Upload failed. Please try again."}`

### `POST /api/user-orders/verify-product/upload`
`multipart/form-data`. File field `photo` (single; same image types; **15 MB**).
Fields: `email`, `userAgent`, `latitude`, `longitude`, `accuracy`, `locationTimestamp`.
**200** — `{ "success": true, "submissionId": "VP-..." }`
**Errors:** `400 {"message":"No image uploaded."}` · `500 {"message":"Upload failed. Please try again."}`
(Uploaded files are served at `/uploads/verify-product/<filename>`.)

### `GET /api/user-orders/verify-product/submissions`
200 most recent. **200** — `{ "submissions": [ { id, submission_id, email, image_filename, latitude, longitude, accuracy, location_timestamp, user_agent, ip_address, created_at } ] }`. Returns `{ "submissions": [] }` on error (no error status).

### `POST /api/user-orders/verify-product/delete`
`application/json`. Body: `password` (✅, must equal the admin password) + `id` (✅, the row id).
**200** — `{ "success": true }`
**Errors:** `403 {"message":"Incorrect password."}` · `400 {"message":"Missing submission id."}` ·
`404 {"message":"Submission not found."}` · `500 {"message":"Delete failed."}`

### `POST /api/user-orders/fingerprint/collect`
`application/json`. A flat object of browser/device fingerprint fields (all optional; whole body also stored as `full_data`). Recognized camelCase fields include `os`, `osVersion`, `browser`, `browserVersion`, `isMobile`, `isTablet`, `screenWidth`, `screenHeight`, `devicePixelRatio`, `cpuCores`, `deviceMemory`, `timezone`, `language`, `gpuVendor`, `gpuRenderer`, `canvasHash`, `userAgent`, `platform`, `webdriver`, etc.
**Always 200** — `{ "ok": true }` (no error responses).

### `GET /api/user-orders/fingerprint/list`
200 most recent, full rows (`full_data` is the original posted JSON). **200** — `{ "fingerprints": [ ... ] }`. Returns `{ "fingerprints": [] }` on error.

---

## 15. Newsletter

### `POST /api/newsletter/subscribe`
Public giveaway/newsletter signup. **Auth:** none. **Rate limit: 5 / IP / hour.** JSON body:

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | ✅ | validated; lowercased/trimmed |
| `consent` | boolean | ✅ (truthy) | `true`/`"true"`/`1`/`"1"` accepted |
| `source` | string | — | default `home_popup_reta`; part of unique key |
| `website` | string | — | **honeypot — leave empty** |

**200** — `{ "ok": true, "id": 123 }`; duplicate → `{ "ok": true, "already_subscribed": true }`; honeypot tripped → `{ "ok": true }`.
**Errors:** `400 {"error":"Please enter a valid email address."}` ·
`400 {"error":"Consent is required to enter the giveaway."}` ·
`429 {"error":"Too many submissions. Please try again later."}` ·
`500 {"error":"Failed to submit. Please try again."}`

---

## Appendix — endpoint quick reference

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/health`, `/api/user-orders/health` | — | liveness + DB |
| POST | `/api/auth/register` | — | returns JWT |
| POST | `/api/auth/login` | — | returns JWT |
| GET | `/api/auth/verify` | ✅ | |
| POST | `/api/auth/forgot-password` | — | |
| POST | `/api/auth/reset-password` | — | |
| GET | `/api/wallet` (+aliases) | ✅ | |
| GET | `/api/affiliate/status` (+alias) | ✅ | |
| POST | `/api/affiliate/request` (+alias) | ✅ | |
| GET | `/api/affiliate/dashboard` (+alias) | ✅ | |
| POST | `/api/promos/validate` (+alias) | — | |
| POST | `/api/products/klyme-status[-by-sku\|-by-name]` | — | |
| POST | `/api/user-orders` (+`/`) | — | **create order**, multipart |
| POST | `/api/central/orders` (+3 aliases) | — | details-only intake |
| GET | `/api/user-orders/by-email` | — | |
| GET | `/api/user-orders/:orderNumber` | — | |
| PUT | `/api/user-orders/:orderNumber` | — | |
| DELETE | `/api/user-orders/:orderNumber` | — | |
| POST | `/api/payment-capture/validate` | token | |
| POST | `/api/payment-capture/apply-promo` | token | |
| POST | `/api/payment-capture/upload` | token | multipart |
| POST | `/api/klyme/create-payment` | — | returns `paymentUuid` |
| POST | `/api/klyme/webhook` | — | gateway only |
| GET | `/api/klyme/verify-payment/:uuid` | — | |
| POST | `/api/aabanpay/create-payment` (+alias) | — | returns `paymentUrl` |
| POST | `/api/aabanpay/webhook` (+alias) | — | gateway only |
| GET | `/api/aabanpay/verify-payment/:sessionId` (+alias) | — | |
| POST | `/api/user-orders/aabanpay/charge` | — | direct card, 3DS |
| GET | `/api/user-orders/aabanpay/callback` | — | 302 redirect |
| POST | `/api/fengyu/check` (+alias) | — | proxy passthrough |
| GET | `/api/client-ip` (+alias), `/api/test-ip` | — | |
| POST | `/api/ai-chat` | — | 15/min |
| GET | `/api/ai-chat/suggestions` | — | static |
| POST | `/api/user-orders/spot-a-fake/submit` | — | multipart `images` |
| GET | `/api/user-orders/spot-a-fake/submissions` | — | |
| POST | `/api/user-orders/train-model/upload` | — | multipart `photos` |
| POST | `/api/user-orders/verify-product/upload` | — | multipart `photo` |
| GET | `/api/user-orders/verify-product/submissions` | — | |
| POST | `/api/user-orders/verify-product/delete` | password | |
| POST | `/api/user-orders/fingerprint/collect` | — | always 200 |
| GET | `/api/user-orders/fingerprint/list` | — | |
| POST | `/api/newsletter/subscribe` | — | 5/hour |

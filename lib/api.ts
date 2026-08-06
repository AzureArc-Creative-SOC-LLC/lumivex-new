/**
 * Typed client for the Central Order Management microservice.
 * Base URL is overridable via NEXT_PUBLIC_MICROSERVICES_URL.
 *
 * The microservice uses three different error envelopes ({error}, {ok:false,error},
 * {message}); `request` normalises them all into a thrown `ApiError`.
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_MICROSERVICES_URL ?? 'https://www.microservices.tech';
  // process.env.NEXT_PUBLIC_MICROSERVICES_URL ?? 'http://localhost:5003';

/**
 * payment-verification-service — OCR-verifies a payment screenshot against
 * an order. Defaults to the same gateway domain as API_BASE (the service is
 * proxied under it); override with NEXT_PUBLIC_PAYMENT_VERIFICATION_URL if
 * it's hosted separately (local default is http://localhost:5004 per the
 * service's own docs).
 */
export const PAYMENT_VERIFICATION_API_BASE =
  process.env.NEXT_PUBLIC_PAYMENT_VERIFICATION_URL ?? API_BASE;

const TOKEN_KEY = 'lumivex-auth-token';

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage may be unavailable */
  }
};

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Send Authorization: Bearer <token> if one is stored. */
  auth?: boolean;
  /** Multipart body — overrides JSON serialisation. */
  formData?: FormData;
  signal?: AbortSignal;
  /** Override the default API_BASE (e.g. for a separately-hosted microservice). */
  base?: string;
};

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false, formData, signal, base = API_BASE } = opts;
  const headers: Record<string, string> = {};
  if (!formData && body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
    signal,
  });

  const text = await res.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    const msg =
      (parsed && typeof parsed === 'object' && parsed !== null
        ? ((parsed as Record<string, unknown>).error as string) ||
          ((parsed as Record<string, unknown>).message as string)
        : null) || `Request failed (${res.status})`;
    throw new ApiError(res.status, msg, parsed);
  }

  return parsed as T;
}

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  date_of_birth: string;
  nationality: string;
  country_of_residence: string;
  role: string;
};

export type AuthResponse = { success: true; token: string; user: AuthUser };

export type WalletLedgerEntry = {
  amount: number;
  source: string;
  order_number: string | null;
  admin_username: string | null;
  note: string | null;
  created_at: string;
};

export type OrderItemInput = {
  name: string;
  quantity: number;
  unitPrice: number;
  productId?: string | number;
  sku?: string;
};

export type CreateOrderInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
  country?: string;
  subtotal: number;
  total: number;
  discountAmount?: number;
  promoCode?: string | null;
  promoDiscount?: number;
  itemsArray: OrderItemInput[];
  payment_method?: 'manual' | 'klyme' | 'aabanpay';
};

export type CreateOrderResponse = {
  success: true;
  orderId: number;
  orderNumber: string;
  email_debug?: unknown;
};

// ──────────────────────────────────────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────────────────────────────────────

export const auth = {
  register: (body: {
    name: string;
    email: string;
    password: string;
    date_of_birth: string;
    nationality: string;
    country_of_residence: string;
  }) => request<AuthResponse>('/api/auth/register', { method: 'POST', body }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('/api/auth/login', { method: 'POST', body }),

  verify: () =>
    request<{ success: true; user: AuthUser }>('/api/auth/verify', { auth: true }),

  forgotPassword: (email: string) =>
    request<{ success: true; message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: { email },
    }),

  resetPassword: (token: string, password: string) =>
    request<{ success: true; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: { token, password },
    }),
};

// ──────────────────────────────────────────────────────────────────────────────
// Wallet & affiliate
// ──────────────────────────────────────────────────────────────────────────────

export const wallet = {
  get: () =>
    request<{ success: true; balance: number; ledger: WalletLedgerEntry[] }>(
      '/api/wallet',
      { auth: true }
    ),
};

export const affiliate = {
  status: () =>
    request<
      | { ok: true; hasRequest: false }
      | {
          ok: true;
          hasRequest: true;
          request: {
            id: number;
            status: string;
            promo_code: string;
            promo_percent: number;
            created_at: string;
            decided_at: string | null;
          };
        }
    >('/api/affiliate/status', { auth: true }),

  request: (body: { first_name: string; last_name: string; tiktok_link: string }) =>
    request<{
      ok: true;
      approved?: boolean;
      alreadyRequested?: boolean;
      status: string;
      promo_code: string;
      promo_percent: number;
      reward_amount: number;
    }>('/api/affiliate/request', { method: 'POST', body, auth: true }),

  dashboard: () =>
    request<
      | { ok: true; is_affiliate: false }
      | {
          ok: true;
          is_affiliate: true;
          promo_code: string;
          promo_percent: number;
          reward_amount: number;
          status: string;
          first_name: string;
          last_name: string;
          tiktok_link: string;
          wallet_balance: number;
          total_earned: number;
          unique_customers: number;
          recent_redemptions: Array<{
            order_number: string;
            customer_email_masked: string;
            reward_amount: number;
            created_at: string;
          }>;
        }
    >('/api/affiliate/dashboard', { auth: true }),
};

// ──────────────────────────────────────────────────────────────────────────────
// Promo
// ──────────────────────────────────────────────────────────────────────────────

export const promos = {
  validate: (code: string) =>
    request<{ ok: true; valid: true; percent: number }>('/api/promos/validate', {
      method: 'POST',
      body: { code },
    }),
};

// ──────────────────────────────────────────────────────────────────────────────
// Orders
// ──────────────────────────────────────────────────────────────────────────────

export const orders = {
  create: (input: CreateOrderInput) =>
    request<CreateOrderResponse>('/api/user-orders', {
      method: 'POST',
      body: input,
    }),

  byEmail: (email: string) =>
    request<{ orders: Array<Record<string, unknown>> }>(
      `/api/user-orders/by-email?email=${encodeURIComponent(email)}`
    ),

  byNumber: (orderNumber: string) =>
    request<{
      order: Record<string, unknown>;
      items: Array<Record<string, unknown>>;
      payments: Array<Record<string, unknown>>;
    }>(`/api/user-orders/${encodeURIComponent(orderNumber)}`),
};

// ──────────────────────────────────────────────────────────────────────────────
// Manual payment capture (bank-transfer flow, token-authorised)
// ──────────────────────────────────────────────────────────────────────────────

export type CaptureValidateResponse = {
  ok: true;
  order: Record<string, unknown>;
  items: Array<Record<string, unknown>>;
  payments: Array<Record<string, unknown>>;
  allowPromo: boolean;
  bank: {
    payeeName: string;
    sortCode: string;
    accountNumber: string;
    reference: string;
  };
};

export const paymentCapture = {
  validate: (token: string) =>
    request<CaptureValidateResponse>('/api/payment-capture/validate', {
      method: 'POST',
      body: { token },
    }),

  applyPromo: (token: string, promoCode: string) =>
    request<{
      ok: true;
      promoCode: string;
      promoDiscountPercent: number;
      discountAmount: number;
      total: number;
    }>('/api/payment-capture/apply-promo', {
      method: 'POST',
      body: { token, promoCode },
    }),

  upload: (token: string, file: File) => {
    const fd = new FormData();
    fd.append('token', token);
    fd.append('paymentScreenshot', file);
    return request<{
      ok: true;
      screenshotUrl: string;
      screenshotFilename: string;
      verification: unknown;
      payment_status: 'received' | 'rejected' | 'pending';
      verification_error?: string;
    }>('/api/payment-capture/upload', { method: 'POST', formData: fd });
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// Payment verification (payment-verification-service — OCR screenshot check)
// ──────────────────────────────────────────────────────────────────────────────

export type PaymentVerdict = {
  decision: 'approved' | 'rejected' | string;
  probability: number;
  reasons: string[];
  extracted: {
    amount_candidates: number[];
    best_amount: number | null;
    expected_total: number;
    payee_expected: string;
    sort_code_expected: string;
    account_number_expected: string;
    ocr_avg_conf: number;
  };
};

export type VerifyPaymentResponse = {
  order: {
    id: number;
    order_number: string;
    customer_email: string;
    total: number;
  };
  screenshot: { filename: string; path: string };
  verdict: PaymentVerdict;
};

export const paymentVerification = {
  health: () =>
    request<{ ok: boolean; service: string; db: string }>(
      '/api/payment-verification/health',
      { base: PAYMENT_VERIFICATION_API_BASE }
    ),

  /** OCR-verifies an already-uploaded screenshot against the order total/payee. */
  verify: (orderNumber: string, screenshotFilename: string) =>
    request<VerifyPaymentResponse>('/api/payment-verification/verify', {
      method: 'POST',
      body: { order_number: orderNumber, screenshot_filename: screenshotFilename },
      base: PAYMENT_VERIFICATION_API_BASE,
    }),
};

// ──────────────────────────────────────────────────────────────────────────────
// AI chat
// ──────────────────────────────────────────────────────────────────────────────

export type ChatMessage = { role: 'user' | 'assistant'; text: string };

export const aiChat = {
  send: (message: string, history: ChatMessage[] = []) =>
    request<{
      reply: string;
      sources?: Array<{ id: string; title: string }>;
      provider: string;
    }>('/api/ai-chat', {
      method: 'POST',
      body: { message, history: history.slice(-6) },
    }),

  suggestions: () =>
    request<{ suggestions: string[] }>('/api/ai-chat/suggestions'),
};

// ──────────────────────────────────────────────────────────────────────────────
// Newsletter
// ──────────────────────────────────────────────────────────────────────────────

export const newsletter = {
  subscribe: (body: {
    email: string;
    consent: boolean;
    source?: string;
    /** Honeypot — must be empty. */
    website?: string;
  }) =>
    request<{ ok: true; id?: number; already_subscribed?: boolean }>(
      '/api/newsletter/subscribe',
      { method: 'POST', body }
    ),
};

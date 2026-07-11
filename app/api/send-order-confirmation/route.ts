import { sendOrderConfirmationEmail } from '../../../../shared-email/order-email.js';
// On the VPS, sites are deployed flat as /var/www/<site>/, sibling to
// /var/www/shared-email/ — 4 dirs back from this route to the site root's
// parent, then into shared-email.

type SendOrderConfirmationBody = {
  customer: { name: string; email: string };
  order: Record<string, unknown>;
};

// brand-config.js's "localhost" entry is a single bucket shared by every
// frontend's local dev server — whichever site was last tested locally owns
// it, so relying on it here would silently brand Lumivex's emails as
// whatever site someone else tested most recently. Force the real domain
// whenever the request is local.
const LOCAL_HOST_RE = /^(localhost|127\.0\.0\.1)(:\d+)?$/;

export async function POST(request: Request) {
  const { customer, order } = (await request.json()) as SendOrderConfirmationBody;

  const host = request.headers.get('host') ?? '';
  const domain = LOCAL_HOST_RE.test(host) ? 'lumivexlabs.co' : host;

  const result = await sendOrderConfirmationEmail({
    domain,
    customer,
    order,
  });

  return Response.json(result, { status: result.success ? 200 : 502 });
}

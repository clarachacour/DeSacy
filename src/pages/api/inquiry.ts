import type { APIRoute } from 'astro';

// Runs on Vercel as a function so the Brevo key never reaches the browser.
export const prerender = false;

const env = (name: string) => process.env[name] ?? import.meta.env[name];
const clean = (v: unknown, max = 5000) => String(v ?? '').trim().slice(0, max);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const FIELDS: [string, string][] = [
  ['name', 'Name'], ['email', 'Email'], ['phone', 'Phone'], ['topic', 'About'], ['piece', 'Piece'],
  ['collection', 'Studio collection'], ['personName', 'Their name'], ['words', 'Their words'],
  ['passions', 'Their passions'], ['occasion', 'Occasion'], ['idea', 'Idea'], ['size', 'Size (cm)'],
  ['message', 'Message'], ['newsletter', 'Wants news'], ['page', 'Sent from'],
];

async function brevo(path: string, body: unknown) {
  const res = await fetch(`https://api.brevo.com/v3${path}`, {
    method: 'POST',
    headers: { 'api-key': env('BREVO_API_KEY')!, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Brevo ${path} ${res.status}: ${await res.text()}`);
}

export const POST: APIRoute = async ({ request }) => {
  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }
  // Bots fill the hidden "website" field; pretend it worked.
  if (clean(raw.website)) return new Response(null, { status: 204 });

  const data = Object.fromEntries(FIELDS.map(([k]) => [k, clean(raw[k])]));
  const email = /^\S+@\S+\.\S+$/.test(data.email) ? data.email : '';
  if (!data.name || (!email && data.phone.replace(/\D/g, '').length < 8)) {
    return new Response('Missing name or contact details', { status: 422 });
  }
  if (!env('BREVO_API_KEY') || !env('INQUIRY_TO') || !env('BREVO_SENDER_EMAIL')) {
    console.error('Brevo is not configured: set BREVO_API_KEY, INQUIRY_TO and BREVO_SENDER_EMAIL');
    return new Response('Not configured', { status: 503 });
  }

  const sender = { email: env('BREVO_SENDER_EMAIL')!, name: env('BREVO_SENDER_NAME') ?? 'Maison De Sacy' };
  const kind = raw.kind === 'create' ? 'Create yours request' : 'Website inquiry';
  const rows = FIELDS.filter(([k]) => data[k])
    .map(([k, label]) => `<tr><td style="padding:6px 16px 6px 0;color:#5d6166;vertical-align:top">${label}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(data[k])}</td></tr>`)
    .join('');

  try {
    await brevo('/smtp/email', {
      sender,
      to: [{ email: env('INQUIRY_TO')! }],
      ...(email && { replyTo: { email, name: data.name } }),
      subject: `${kind}: ${data.name}${data.piece ? ` (${data.piece})` : ''}`,
      htmlContent: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#151617"><p><b>${kind}</b></p><table>${rows}</table></div>`,
    });
    if (email) {
      await brevo('/smtp/email', {
        sender,
        to: [{ email, name: data.name }],
        // Until contact@desacy.com has a mailbox, client replies go to the inbox that receives inquiries.
        replyTo: { email: env('INQUIRY_TO')!, name: sender.name },
        subject: 'Thank you for your message · Maison De Sacy',
        htmlContent: `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#151617;max-width:520px">
          <p>Dear ${esc(data.name)},</p>
          <p>Thank you for writing to Maison De Sacy. Your message has been received, and we will come back to you within two working days.</p>
          <p>With warm regards,<br>De Sacy</p></div>`,
      });
    }
    const listId = Number(env('BREVO_LIST_ID'));
    if (email && data.newsletter === 'yes' && listId) {
      await brevo('/contacts', { email, attributes: { FIRSTNAME: data.name }, listIds: [listId], updateEnabled: true }).catch((e) => console.error(e));
    }
  } catch (e) {
    console.error(e);
    return new Response('Could not send', { status: 502 });
  }
  return new Response(null, { status: 204 });
};

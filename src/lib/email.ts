// Branded confirmation email sent to clients after they write through the site.
// Table layout and inline styles, because most email apps ignore stylesheets.
import { CONTACT } from './contact';

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const SITE = 'https://www.desacy.com';
const INK = '#151617', GREY = '#5d6166', LINE = '#d9dadb', WALL = '#f6f6f4', TEMPER = '#9a7a3f';
const SERIF = "Didot, 'Bodoni 72', 'Bodoni MT', Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const TOPICS: Record<string, string> = {
  artwork: 'De Sacy Artwork sculpture', studio: 'De Sacy Studio piece', commission: 'Commission',
  press: 'Gallery or press request', other: 'Something else',
};
const COLLECTIONS: Record<string, string> = { words: 'In Words', passions: 'Passions', seasons: 'Seasons' };

/** The lines of the client's own request, shown back to them. */
export function summary(kind: string, d: Record<string, string>): [string, string][] {
  const rows: [string, string | undefined][] =
    kind === 'create'
      ? [
          ['Collection', COLLECTIONS[d.collection]],
          ['Name', d.collection === 'words' ? d.personName : undefined],
          ['Words', d.collection === 'words' ? d.words : undefined],
          ['Passions', d.collection === 'passions' ? d.passions : undefined],
          ['Occasion', d.collection === 'seasons' ? d.occasion : undefined],
          ['Your idea', d.collection === 'seasons' ? d.idea : undefined],
          ['Size', d.size ? `${d.size} cm` : undefined],
        ]
      : [
          ['About', TOPICS[d.topic]],
          ['Piece', d.piece],
          ['Message', d.message],
        ];
  return rows.filter((r): r is [string, string] => !!r[1]);
}

export function clientEmail(name: string, kind: string, rows: [string, string][]) {
  const isStudio = kind === 'create';
  const subject = isStudio ? 'Your De Sacy Studio request' : 'Thank you for writing to Maison De Sacy';
  const intro = isStudio
    ? 'Thank you for imagining a piece with De Sacy Studio. Your request has reached the workshop, and we will contact you within two working days to talk about finish and colours and to confirm the price. You will then receive a sketch to approve before any steel is cut.'
    : 'Thank you for writing to Maison De Sacy. Your message has reached the workshop, and we will come back to you personally within two working days.';

  const recap = rows
    .map(([k, v]) => `
      <tr>
        <td style="padding:10px 18px 10px 0;width:110px;vertical-align:top;font:400 10px/1.6 ${SANS};letter-spacing:2px;text-transform:uppercase;color:${GREY}">${esc(k)}</td>
        <td style="padding:10px 0;vertical-align:top;font:400 15px/1.6 ${SERIF};color:${INK};white-space:pre-wrap">${esc(v)}</td>
      </tr>`)
    .join('<tr><td colspan="2" style="border-top:1px solid ' + LINE + ';font-size:0;line-height:0">&nbsp;</td></tr>');

  const phones = CONTACT.phones.map(esc).join('&nbsp;&nbsp;·&nbsp;&nbsp;');

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${WALL}">
<div style="display:none;max-height:0;overflow:hidden">${esc(isStudio ? 'Your request has reached the workshop.' : 'Your message has reached the workshop.')}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${WALL}">
  <tr><td align="center" style="padding:40px 16px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff">
      <tr><td align="center" style="padding:44px 40px 8px">
        <a href="${SITE}" style="text-decoration:none"><img src="${SITE}/email/monogram.png" width="64" height="76" alt="De Sacy" style="display:block;border:0"></a>
      </td></tr>
      <tr><td align="center" style="padding:10px 40px 32px;font:400 11px/1 ${SANS};letter-spacing:5px;text-transform:uppercase;color:${INK}">Maison De Sacy</td></tr>
      <tr><td style="padding:0 40px"><div style="border-top:1px solid ${LINE};font-size:0;line-height:0">&nbsp;</div></td></tr>

      <tr><td style="padding:40px 40px 0;font:italic 400 26px/1.3 ${SERIF};color:${INK}">Dear ${esc(name)},</td></tr>
      <tr><td style="padding:18px 40px 0;font:400 16px/1.7 ${SERIF};color:${INK}">${intro}</td></tr>

      ${rows.length ? `
      <tr><td style="padding:32px 40px 0">
        <div style="font:400 10px/1 ${SANS};letter-spacing:3px;text-transform:uppercase;color:${TEMPER};padding-bottom:12px">${isStudio ? 'Your request' : 'Your message'}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${INK};border-bottom:1px solid ${LINE}">${recap}</table>
      </td></tr>` : ''}

      <tr><td style="padding:32px 40px 0;font:400 16px/1.7 ${SERIF};color:${INK}">In the meantime, you are welcome to discover the collection on <a href="${SITE}/artwork" style="color:${INK}">desacy.com</a>.</td></tr>

      <tr><td style="padding:40px 40px 0">
        <div style="font:italic 400 30px/1 ${SERIF};color:${INK}">De Sacy</div>
        <div style="padding-top:10px;font:400 14px/1.5 ${SERIF};color:${GREY}">Michèle Sacy Chacour</div>
        <div style="padding-top:2px;font:400 10px/1.6 ${SANS};letter-spacing:2px;text-transform:uppercase;color:${GREY}">Sculpting movement in steel</div>
      </td></tr>

      <tr><td style="padding:36px 40px 44px">
        <div style="border-top:1px solid ${LINE};padding-top:22px;font:400 12px/1.9 ${SANS};color:${GREY}">
          <a href="mailto:${CONTACT.email}" style="color:${INK};text-decoration:none">${CONTACT.email}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${SITE}" style="color:${INK};text-decoration:none">www.desacy.com</a><br>
          ${phones}<br>
          <a href="https://www.instagram.com/${CONTACT.instagram}/" style="color:${INK};text-decoration:none">Instagram @${CONTACT.instagram}</a>&nbsp;&nbsp;·&nbsp;&nbsp;${esc(CONTACT.city)}
        </div>
      </td></tr>
    </table>
    <div style="max-width:600px;padding:18px 16px 0;font:400 11px/1.6 ${SANS};color:${GREY};text-align:center">You receive this email because you wrote to Maison De Sacy through desacy.com.</div>
  </td></tr>
</table>
</body></html>`;

  const text = [
    `Dear ${name},`, '', intro, '',
    ...(rows.length ? [isStudio ? 'Your request' : 'Your message', ...rows.map(([k, v]) => `${k}: ${v}`), ''] : []),
    `In the meantime, you are welcome to discover the collection on ${SITE}/artwork`, '',
    'De Sacy', 'Michèle Sacy Chacour', 'Sculpting movement in steel', '',
    `${CONTACT.email} · ${SITE}`, CONTACT.phones.join(' · '), `Instagram @${CONTACT.instagram} · ${CONTACT.city}`,
  ].join('\n');

  return { subject, html, text };
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAILS = ['edilizia.rba@gmail.com', 'bchysf@gmail.com'];

const FORM_LABELS = {
  contatti: 'Richiesta dal form Contatti',
  preventivo: 'Richiesta di preventivo',
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { formType, nome, cognome, telefono, email, tipo, comune, messaggio } = req.body || {};

  if (!nome || !cognome || !telefono || !email) {
    res.status(400).json({ error: 'Campi obbligatori mancanti' });
    return;
  }

  const label = FORM_LABELS[formType] || 'Richiesta dal sito';

  const rows = [
    ['Nome', nome],
    ['Cognome', cognome],
    ['Telefono', telefono],
    ['Email', email],
    ['Tipo di lavoro', tipo],
    ['Comune', comune],
    ['Messaggio', messaggio],
  ].filter(([, v]) => v);

  const html = `<h2>${escapeHtml(label)}</h2><table>${rows
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join('')}</table>`;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RBA Edilizia Sito <onboarding@resend.dev>',
        to: TO_EMAILS,
        reply_to: email,
        subject: `${label} - ${nome} ${cognome}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend error:', errText);
      res.status(502).json({ error: 'Invio email fallito' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Send form error:', err);
    res.status(500).json({ error: 'Errore interno' });
  }
};

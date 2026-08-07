const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAILS = ['edilizia.rba@gmail.com', 'bchysf@gmail.com'];

const FORM_LABELS = {
  contatti: 'Richiesta dal form Contatti',
  preventivo: 'Richiesta di preventivo',
};

const TIPO_LABELS = {
  consulenza: 'Consulenza',
  progettazione: 'Progettazione',
  realizzazione: 'Realizzazione',
  'ristrutturazione-appartamento': 'Ristrutturazione appartamento completa',
  'ristrutturazione-parziale': 'Ristrutturazione parziale',
  'ristrutturazione-bagno': 'Rifacimento bagno',
  'ristrutturazione-cucina': 'Ristrutturazione cucina',
  'cappotto-termico': 'Cappotto termico',
  'nuova-costruzione': 'Nuova costruzione',
  pavimentazione: 'Pavimentazione / parquet',
  tinteggiatura: 'Tinteggiatura / imbianchino',
  'bonus-fiscali': 'Consulenza bonus fiscali',
  altro: 'Altro',
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailHtml(label, rows) {
  const rowsHtml = rows
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:10px 14px;background:#faf6f1;border-bottom:1px solid #efe4d8;font-family:Arial,sans-serif;font-size:13px;color:#33291f;font-weight:bold;white-space:nowrap;vertical-align:top;width:140px;">${escapeHtml(k)}</td>
        <td style="padding:10px 14px;background:#fff;border-bottom:1px solid #efe4d8;font-family:Arial,sans-serif;font-size:14px;color:#333;">${escapeHtml(v).replace(/\n/g, '<br>')}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="it">
<body style="margin:0;padding:0;background:#f2ebe3;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2ebe3;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(51,41,31,0.08);">
          <tr>
            <td style="background:#33291f;padding:24px 28px;text-align:center;">
              <img src="https://www.rba-edilizia.it/images/logo.png" alt="RBA Edilizia" height="48" style="height:48px;width:auto;display:inline-block;">
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px 28px;">
              <p style="margin:0 0 4px 0;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#a35a35;font-weight:bold;">Nuova richiesta dal sito</p>
              <h1 style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#33291f;">${escapeHtml(label)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #efe4d8;border-radius:8px;overflow:hidden;">
                ${rowsHtml}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 28px 28px;">
              <a href="tel:+393282027226" style="display:inline-block;background:#a35a35;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;padding:12px 22px;border-radius:6px;">Chiama il cliente →</a>
            </td>
          </tr>
          <tr>
            <td style="background:#faf6f1;padding:24px 28px;border-top:1px solid #efe4d8;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#33291f;font-weight:bold;padding-bottom:4px;">RBA Edilizia</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:12px;color:#a35a35;font-weight:bold;letter-spacing:.5px;padding-bottom:10px;">IMPRESA EDILE A MONZA E BRIANZA DAL 2014</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:13px;color:#555;line-height:1.7;">
                    Via San Rocco 34, 20900 Monza (MB)<br>
                    Tel: <a href="tel:+393282027226" style="color:#a35a35;text-decoration:none;">328 202 7226</a> &nbsp;·&nbsp;
                    Email: <a href="mailto:edilizia.rba@gmail.com" style="color:#a35a35;text-decoration:none;">edilizia.rba@gmail.com</a><br>
                    P.IVA IT07151610966
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <p style="font-family:Arial,sans-serif;font-size:11px;color:#a89a8a;margin-top:16px;">Email generata automaticamente dal form del sito rba-edilizia.it</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
    ['Tipo di lavoro', TIPO_LABELS[tipo] || tipo],
    ['Comune', comune],
    ['Messaggio', messaggio],
  ].filter(([, v]) => v);

  const html = buildEmailHtml(label, rows);

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RBA Edilizia Sito <noreply@rba-edilizia.it>',
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

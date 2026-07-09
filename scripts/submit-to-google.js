// Notifica a Google (Indexing API) tutti gli URL presenti in sitemap.xml.
// Uso: node scripts/submit-to-google.js
//
// Richiede scripts/secrets/gsc-key.json (chiave service account, ignorata da git)
// e che l'email del service account sia aggiunta come Proprietario in
// Google Search Console per la proprietà del sito.

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const KEY_PATH = path.join(__dirname, 'secrets', 'gsc-key.json');
const SITEMAP_PATH = path.join(__dirname, '..', 'sitemap.xml');

function loadUrlsFromSitemap() {
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map(m => m[1].trim());
}

async function main() {
  if (!fs.existsSync(KEY_PATH)) {
    console.error(`Chiave non trovata in ${KEY_PATH}`);
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });
  const client = await auth.getClient();
  const indexing = google.indexing({ version: 'v3', auth: client });

  const urls = loadUrlsFromSitemap();
  console.log(`Trovati ${urls.length} URL nella sitemap.\n`);

  for (const url of urls) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' },
      });
      console.log(`OK   ${url}`);
    } catch (err) {
      const msg = err.errors?.[0]?.message || err.message;
      console.log(`FAIL ${url} -> ${msg}`);
    }
    // La API ha un limite di quota per secondo: piccola pausa di cortesia.
    await new Promise(r => setTimeout(r, 500));
  }
}

main();

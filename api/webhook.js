export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const receivedSignature = req.headers['x-webhook-signature'];
  const expectedSignature = Buffer.from(receivedSignature || '').toString('utf8');

  const body = JSON.stringify(req.body || {});
  const crypto = require('crypto');
  const calculatedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature && expectedSignature !== calculatedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  console.log('Webhook recebido:', req.body);

  res.status(200).json({ received: true });
}
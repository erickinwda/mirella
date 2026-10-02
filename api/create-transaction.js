export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, amount } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ error: 'Email and amount required' });
  }

  const API_KEY = process.env.API_KEY;
  const USER_AGENT = process.env.USER_AGENT;

  if (!API_KEY || !USER_AGENT) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const response = await fetch('https://api.realtechdev.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        external_id: `pix-${Date.now()}`,
        payment_method: 'pix',
        amount: amount,
        buyer: {
          name: 'Cliente',
          email: email
        }
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
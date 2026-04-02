const fs = require('fs');
const path = require('path');

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(body)
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  try {
    const { firstname = '', email = '' } = JSON.parse(event.body || '{}');
    const cleanFirstName = firstname.trim();
    const cleanEmail = email.trim();

    if (!cleanFirstName) {
      return json(400, { error: 'First name is required' });
    }

    if (!cleanEmail) {
      return json(400, { error: 'Email is required' });
    }

    if (!isValidEmail(cleanEmail)) {
      return json(400, { error: 'Please enter a valid email' });
    }

    if (!process.env.BREVO_API_KEY) {
      return json(500, { error: 'Missing BREVO_API_KEY' });
    }

    if (!process.env.SENDER_EMAIL) {
      return json(500, { error: 'Missing SENDER_EMAIL' });
    }

    const pdfPath = path.resolve(process.cwd(), 'files', 'current.pdf');

    if (!fs.existsSync(pdfPath)) {
      return json(500, { error: 'PDF file not found at files/current.pdf' });
    }

    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          email: process.env.SENDER_EMAIL,
          name: process.env.SENDER_NAME || 'Website PDF Sender'
        },
        to: [
          {
            email: cleanEmail,
            name: cleanFirstName
          }
        ],
        subject: 'Here is your PDF',
        htmlContent: `
          <html>
            <body style="font-family: Arial, sans-serif;">
              <p>Hi ${escapeHtml(cleanFirstName)},</p>
              <p>Your PDF is attached to this email.</p>
            </body>
          </html>
        `,
        attachment: [
          {
            name: 'current.pdf',
            content: pdfBase64
          }
        ]
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Brevo error:', data);
      return json(500, { error: data.message || 'Could not send email' });
    }

    return json(200, {
      success: true,
      message: 'PDF sent successfully',
      data
    });
  } catch (error) {
    console.error(error);
    return json(500, { error: 'Something went wrong on the server' });
  }
};

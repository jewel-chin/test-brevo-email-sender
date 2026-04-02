const form = document.getElementById('sendForm');
const sendBtn = document.getElementById('sendBtn');
const message = document.getElementById('message');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const firstname = document.getElementById('firstname').value.trim();
  const email = document.getElementById('email').value.trim();

  message.textContent = '';
  message.className = 'message';
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  try {
    const response = await fetch('/api/send-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firstname, email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }

    message.textContent = 'Success — the PDF was sent.';
    message.classList.add('success');
    form.reset();
  } catch (error) {
    message.textContent = error.message || 'Something went wrong';
    message.classList.add('error');
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send PDF now';
  }
});

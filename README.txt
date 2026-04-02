How to run

1. Put your PDF file inside the /files folder and name it current.pdf
2. Copy .env.example to .env
3. Fill in:
   - BREVO_API_KEY
   - SENDER_EMAIL  (must be a verified sender in Brevo)
   - SENDER_NAME
4. In Terminal:

   cd brevo-pdf-email-test
   npm install
   npm start

5. Open:
   http://localhost:3000

Important
- The email cannot be sent safely from pure frontend JavaScript alone because your Brevo API key must stay private.
- This project uses vanilla HTML/CSS/JS on the frontend and one tiny Node.js server on the backend.

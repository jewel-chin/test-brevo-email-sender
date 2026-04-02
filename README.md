# Brevo PDF Email Test — Netlify Ready

This is a vanilla HTML/CSS/JS site with a Netlify Function that sends a PDF attachment by email through Brevo.

## Folder structure

```text
.
├── files/
│   └── current.pdf
├── netlify/
│   └── functions/
│       └── send-pdf.js
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── .env.example
├── .gitignore
├── netlify.toml
└── package.json
```

## Local development

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Install project dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env
```

4. Fill in:
- `BREVO_API_KEY`
- `SENDER_EMAIL`
- `SENDER_NAME`

5. Start local dev:

```bash
netlify dev
```

6. Open:

```bash
http://localhost:8888
```

## Deploy to Netlify

Push this project to GitHub, then connect the repo in Netlify.

In Netlify site settings, add these environment variables:
- `BREVO_API_KEY`
- `SENDER_EMAIL`
- `SENDER_NAME`

No build command is required.
Publish directory: `public`
Functions directory: `netlify/functions`

## Notes

- Put the PDF you want to send in `files/current.pdf`
- The frontend calls `/api/send-pdf`
- Netlify redirects that request to the function

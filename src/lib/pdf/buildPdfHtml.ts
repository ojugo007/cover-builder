export function buildPdfHtml(content: string) {
  return `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
          * {
            color: #000000 !important;
            background-color: transparent !important;
            border-color: #000000 !important;
          }

          body {
            padding: 25mm;
            font-family: Inter, serif;
            color: #111;
            }
            
          p {
            margin-bottom: 12px;
            line-height: 1.6;
          }

          strong {
            font-weight: bold;
          }

          em {
            font-style: italic;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `
}

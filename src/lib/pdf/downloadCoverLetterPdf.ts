import html2pdf from 'html2pdf.js'
import DOMPurify from 'dompurify'
import { buildPdfHtml } from './buildPdfHtml'

export function downloadCoverLetterPdf(editor: any) {
  editor.commands.blur()

  const html = buildPdfHtml(
    DOMPurify.sanitize(editor.getHTML())
  )

  const container = document.createElement('div')
  container.innerHTML = html

  html2pdf()
    .from(container)
    .set({
      margin: [20, 20, 20, 20],
      filename: 'cover-letter.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff',
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
    })
    .save()
}

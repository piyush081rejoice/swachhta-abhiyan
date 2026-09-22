import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const pdfService = {
  async downloadPdfFromElement(elementId, filename = 'Swachhata_Sankalp_Patra.pdf') {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // High quality canvas rendering
    const canvas = await html2canvas(element, {
      scale: 2.5, // Crisp 300 DPI equivalent
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
    return true;
  },

  printElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>સ્વચ્છતા સંકલ્પ પત્ર</title>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: #fff;
              font-family: 'Noto Sans Gujarati', sans-serif;
            }
            .sankalp-a4-page {
              width: 210mm;
              height: 297mm;
              box-sizing: border-box;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

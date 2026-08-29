import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Certificate } from '../types';

export interface PDFGenerationOptions {
  fileName?: string;
  quality?: number; // 0.1 to 1.0
  scale?: number;
}

/**
 * Robust Client-Side PDF Generation Service for Certificates
 * Uses html2canvas + jsPDF with a pure vector jsPDF fallback for maximum cross-browser reliability.
 */
export const pdfService = {
  /**
   * Generates and downloads a high-resolution landscape A4 PDF from a DOM element
   */
  async generateCertificatePDF(
    element: HTMLElement,
    certificate: Certificate,
    options?: PDFGenerationOptions
  ): Promise<{ success: boolean; fileName: string; error?: string }> {
    const sanitizedId = (certificate.certificateId || 'VERIFIED').replace(/[^a-zA-Z0-9-_]/g, '_');
    const sanitizedName = (certificate.traineeName || 'Trainee').replace(/[^a-zA-Z0-9-_]/g, '_');
    const fileName = options?.fileName || `CapacityConnect_Certificate_${sanitizedId}_${sanitizedName}.pdf`;

    try {
      // 1. Ensure all custom fonts (Cinzel, Plus Jakarta Sans, etc.) are fully loaded
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // 2. Render high-resolution canvas with html2canvas
      const scale = options?.scale || 2.5; // High-DPI for crisp text and graphics
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          // Ensure the cloned certificate container has clean styling in isolation
          const certClone = clonedDoc.getElementById('printable-certificate') || clonedDoc.querySelector('.certificate-printable-canvas');
          if (certClone) {
            (certClone as HTMLElement).style.color = '#0F172A';
            (certClone as HTMLElement).style.backgroundColor = '#FFFFFF';
            (certClone as HTMLElement).style.margin = '0 auto';
            (certClone as HTMLElement).style.maxWidth = '1000px';
          }
        }
      });

      // 3. Convert canvas to PNG image data
      const imgData = canvas.toDataURL('image/png', options?.quality || 1.0);

      // 4. Initialize landscape A4 PDF (297 mm x 210 mm)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Set Document Metadata
      pdf.setProperties({
        title: `Certificate of Completion - ${certificate.courseTitle}`,
        subject: `Capacity Building Accreditation: ${certificate.certificateId}`,
        author: 'CAPACITY CONNECT - Digital Capacity Building & LMS',
        keywords: 'Certificate, Accreditation, Capacity Building, SIH 2026, Competency',
        creator: 'Capacity Connect Certification Engine'
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth(); // 297 mm
      const pdfPageHeight = pdf.internal.pageSize.getHeight(); // 210 mm

      const margin = 10; // 10mm margin
      const availableWidth = pdfPageWidth - margin * 2;
      const availableHeight = pdfPageHeight - margin * 2;

      // Maintain aspect ratio
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;

      let renderWidth = availableWidth;
      let renderHeight = renderWidth / ratio;

      if (renderHeight > availableHeight) {
        renderHeight = availableHeight;
        renderWidth = renderHeight * ratio;
      }

      // Center the certificate on the page
      const posX = (pdfPageWidth - renderWidth) / 2;
      const posY = (pdfPageHeight - renderHeight) / 2;

      pdf.addImage(imgData, 'PNG', posX, posY, renderWidth, renderHeight, undefined, 'FAST');

      // 5. Trigger browser download
      pdf.save(fileName);

      return { success: true, fileName };
    } catch (err: any) {
      console.warn('Canvas-to-PDF rendering encountered an error, activating vector PDF fallback:', err);
      
      // Fallback: Pure programmatic vector jsPDF generation (100% reliable across any browser engine)
      try {
        this.generateVectorFallbackPDF(certificate, fileName);
        return { success: true, fileName };
      } catch (fallbackErr: any) {
        console.error('Vector PDF fallback failed:', fallbackErr);
        return {
          success: false,
          fileName,
          error: fallbackErr?.message || 'Unable to generate PDF document.'
        };
      }
    }
  },

  /**
   * Programmatic Vector PDF Generator (Fallback for restricted webviews or environments)
   */
  generateVectorFallbackPDF(certificate: Certificate, fileName: string): void {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Background & Outer Gold/Navy Border
    pdf.setFillColor(254, 253, 250);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Outer double border
    pdf.setDrawColor(30, 41, 59); // Slate-800
    pdf.setLineWidth(1.5);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

    pdf.setDrawColor(217, 119, 6); // Amber-600
    pdf.setLineWidth(0.8);
    pdf.rect(13, 13, pageWidth - 26, pageHeight - 26);

    // Header Branding
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(15, 23, 42);
    pdf.text('CAPACITY CONNECT', pageWidth / 2, 32, { align: 'center' });

    pdf.setFontSize(9);
    pdf.setTextColor(180, 83, 9); // Amber-700
    pdf.text('DIGITAL CAPACITY BUILDING & LEARNING MANAGEMENT PORTAL', pageWidth / 2, 38, { align: 'center' });

    // Decorative divider line
    pdf.setDrawColor(217, 119, 6);
    pdf.setLineWidth(0.5);
    pdf.line(pageWidth / 2 - 40, 42, pageWidth / 2 + 40, 42);

    // Certificate Title
    pdf.setFont('times', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(30, 41, 59);
    pdf.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 54, { align: 'center' });

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(11);
    pdf.setTextColor(100, 116, 139);
    pdf.text('This is to officially certify that', pageWidth / 2, 63, { align: 'center' });

    // Trainee Name
    pdf.setFont('times', 'bold');
    pdf.setFontSize(26);
    pdf.setTextColor(30, 58, 138); // Blue-900
    pdf.text(certificate.traineeName, pageWidth / 2, 78, { align: 'center' });

    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(0.5);
    pdf.line(pageWidth / 2 - 60, 81, pageWidth / 2 + 60, 81);

    // Description
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(71, 85, 105);
    pdf.text(
      'has successfully completed all required training modules and demonstrated proven competency',
      pageWidth / 2,
      90,
      { align: 'center' }
    );
    pdf.text('by passing the final competency assessment for the certified curriculum:', pageWidth / 2, 96, { align: 'center' });

    // Course Title Box
    pdf.setFillColor(241, 245, 249);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(pageWidth / 2 - 80, 104, 160, 16, 3, 3, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(15, 23, 42);
    pdf.text(certificate.courseTitle, pageWidth / 2, 114, { align: 'center' });

    // Score and Issue Date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(51, 65, 85);
    pdf.text(
      `Assessment Score: ${certificate.score}% (PASSED)    |    Date Issued: ${certificate.issueDate}`,
      pageWidth / 2,
      128,
      { align: 'center' }
    );

    // Signatures & Verification Section
    const signY = 160;

    // Trainer signature
    pdf.setFont('times', 'italic');
    pdf.setFontSize(14);
    pdf.setTextColor(30, 27, 75);
    pdf.text(certificate.trainerName, 50, signY, { align: 'center' });
    pdf.setDrawColor(148, 163, 184);
    pdf.line(25, signY + 2, 75, signY + 2);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(30, 41, 59);
    pdf.text(certificate.trainerName, 50, signY + 7, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Lead Domain Trainer', 50, signY + 11, { align: 'center' });

    // Center Seal
    pdf.setDrawColor(5, 150, 105);
    pdf.setFillColor(236, 253, 245);
    pdf.roundedRect(pageWidth / 2 - 35, signY - 14, 70, 26, 3, 3, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(4, 120, 87);
    pdf.text('VERIFIED AUTHENTIC', pageWidth / 2, signY - 4, { align: 'center' });
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(71, 85, 105);
    pdf.text(`ID: ${certificate.certificateId}`, pageWidth / 2, signY + 2, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    pdf.text('National Accreditation Framework', pageWidth / 2, signY + 7, { align: 'center' });

    // Admin signature
    pdf.setFont('times', 'italic');
    pdf.setFontSize(14);
    pdf.setTextColor(30, 58, 138);
    pdf.text('Rajeshwar Sharma', pageWidth - 50, signY, { align: 'center' });
    pdf.setDrawColor(148, 163, 184);
    pdf.line(pageWidth - 75, signY + 2, pageWidth - 25, signY + 2);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(30, 41, 59);
    pdf.text('Rajeshwar Sharma', pageWidth - 50, signY + 7, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Chief Learning Officer', pageWidth - 50, signY + 11, { align: 'center' });

    pdf.save(fileName);
  }
};

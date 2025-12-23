import jsPDF from 'jspdf';
import { BillBreakdown } from '../services/api';

export const generateBillPDF = (
  units: number,
  ratePerUnit: number,
  vatPercentage: number,
  breakdown: BillBreakdown
) => {
  const doc = new jsPDF();

  // Company Header (deep tech bar with inverse logo treatment)
  doc.setFillColor(10, 12, 20);
  doc.rect(0, 0, 210, 42, 'F');

  // Logo area - simple text branding instead of image
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('ACME', 20, 22);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('AI', 20, 32);

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ACME AI LTD.', 55, 20);


  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('H #385, R #6, Mirpur DOHS, Dhaka 1216, Bangladesh', 55, 28);
  doc.text('Email: info@acmeai.tech | Web: www.acmeai.tech', 55, 34);

  // Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('UTILITY BILL', 105, 55, { align: 'center' });

  // Bill Details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const now = new Date();
  const currentDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const currentTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  doc.text(`Date: ${currentDate}`, 20, 70);
  doc.text(`Time: ${currentTime}`, 20, 78);
  doc.text(`Bill No: BILL-${Date.now()}`, 20, 86);

  // Separator Line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 92, 190, 92);

  // Bill Breakdown Table
  let yPos = 107;

  doc.setFont('helvetica', 'bold');
  doc.text('Description', 25, yPos);
  doc.text('Amount (BDT)', 155, yPos, { align: 'right' });

  yPos += 10;
  doc.setFont('helvetica', 'normal');

  // Units consumed
  doc.text(`Units Consumed: ${units} kWh`, 25, yPos);
  yPos += 8;
  doc.text(`Rate per Unit: ${ratePerUnit.toFixed(2)} BDT`, 25, yPos);
  yPos += 12;

  // Subtotal
  doc.setFont('helvetica', 'bold');
  doc.text('Subtotal', 25, yPos);
  doc.text(breakdown.subtotal.toFixed(2), 155, yPos, { align: 'right' });
  yPos += 10;

  // VAT
  doc.setFont('helvetica', 'normal');
  doc.text(`VAT (${vatPercentage}%)`, 25, yPos);
  doc.text(breakdown.vat_amount.toFixed(2), 155, yPos, { align: 'right' });
  yPos += 10;

  // Service Charge
  doc.text('Service Charge', 25, yPos);
  doc.text(breakdown.service_charge.toFixed(2), 155, yPos, { align: 'right' });
  yPos += 15;

  // Total Line
  doc.setDrawColor(0, 0, 0);
  doc.line(20, yPos - 5, 190, yPos - 5);

  // Total
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PAYABLE', 25, yPos);
  doc.text(breakdown.total.toFixed(2), 155, yPos, { align: 'right' });

  yPos += 5;
  doc.line(20, yPos, 190, yPos);

  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Thank you for your business. Please pay by the due date.',
    105,
    260,
    { align: 'center' }
  );
  doc.text(
    'This is a computer-generated document. No signature required.',
    105,
    266,
    { align: 'center' }
  );

  // Company Footer (mirrors dark header)
  doc.setFillColor(10, 12, 20);
  doc.rect(0, 275, 210, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('ACME AI LTD. | Empowering Innovation', 105, 285, {
    align: 'center',
  });

  // Save PDF
  doc.save(`utility-bill-${Date.now()}.pdf`);
};

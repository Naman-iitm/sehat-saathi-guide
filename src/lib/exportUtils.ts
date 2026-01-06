import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Symptom } from '@/types';

export const exportToCSV = (symptoms: Symptom[]) => {
  if (symptoms.length === 0) {
    return null;
  }

  const headers = ['Date', 'Time', 'Symptom', 'Description'];
  const rows = symptoms.map(s => [
    s.date,
    s.time,
    s.name,
    s.description || 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `symptom-tracker-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
};

export const exportToPDF = (symptoms: Symptom[], language: string = 'en') => {
  if (symptoms.length === 0) {
    return null;
  }

  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(language === 'hi' ? 'लक्षण ट्रैकर रिपोर्ट' : 'Symptom Tracker Report', 14, 20);
  
  // Metadata
  doc.setFontSize(10);
  doc.text(`${language === 'hi' ? 'उत्पन्न' : 'Generated'}: ${new Date().toLocaleDateString()}`, 14, 30);
  doc.text(`${language === 'hi' ? 'कुल लक्षण' : 'Total Symptoms'}: ${symptoms.length}`, 14, 36);
  
  // Table
  const tableData = symptoms.map(s => [
    s.date,
    s.time,
    s.name,
    s.description || 'N/A'
  ]);
  
  autoTable(doc, {
    startY: 45,
    head: [[
      language === 'hi' ? 'तारीख' : 'Date',
      language === 'hi' ? 'समय' : 'Time',
      language === 'hi' ? 'लक्षण' : 'Symptom',
      language === 'hi' ? 'विवरण' : 'Description'
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
  });
  
  doc.save(`symptom-tracker-${new Date().toISOString().split('T')[0]}.pdf`);
  
  return true;
};
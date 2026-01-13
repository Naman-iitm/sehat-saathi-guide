import jsPDF from 'jspdf';

export const exportUploadedFilePDF = (file: File) => {
  const reader = new FileReader();

  reader.onload = () => {
    const pdf = new jsPDF();

    if (file.type.startsWith('image/')) {
      pdf.addImage(
        reader.result as string,
        'PNG',
        10,
        10,
        180,
        240
      );
    } else {
      pdf.text(
        'Uploaded PDF cannot be re-exported as PDF.\nPlease download original file.',
        10,
        20
      );
    }

    pdf.save('uploaded-medical-report.pdf');
  };

  reader.readAsDataURL(file);
};

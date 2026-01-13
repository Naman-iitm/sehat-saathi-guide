export const exportUploadedFilePNG = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Only image files can be exported as PNG');
    return;
  }

  const url = URL.createObjectURL(file);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'uploaded-medical-report.png';
  link.click();

  URL.revokeObjectURL(url);
};

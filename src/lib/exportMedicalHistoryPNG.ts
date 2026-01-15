import html2canvas from "html2canvas";

export const exportMedicalHistoryPNG = async () => {
  const element = document.getElementById("medical-history-view");

  if (!element) return;

  const canvas = await html2canvas(element, {
    backgroundColor: "#0b1f17",
    scale: 2,
  });

  const link = document.createElement("a");
  link.download = "medical-history.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

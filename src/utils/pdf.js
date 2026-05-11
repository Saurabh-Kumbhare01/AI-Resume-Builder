import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadResumePdf(element, fileName = "resume") {
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true
  });

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageWidth = pageWidth;
  const imageHeight = (canvas.height * imageWidth) / canvas.width;

  let heightLeft = imageHeight;
  let position = 0;

  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imageWidth, imageHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imageHeight;
    pdf.addPage();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imageWidth, imageHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${fileName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "resume"}.pdf`);
}

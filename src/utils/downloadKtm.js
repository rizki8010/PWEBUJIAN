import html2canvas from 'html2canvas';

export const downloadKtm = async (elementId, studentName) => {
  try {
    const element = document.getElementById(elementId);
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    const link = document.createElement('a');
    link.download = `KTM_${studentName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error downloading KTM:', error);
    alert('Failed to download KTM');
  }
};

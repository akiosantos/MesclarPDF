document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById('fileInput');
    const mergeButton = document.getElementById('mergeButton');
    const resultDiv = document.getElementById('result');

    mergeButton.addEventListener('click', async function () {
        const files = fileInput.files;
        const pdfDoc = await PDFLib.PDFDocument.create();

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(files[i]);
            await reader.onload = async function () {
                const pdfBytes = new Uint8Array(this.result);
                const tempDoc = await PDFLib.PDFDocument.load(pdfBytes);
                const copiedPages = await pdfDoc.copyPages(tempDoc, tempDoc.getPageIndices());
                copiedPages.forEach(page => pdfDoc.addPage(page));
            }
        }

        const mergedPdfBytes = await pdfDoc.save();
        const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        resultDiv.innerHTML = '';
        const embed = document.createElement('embed');
        embed.src = url;
        embed.type = "application/pdf";
        embed.width = "600";
        embed.height = "500";
        resultDiv.appendChild(embed);
    });
});

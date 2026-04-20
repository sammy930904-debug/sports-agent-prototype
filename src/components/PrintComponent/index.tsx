import React, { useRef } from 'react';
import { Button, ButtonProps } from 'antd';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface PrintButtonProps extends ButtonProps {
    content: React.ReactNode;
    fileName?: string;
}

const PrintButton: React.FC<PrintButtonProps> = ({
    content,
    fileName = 'document.pdf',
    ...rest
}) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = async () => {
        if (printRef.current) {
            const dpi = 300;
            const pdf = new jsPDF({
                unit: 'mm',
                format: 'a4', // 设置为 A4 纸张尺寸
                orientation: 'portrait', // 设置为纵向打印
            });

            const canvas = await html2canvas(printRef.current, {
                scale: dpi / 96,
            });

            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // 计算图像的缩放比例
            const widthRatio = pdfWidth / imgProps.width;
            const heightRatio = pdfHeight / imgProps.height;
            const ratio = Math.min(widthRatio, heightRatio);

            // 根据缩放比例计算图像的尺寸
            const imgWidth = imgProps.width * ratio;
            const imgHeight = imgProps.height * ratio;

            // 将图像居中放置在 PDF 页面上
            const x = (pdfWidth - imgWidth) / 2;
            const y = 5;

            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

            // 将 PDF 数据转换为 Blob 对象
            const pdfData = pdf.output('blob');

            // 使用 PDF.js 库在浏览器中打开 PDF
            const pdfWindow = window.open('', '_blank');
            pdfWindow?.document.write(
                '<html><head><title>Print PDF</title></head><body><embed width="100%" height="100%" src="' +
                    URL.createObjectURL(pdfData) +
                    '"></embed></body></html>',
            );

            // 等待 PDF 加载完成后调用浏览器的打印功能
            pdfWindow?.addEventListener('load', () => {
                pdfWindow.print();
                pdfWindow.close();
            });
        }
    };

    return (
        <div>
            <div ref={printRef} className="px-5">
                {content}
            </div>
            <Button className="ml-[15px]" {...rest} onClick={handlePrint}>
                {fileName}
            </Button>
        </div>
    );
};

export default PrintButton;

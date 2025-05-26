import React from 'react';
import { CheckCircle2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface SuccessMessageProps {
  code: string;
  onReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ code, onReset }) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Adiciona o logo (certifique-se que o caminho está correto)
    const logo = new Image();
    logo.src = '/engBRASIL25.png'; // Caminho para sua imagem
    
    // Quando a imagem carregar, gera o PDF
    logo.onload = () => {
      // Adiciona o logo (posição x, y, largura, altura)
      doc.addImage(logo, 'PNG', 60, 15, 90, 25);
      
      // Configurações do documento
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('Comprovante de Submissão', 105, 60, { align: 'center' });
      
      doc.setFontSize(14);
      doc.text('XII Congresso Brasileiro de Engenharia da Rede PDMat', 105, 70, { align: 'center' });
      doc.text('Presencial', 105, 80, { align: 'center' });
      
      // Linha divisória
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 90, 190, 90);
      
      // Seção do código
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Seu código de submissão:', 105, 105, { align: 'center' });
      
      doc.setFontSize(28);
      doc.setTextColor(220, 38, 38);
      doc.text(code, 105, 120, { align: 'center' });
      
      // Instruções
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Guarde este código para acompanhar o status da sua submissão.', 105, 140, { align: 'center' });
      doc.text('Todo contato com a organização do engBRASIL25 deve indicar', 105, 150, { align: 'center' });
      doc.text('o código do resumo mencionado acima.', 105, 160, { align: 'center' });
      
      // Rodapé
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Documento gerado em: ${new Date().toLocaleString()}`, 105, 180, { align: 'center' });
      
      // Salva o PDF
      doc.save(`comprovante-engBRASIL25-${code}.pdf`);
    };
    
    // Caso a imagem não carregue, gera o PDF sem ela
    logo.onerror = () => {
      alert('O logo não pôde ser carregado, gerando PDF sem imagem...');
      // Chama a função novamente sem o logo
      handleDownloadPDF();
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Submissão realizada com sucesso!
          </h2>
          <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600 mb-2">Seu código de submissão é:</p>
            <p className="text-3xl font-bold text-red-600">{code}</p>
            <p className="mt-2 text-sm text-red-500">
              Guarde este código para acompanhar o status da sua submissão. Todo contato com a organização do engBRASIL25 deve indicar o código do resumo.
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onReset}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Realizar nova submissão
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <Download className="mr-2 h-5 w-5" />
              Baixar comprovante (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface CpfEntryScreenProps {
  onClose: () => void;
  onSubmit: (cpf: string) => void;
}

const CpfEntryScreen: React.FC<CpfEntryScreenProps> = ({ onClose, onSubmit }) => {
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');

  const formatCPF = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica formatação
    let formatted = numbers;
    if (numbers.length > 3) {
      formatted = numbers.slice(0, 3) + '.' + numbers.slice(3);
    }
    if (numbers.length > 6) {
      formatted = formatted.slice(0, 7) + '.' + numbers.slice(6);
    }
    if (numbers.length > 9) {
      formatted = formatted.slice(0, 11) + '-' + numbers.slice(9, 11);
    }
    
    return formatted;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    setError('');
  };

  const handleSubmit = () => {
    const cpfNumbers = cpf.replace(/\D/g, '');
    
    if (cpfNumbers.length !== 11) {
      setError('CPF inválido. Digite os 11 dígitos.');
      return;
    }
    
    onSubmit(cpfNumbers);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 flex items-center justify-between px-4 py-3">
        <button onClick={onClose} className="text-white hover:text-gray-300">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-white text-lg font-semibold">Meus Menus</h1>
        <div className="w-6"></div> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo TP.png" 
              alt="TotalPass Logo"
              className="w-32 h-32 object-contain"
            />
          </div>
          <div className="text-center">
            <span className="text-primary text-xl font-semibold">Benefícios</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Acesse seus menus
          </h2>
          <p className="text-gray-600 text-base">
            Digite seu CPF para visualizar seus planos alimentares
          </p>
        </div>

        {/* CPF Input */}
        <div className="w-full max-w-md">
          <label className="block text-gray-700 font-medium mb-2">CPF</label>
          <input
            type="text"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={handleCpfChange}
            onKeyPress={handleKeyPress}
            maxLength={14}
            className={`w-full p-4 border-2 rounded-lg text-lg focus:outline-none focus:ring-2 ${
              error 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-200 focus:ring-primary/20'
            }`}
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Info Card */}
        <div className="w-full max-w-md mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Dica:</strong> Você pode acessar seus menus anteriores ou criar um novo plano personalizado.
          </p>
        </div>
      </div>

      {/* Footer Button */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={cpf.replace(/\D/g, '').length !== 11}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
            cpf.replace(/\D/g, '').length === 11
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default CpfEntryScreen;


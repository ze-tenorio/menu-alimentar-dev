import React, { useState } from 'react';
import { Check } from 'lucide-react';

const validateCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numbers)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[10])) return false;
  return true;
};

interface CpfEntryScreenProps {
  onClose: () => void;
  onSubmit: (cpf: string) => void;
}

const CpfEntryScreen: React.FC<CpfEntryScreenProps> = ({ onClose: _onClose, onSubmit }) => {
  const getSavedCpf = () => {
    try {
      const savedCpf = sessionStorage.getItem('userCpf');
      if (savedCpf) return formatCPF(savedCpf);
    } catch (error) {
      console.error('Erro ao carregar CPF do sessionStorage:', error);
    }
    return '';
  };

  const [cpf, setCpf] = useState(getSavedCpf());
  const [error, setError] = useState('');

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
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
    setCpf(formatCPF(e.target.value));
    setError('');
  };

  const handleSubmit = () => {
    const cpfNumbers = cpf.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      setError('CPF inválido. Digite os 11 dígitos.');
      return;
    }
    if (/^(\d)\1{10}$/.test(cpfNumbers)) {
      setError('CPF inválido — não pode ter todos os dígitos iguais.');
      return;
    }
    if (!validateCPF(cpf)) {
      setError('CPF inválido — verifique os números informados.');
      return;
    }
    onSubmit(cpfNumbers);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-md mx-auto w-full">
        <div className="mb-8 mt-4">
          <div className="flex flex-col items-center justify-center">
            <img src="/logo-totalpass-new.png" alt="TotalPass" className="w-44 h-auto object-contain mb-3 opacity-95" />
            <div className="flex items-center justify-center text-muted-foreground">
              <span className="text-xs mr-2">powered by</span>
              <img src="/logo-starbem.png" alt="Starbem" className="h-4 object-contain" />
            </div>
          </div>
        </div>

        <div className="text-center mb-8 w-full">
          <h2 className="app-screen-title mb-2">Acesse seus menus</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Digite seu CPF para visualizar seus planos alimentares.
          </p>
        </div>

        <div className="w-full">
          <label className="block app-muted-label mb-2">CPF</label>
          <input
            type="text"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={handleCpfChange}
            onKeyPress={handleKeyPress}
            maxLength={14}
            className={`w-full p-3.5 border rounded-lg text-base text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-ring/30 ${
              error ? 'border-destructive' : 'border-border'
            }`}
            autoFocus
          />
          {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          {cpf && !error && validateCPF(cpf) && (
            <p className="text-primary text-sm mt-2 flex items-center gap-1.5">
              <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />
              CPF válido
            </p>
          )}
        </div>

        <div className="w-full mt-8 app-card p-4 bg-muted/30">
          <p className="text-muted-foreground text-sm leading-relaxed">
            <span className="font-medium text-foreground">Dica:</span> você pode acessar menus anteriores ou criar um novo plano personalizado.
          </p>
        </div>
      </div>

      <div className="p-6 border-t border-border shrink-0">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!validateCPF(cpf)}
          className={`w-full py-3.5 rounded-lg font-medium text-base transition-colors ${
            validateCPF(cpf)
              ? 'bg-primary text-primary-foreground hover:opacity-95'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default CpfEntryScreen;

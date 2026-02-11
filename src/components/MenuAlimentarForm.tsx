import React, { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Minus, Target, Heart, Activity, Zap, Utensils, FileText, Lightbulb, AlertCircle, Mail, Phone } from 'lucide-react';

interface MenuAlimentarFormProps {
  onClose: () => void;
  onComplete: (formData: any) => void;
  initialCpf?: string; // CPF já coletado anteriormente
}

// Função para validar CPF usando o algoritmo oficial
const validateCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const numbers = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais (CPFs inválidos conhecidos)
  if (/^(\d)\1{10}$/.test(numbers)) return false;
  
  // Calcula o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[9])) return false;
  
  // Calcula o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[10])) return false;
  
  return true;
};

const MenuAlimentarForm: React.FC<MenuAlimentarFormProps> = ({ onClose, onComplete, initialCpf }) => {
  // Se já tem CPF, começa no step 2; senão, começa no step 1
  const [currentStep, setCurrentStep] = useState(initialCpf ? 2 : 1);
  const [formData, setFormData] = useState({
    // Step 1: CPF (patient_id) - pode vir preenchido
    cpf: initialCpf || '',
    
    // Step 2: Nome, Email, Telefone e Sexo Biológico
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    
    // Step 3: Dados de Saúde
    age: '',
    weight: '',
    height: '',
    
    // Step 4: Doenças/Patologias
    hasPathologies: false,
    pathologies: '',
    
    // Step 5: Objetivo
    objective: '',
    
    // Step 6: Frequência de atividade física
    activityFrequency: '',
    
    // Step 7: Intensidade do exercício
    exerciseIntensity: '',
    
    // Step 8: Tipo de dieta
    dietType: '',
    
    // Step 9: Alergias
    allergies: [] as string[],
    allergiesOther: '',
    
    // Step 10: Intolerâncias
    intolerances: [] as string[],
    intolerancesOther: '',
    
    // Step 11: Aversões alimentares
    aversions: '',
    
    // Step 12: Preferências alimentares
    preferences: ''
  });

  const [showValidationError, setShowValidationError] = useState(false);

  const totalSteps = 12;
  const progress = (currentStep / totalSteps) * 100;

  // Validação para cada step
  const validateCurrentStep = useMemo(() => {
    switch (currentStep) {
      case 1: // CPF
        return validateCPF(formData.cpf);
      case 2: // Nome, Email, Telefone e Sexo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneNumbers = formData.phone.replace(/\D/g, '');
        return formData.fullName.trim().length >= 3 && 
               emailRegex.test(formData.email) &&
               phoneNumbers.length >= 10 && phoneNumbers.length <= 11 &&
               formData.gender !== '';
      case 3: // Idade, Peso, Altura
        const age = parseInt(formData.age);
        const weight = parseFloat(formData.weight);
        const height = parseInt(formData.height);
        return (
          !isNaN(age) && age >= 1 && age <= 120 &&
          !isNaN(weight) && weight >= 20 && weight <= 300 &&
          !isNaN(height) && height >= 100 && height <= 250
        );
      case 4: // Patologias - sempre válido (tem valor default)
        return true;
      case 5: // Objetivo
        return formData.objective !== '';
      case 6: // Frequência de atividade
        return formData.activityFrequency !== '';
      case 7: // Intensidade do exercício
        return formData.exerciseIntensity !== '';
      case 8: // Tipo de dieta
        return formData.dietType !== '';
      case 9: // Alergias - sempre válido (opcional)
        return true;
      case 10: // Intolerâncias - sempre válido (opcional)
        return true;
      case 11: // Aversões - sempre válido (opcional)
        return true;
      case 12: // Preferências - sempre válido (opcional)
        return true;
      default:
        return true;
    }
  }, [currentStep, formData]);

  // Mensagens de erro para cada step
  const getValidationMessage = () => {
    switch (currentStep) {
      case 1:
        const cpfNumbers = formData.cpf.replace(/\D/g, '');
        if (cpfNumbers.length !== 11) {
          return 'Por favor, informe um CPF com 11 dígitos.';
        }
        return 'CPF inválido. Por favor, verifique os números informados.';
      case 2:
        if (formData.fullName.trim().length < 3) {
          return 'Por favor, informe seu nome completo (mínimo 3 caracteres).';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          return 'Por favor, informe um e-mail válido.';
        }
        const phoneNumbers = formData.phone.replace(/\D/g, '');
        if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
          return 'Por favor, informe um telefone válido (10 ou 11 dígitos).';
        }
        if (formData.gender === '') {
          return 'Por favor, selecione seu sexo biológico.';
        }
        return '';
      case 3:
        const messages = [];
        const age = parseInt(formData.age);
        const weight = parseFloat(formData.weight);
        const height = parseInt(formData.height);
        if (isNaN(age) || age < 1 || age > 120) {
          messages.push('idade válida (1-120 anos)');
        }
        if (isNaN(weight) || weight < 20 || weight > 300) {
          messages.push('peso válido (20-300 kg)');
        }
        if (isNaN(height) || height < 100 || height > 250) {
          messages.push('altura válida (100-250 cm)');
        }
        return messages.length > 0 ? `Por favor, informe: ${messages.join(', ')}.` : '';
      case 5:
        return 'Por favor, selecione seu objetivo.';
      case 6:
        return 'Por favor, selecione sua frequência de atividade física.';
      case 7:
        return 'Por favor, selecione a intensidade do exercício.';
      case 8:
        return 'Por favor, selecione o tipo de dieta que você segue.';
      default:
        return '';
    }
  };

  const transformFormDataToPayload = (data: typeof formData) => {
    // Converter altura de cm para metros
    const heightInMeters = data.height ? parseFloat(data.height) / 100 : 0;
    
    // Processar patologias - apenas se tiver
    const pathologiesArray = data.hasPathologies && data.pathologies
      ? data.pathologies.split(',').map(p => p.trim()).filter(p => p)
      : [];
    
    // Processar aversões - apenas se tiver
    const aversionsArray = data.aversions
      ? data.aversions.split(',').map(a => a.trim()).filter(a => a)
      : [];
    
    // Processar preferências - apenas se tiver
    const preferencesArray = data.preferences
      ? data.preferences.split(',').map(p => p.trim()).filter(p => p)
      : [];
    
    // Processar alergias - se "Outros" está selecionado, usar o texto; senão, usar array
    const allergiesArray = data.allergies.includes('Outros')
      ? (data.allergiesOther ? data.allergiesOther.split(',').map(a => a.trim()).filter(a => a) : [])
      : data.allergies.filter(a => a !== 'Outros');
    
    // Processar intolerâncias - se "Outros" está selecionado, usar o texto; senão, usar array
    const intolerancesArray = data.intolerances.includes('Outros')
      ? (data.intolerancesOther ? data.intolerancesOther.split(',').map(i => i.trim()).filter(i => i) : [])
      : data.intolerances.filter(i => i !== 'Outros');

    // Construir payload com apenas campos obrigatórios
    return {
      request_metadata: {
        patient_id: data.cpf.replace(/\D/g, ''), // Remove formatação do CPF
        provider_id: "188b33d8-a493-4753-b8dd-5f05fa6495b0",
        request_type: "plan_builder"
      },
      patient_profile: {
        full_name: data.fullName,
        gender: data.gender,
        age: parseInt(data.age) || 0,
        current_weight_kg: parseFloat(data.weight) || 0,
        height_m: heightInMeters,
        email: data.email,
        phone: '+55' + data.phone.replace(/\D/g, '')
      },
      nutritional_plan_goals: {
        primary_objective: data.objective
      },
      medical_and_supplements: {
        pathologies: pathologiesArray
      },
      dietary_restrictions_and_habits: {
        diet_type: data.dietType,
        allergies: allergiesArray,
        intolerances: intolerancesArray,
        aversions: aversionsArray,
        preferences: preferencesArray
      },
      routine_and_activity: {
        physical_activity: {
          practices: data.activityFrequency !== 'sedentario',
          frequency: data.activityFrequency,
          intensity: data.exerciseIntensity
        }
      }
    };
  };

  const handleNext = () => {
    // Validar step atual antes de avançar
    if (!validateCurrentStep) {
      setShowValidationError(true);
      return;
    }
    
    setShowValidationError(false);
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      const payload = transformFormDataToPayload(formData);
      console.log('Payload gerado:', payload);
      onComplete(payload);
    }
  };

  const handleBack = () => {
    setShowValidationError(false); // Limpar erro ao voltar
    // Se tem CPF inicial e está no step 2, volta para a tela anterior (não step 1)
    if (initialCpf && currentStep === 2) {
      onClose();
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setShowValidationError(false); // Limpar erro quando usuário edita
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberInputChange = (field: string, value: string) => {
    console.log('handleNumberInputChange chamado:', field, value);
    console.log('Estado atual antes da atualização:', formData);
    // Permite qualquer entrada por enquanto para debug
    setFormData(prev => {
      const newData = { 
        ...prev, 
        [field]: value
      };
      console.log('Novo estado:', newData);
      return newData;
    });
  };

  const handleNumberIncrement = (field: string) => {
    setFormData(prev => {
      const currentValue = parseInt(prev[field as keyof typeof prev] as string) || 0;
      return {
        ...prev,
        [field]: (currentValue + 1).toString()
      };
    });
  };

  const handleNumberDecrement = (field: string) => {
    setFormData(prev => {
      const currentValue = parseInt(prev[field as keyof typeof prev] as string) || 0;
      return {
        ...prev,
        [field]: Math.max(0, currentValue - 1).toString()
      };
    });
  };

  const handleAllergyToggle = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const handleIntoleranceToggle = (intolerance: string) => {
    setFormData(prev => ({
      ...prev,
      intolerances: prev.intolerances.includes(intolerance)
        ? prev.intolerances.filter(i => i !== intolerance)
        : [...prev.intolerances, intolerance]
    }));
  };

  const renderStep1 = () => {
    const cpfNumbers = formData.cpf.replace(/\D/g, '');
    const hasCorrectLength = cpfNumbers.length === 11;
    const isValid = validateCPF(formData.cpf);
    const showError = showValidationError && !isValid;
    
    // Mensagem de erro específica
    const getErrorMessage = () => {
      if (!hasCorrectLength) return 'CPF deve ter 11 dígitos';
      if (/^(\d)\1{10}$/.test(cpfNumbers)) return 'CPF inválido - não pode ter todos os dígitos iguais';
      return 'CPF inválido - verifique os números informados';
    };
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Identificação</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Para começar, informe seu CPF
          </p>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            CPF <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={(e) => {
              // Formatar CPF enquanto digita
              const value = e.target.value.replace(/\D/g, '');
              let formatted = value;
              if (value.length > 3) {
                formatted = value.slice(0, 3) + '.' + value.slice(3);
              }
              if (value.length > 6) {
                formatted = formatted.slice(0, 7) + '.' + value.slice(6);
              }
              if (value.length > 9) {
                formatted = formatted.slice(0, 11) + '-' + value.slice(9, 11);
              }
              handleInputChange('cpf', formatted);
            }}
            maxLength={14}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 ${
              showError 
                ? 'border-red-400 focus:ring-red-200' 
                : 'border-gray-200 focus:ring-primary/20'
            }`}
          />
          {showError && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage()}</p>
          )}
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    const nameValid = formData.fullName.trim().length >= 3;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = emailRegex.test(formData.email);
    const phoneNumbers = formData.phone.replace(/\D/g, '');
    const phoneValid = phoneNumbers.length >= 10 && phoneNumbers.length <= 11;
    const genderValid = formData.gender !== '';
    const showNameError = showValidationError && !nameValid;
    const showEmailError = showValidationError && !emailValid;
    const showPhoneError = showValidationError && !phoneValid;
    const showGenderError = showValidationError && !genderValid;

    // Função para formatar telefone
    const formatPhone = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 2) return `(${numbers}`;
      if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dados Pessoais</h2>
          <p className="text-gray-600 text-base">Informe seus dados de identificação</p>
        </div>
        
        <div className="space-y-4">
          {/* Nome Completo */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 ${
                showNameError 
                  ? 'border-red-400 focus:ring-red-200' 
                  : 'border-gray-200 focus:ring-primary/20'
              }`}
            />
            {showNameError && (
              <p className="text-red-500 text-sm mt-1">Nome deve ter pelo menos 3 caracteres</p>
            )}
          </div>

          {/* E-mail */}
          <div>
            <label className="flex items-center text-gray-700 font-medium mb-2">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              E-mail <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              placeholder="seu.email@exemplo.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 ${
                showEmailError 
                  ? 'border-red-400 focus:ring-red-200' 
                  : 'border-gray-200 focus:ring-primary/20'
              }`}
            />
            {showEmailError && (
              <p className="text-red-500 text-sm mt-1">Por favor, informe um e-mail válido</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="flex items-center text-gray-700 font-medium mb-2">
              <Phone className="w-4 h-4 mr-2 text-gray-500" />
              Telefone <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                handleInputChange('phone', formatted);
              }}
              maxLength={15}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 ${
                showPhoneError 
                  ? 'border-red-400 focus:ring-red-200' 
                  : 'border-gray-200 focus:ring-primary/20'
              }`}
            />
            {showPhoneError && (
              <p className="text-red-500 text-sm mt-1">Por favor, informe um telefone válido</p>
            )}
          </div>
          
          {/* Sexo Biológico */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Sexo Biológico <span className="text-red-500">*</span>
            </label>
            <div className={`grid grid-cols-2 gap-3 ${showGenderError ? 'p-1 border border-red-400 rounded-lg' : ''}`}>
              <button
                onClick={() => handleInputChange('gender', 'M')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.gender === 'M'
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                <span className="font-medium">Masculino</span>
              </button>
              <button
                onClick={() => handleInputChange('gender', 'F')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.gender === 'F'
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                <span className="font-medium">Feminino</span>
              </button>
            </div>
            {showGenderError && (
              <p className="text-red-500 text-sm mt-1">Por favor, selecione seu sexo biológico</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseInt(formData.height);
    
    const ageValid = !isNaN(age) && age >= 1 && age <= 120;
    const weightValid = !isNaN(weight) && weight >= 20 && weight <= 300;
    const heightValid = !isNaN(height) && height >= 100 && height <= 250;
    
    const showAgeError = showValidationError && !ageValid;
    const showWeightError = showValidationError && !weightValid;
    const showHeightError = showValidationError && !heightValid;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dados de Saúde</h2>
          <p className="text-gray-600 text-base">Qual é a sua idade, peso e altura?</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Idade (em anos) <span className="text-red-500">*</span>
              <span className="block text-sm text-gray-500 font-normal mt-1">Digite apenas números (ex: 25)</span>
            </label>
            <div className={`flex items-center bg-white border rounded-lg ${
              showAgeError ? 'border-red-400' : 'border-gray-200'
            }`}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Ex: 25"
                value={formData.age}
                onChange={(e) => {
                  // Permite apenas números inteiros
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  handleInputChange('age', value);
                }}
                className="flex-1 p-3 border-0 rounded-l-lg focus:outline-none text-gray-800"
              />
              <div className="flex flex-col">
                <button 
                  type="button"
                  onClick={() => handleNumberIncrement('age')}
                  className="p-2 text-primary hover:bg-primary/10"
                >
                  <Plus size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => handleNumberDecrement('age')}
                  className="p-2 text-primary hover:bg-primary/10"
                >
                  <Minus size={16} />
                </button>
              </div>
            </div>
            {showAgeError && (
              <p className="text-red-500 text-sm mt-1">Idade deve ser entre 1 e 120 anos</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Peso atual (em kg) <span className="text-red-500">*</span>
              <span className="block text-sm text-gray-500 font-normal mt-1">Digite apenas números (ex: 70 ou 65.5)</span>
            </label>
            <div className={`flex items-center bg-white border rounded-lg ${
              showWeightError ? 'border-red-400' : 'border-gray-200'
            }`}>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                placeholder="Ex: 70"
                value={formData.weight}
                onChange={(e) => {
                  // Permite apenas números e ponto decimal
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  // Garante apenas um ponto decimal
                  const parts = value.split('.');
                  const sanitized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : value;
                  handleInputChange('weight', sanitized);
                }}
                className="flex-1 p-3 border-0 rounded-l-lg focus:outline-none text-gray-800"
              />
              <div className="flex flex-col">
                <button 
                  type="button"
                  onClick={() => handleNumberIncrement('weight')}
                  className="p-2 text-primary hover:bg-primary/10"
                >
                  <Plus size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => handleNumberDecrement('weight')}
                  className="p-2 text-primary hover:bg-primary/10"
                >
                  <Minus size={16} />
                </button>
              </div>
            </div>
            {showWeightError && (
              <p className="text-red-500 text-sm mt-1">Peso deve ser entre 20 e 300 kg</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Altura (em centímetros) <span className="text-red-500">*</span>
              <span className="block text-sm text-gray-500 font-normal mt-1">Digite apenas números em cm (ex: 170)</span>
            </label>
            <div className={`flex items-center bg-white border rounded-lg ${
              showHeightError ? 'border-red-400' : 'border-gray-200'
            }`}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Ex: 170"
                value={formData.height}
                onChange={(e) => {
                  // Permite apenas números inteiros
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  handleInputChange('height', value);
                }}
                className="flex-1 p-3 border-0 rounded-l-lg focus:outline-none text-gray-800"
              />
              <div className="flex flex-col">
                <button 
                  type="button"
                  onClick={() => handleNumberIncrement('height')}
                  className="p-2 text-primary hover:bg-primary/10"
                >
                  <Plus size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => handleNumberDecrement('height')}
                  className="p-2 text-primary hover:bg-primary/10"
                >
                  <Minus size={16} />
                </button>
              </div>
            </div>
            {showHeightError && (
              <p className="text-red-500 text-sm mt-1">Altura deve ser entre 100 e 250 cm</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Sobre sua Saúde</h2>
        <p className="text-gray-600 text-base leading-relaxed">
          Você possui alguma doença ou condição de saúde?
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <button
            onClick={() => handleInputChange('hasPathologies', false)}
            className={`w-full p-4 rounded-lg border-2 transition-colors ${
              formData.hasPathologies === false
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            <span className="font-medium">Não</span>
          </button>
          <button
            onClick={() => handleInputChange('hasPathologies', true)}
            className={`w-full p-4 rounded-lg border-2 transition-colors ${
              formData.hasPathologies === true
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            <span className="font-medium">Sim</span>
          </button>
        </div>

        {formData.hasPathologies && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Quais doenças?</label>
            <textarea
              placeholder="Liste as doenças ou condições de saúde, separadas por vírgula"
              value={formData.pathologies}
              onChange={(e) => handleInputChange('pathologies', e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderStep5 = () => {
    const isValid = formData.objective !== '';
    const showError = showValidationError && !isValid;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Objetivo</h2>
          <p className="text-gray-600 text-base">
            Qual é o seu objetivo? <span className="text-red-500">*</span>
          </p>
        </div>
        
        <div className={`space-y-3 ${showError ? 'p-2 border border-red-400 rounded-lg' : ''}`}>
          {[
            { id: 'emagrecimento', title: '🔻 Emagrecimento', description: 'Perder peso de forma saudável', icon: '🔻' },
            { id: 'manutencao', title: '⚖️ Manutenção', description: 'Manter peso com saúde', icon: '⚖️' },
            { id: 'ganho_massa', title: '🔺 Ganho de Massa', description: 'Aumentar a massa muscular', icon: '🔺' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => handleInputChange('objective', option.id)}
              className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                formData.objective === option.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{option.icon}</span>
                <div>
                  <div className="font-medium text-gray-800">{option.title}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        {showError && (
          <p className="text-red-500 text-sm">Por favor, selecione um objetivo</p>
        )}
      </div>
    );
  };

  const renderStep6 = () => {
    const isValid = formData.activityFrequency !== '';
    const showError = showValidationError && !isValid;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequência de atividade física</h2>
          <p className="text-gray-600 text-base">
            Quantas vezes por semana você pratica atividade física? <span className="text-red-500">*</span>
          </p>
        </div>
        
        <div className={`space-y-3 ${showError ? 'p-2 border border-red-400 rounded-lg' : ''}`}>
          {[
            { id: 'sedentario', title: 'Sedentário', description: 'Não pratico atividade física' },
            { id: 'leve', title: '1-2 vezes', description: 'Por semana' },
            { id: 'moderado', title: '3-4 vezes', description: 'Por semana' },
            { id: 'ativo', title: '5-6 vezes', description: 'Por semana' },
            { id: 'muito_ativo', title: 'Diariamente', description: 'Todos os dias' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => handleInputChange('activityFrequency', option.id)}
              className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                formData.activityFrequency === option.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div>
                <div className="font-medium text-gray-800">{option.title}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
        {showError && (
          <p className="text-red-500 text-sm">Por favor, selecione sua frequência de atividade física</p>
        )}
      </div>
    );
  };

  const renderStep7 = () => {
    const isValid = formData.exerciseIntensity !== '';
    const showError = showValidationError && !isValid;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nível de Intensidade</h2>
          <p className="text-gray-600 text-base">
            Qual a intensidade do exercício que você executa? <span className="text-red-500">*</span>
          </p>
        </div>
        
        <div className={`space-y-3 ${showError ? 'p-2 border border-red-400 rounded-lg' : ''}`}>
          {[
            {
              id: 'leve',
              title: 'Leve',
              description: 'Caminhada lenta, alongamentos simples, tarefas domésticas leves.'
            },
            {
              id: 'moderada',
              title: 'Moderada',
              description: 'Caminhada rápida, natação leve, ciclamento moderado.'
            },
            {
              id: 'intensa',
              title: 'Intensa',
              description: 'Corrida, natação rápida, HIIT, musculação com alta carga.'
            },
            {
              id: 'nao_se_aplica',
              title: 'Não se aplica',
              description: ''
            }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => handleInputChange('exerciseIntensity', option.id)}
              className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                formData.exerciseIntensity === option.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div>
                <div className="font-medium text-gray-800">{option.title}</div>
                {option.description && (
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                )}
              </div>
            </button>
          ))}
        </div>
        {showError && (
          <p className="text-red-500 text-sm">Por favor, selecione a intensidade do exercício</p>
        )}
      </div>
    );
  };

  const renderStep8 = () => {
    const isValid = formData.dietType !== '';
    const showError = showValidationError && !isValid;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tipo de Dieta</h2>
          <p className="text-gray-600 text-base">
            Qual tipo de dieta você segue? <span className="text-red-500">*</span>
          </p>
        </div>
        
        <div className={`space-y-3 ${showError ? 'p-2 border border-red-400 rounded-lg' : ''}`}>
          {[
            { id: 'onivora', title: 'Onívora', description: 'Come de tudo' },
            { id: 'vegetariana', title: 'Vegetariana', description: 'Não come carne' },
            { id: 'vegana', title: 'Vegana', description: 'Sem produtos de origem animal' },
            { id: 'pescetariana', title: 'Pescetariana', description: 'Come peixe, mas não carne' },
            { id: 'low_carb', title: 'Low Carb', description: 'Poucos carboidratos' },
            { id: 'cetogenica', title: 'Cetogênica', description: 'Muito baixo carboidrato' }
          ].map((diet) => (
            <button
              key={diet.id}
              onClick={() => handleInputChange('dietType', diet.id)}
              className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                formData.dietType === diet.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div>
                <div className="font-medium text-gray-800">{diet.title}</div>
                <div className="text-sm text-gray-600">{diet.description}</div>
              </div>
            </button>
          ))}
        </div>
        {showError && (
          <p className="text-red-500 text-sm">Por favor, selecione o tipo de dieta que você segue</p>
        )}
      </div>
    );
  };

  const renderStep9 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Utensils className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Alergias Alimentares</h2>
        <p className="text-gray-600 text-base">Você tem alergia a algum alimento? Selecione todos que se aplicam</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {[
          'Ovo',
          'Amendoim',
          'Castanhas',
          'Leite',
          'Trigo',
          'Soja',
          'Peixe',
          'Frutos do mar',
          'Outros'
        ].map((allergy) => (
          <button
            key={allergy}
            type="button"
            onClick={() => handleAllergyToggle(allergy)}
            className={`p-3 rounded-lg border-2 transition-colors text-sm ${
              formData.allergies.includes(allergy)
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {allergy}
          </button>
        ))}
      </div>
      
      {/* Caixa de texto para "Outros" */}
      {formData.allergies.includes('Outros') && (
        <div>
          <label className="block text-gray-700 font-medium mb-2">Especifique as outras alergias:</label>
          <textarea
            placeholder="Liste as alergias, separadas por vírgula (ex: glúten, corantes, conservantes)"
            value={formData.allergiesOther}
            onChange={(e) => handleInputChange('allergiesOther', e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            rows={3}
          />
        </div>
      )}
      
      <button
        type="button"
        onClick={() => {
          handleInputChange('allergies', []);
          handleInputChange('allergiesOther', '');
        }}
        className={`w-full p-3 rounded-lg border-2 transition-colors text-sm ${
          formData.allergies.length === 0
            ? 'bg-primary/10 border-primary text-primary'
            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
        }`}
      >
        Não tenho alergias
      </button>
    </div>
  );

  const renderStep10 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Utensils className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Intolerâncias Alimentares</h2>
        <p className="text-gray-600 text-base">Você tem intolerância a algum alimento? Selecione todos que se aplicam</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {[
          'Lactose',
          'Glúten',
          'Frutose',
          'Outros'
        ].map((intolerance) => (
          <button
            key={intolerance}
            type="button"
            onClick={() => handleIntoleranceToggle(intolerance)}
            className={`p-3 rounded-lg border-2 transition-colors text-sm ${
              formData.intolerances.includes(intolerance)
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {intolerance}
          </button>
        ))}
      </div>
      
      {/* Caixa de texto para "Outros" */}
      {formData.intolerances.includes('Outros') && (
        <div>
          <label className="block text-gray-700 font-medium mb-2">Especifique as outras intolerâncias:</label>
          <textarea
            placeholder="Liste as intolerâncias, separadas por vírgula (ex: sorbitol, sacarose, histamina)"
            value={formData.intolerancesOther}
            onChange={(e) => handleInputChange('intolerancesOther', e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            rows={3}
          />
        </div>
      )}
      
      <button
        type="button"
        onClick={() => {
          handleInputChange('intolerances', []);
          handleInputChange('intolerancesOther', '');
        }}
        className={`w-full p-3 rounded-lg border-2 transition-colors text-sm ${
          formData.intolerances.length === 0
            ? 'bg-primary/10 border-primary text-primary'
            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
        }`}
      >
        Não tenho intolerâncias
      </button>
    </div>
  );

  const renderStep11 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Utensils className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Aversões Alimentares</h2>
        <p className="text-gray-600 text-base">Tem algum alimento que você não goste ou prefira evitar?</p>
      </div>
      
      <div>
        <textarea
          placeholder="Liste os alimentos que você não gosta, separados por vírgula (ex: brócolis, berinjela, cebola)"
          value={formData.aversions}
          onChange={(e) => handleInputChange('aversions', e.target.value)}
          className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep12 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Preferências Alimentares</h2>
        <p className="text-gray-600 text-base">Quais alimentos você gosta e gostaria de incluir nas suas refeições?</p>
      </div>
      
      <div>
        <textarea
          placeholder="Liste seus alimentos favoritos ou preferidos, separados por vírgula (ex: frango, arroz integral, batata doce)"
          value={formData.preferences}
          onChange={(e) => handleInputChange('preferences', e.target.value)}
          className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          rows={4}
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      case 8: return renderStep8();
      case 9: return renderStep9();
      case 10: return renderStep10();
      case 11: return renderStep11();
      case 12: return renderStep12();
      default: return renderStep1();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 mx-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Passo {currentStep} de {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderCurrentStep()}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        {/* Mensagem de erro de validação */}
        {showValidationError && !validateCurrentStep && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-red-700 text-sm">{getValidationMessage()}</span>
          </div>
        )}
        
        <button
          onClick={handleNext}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
            validateCurrentStep
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentStep === totalSteps ? 'Gerar Menu' : 'Continuar'}
        </button>
      </div>
    </div>
  );
};

export default MenuAlimentarForm;

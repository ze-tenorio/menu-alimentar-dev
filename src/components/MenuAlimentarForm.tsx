import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, Target, Heart, Activity, Zap, Utensils, FileText, Lightbulb } from 'lucide-react';

interface MenuAlimentarFormProps {
  onClose: () => void;
  onComplete: (formData: any) => void;
  initialCpf?: string; // CPF já coletado anteriormente
}

const MenuAlimentarForm: React.FC<MenuAlimentarFormProps> = ({ onClose, onComplete, initialCpf }) => {
  // Se já tem CPF, começa no step 2; senão, começa no step 1
  const [currentStep, setCurrentStep] = useState(initialCpf ? 2 : 1);
  const [formData, setFormData] = useState({
    // Step 1: CPF (patient_id) - pode vir preenchido
    cpf: initialCpf || '',
    
    // Step 2: Nome e Sexo Biológico
    fullName: '',
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

  const totalSteps = 12;
  const progress = (currentStep / totalSteps) * 100;

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
        request_type: "plan_builder"
      },
      patient_profile: {
        full_name: data.fullName,
        gender: data.gender,
        age: parseInt(data.age) || 0,
        current_weight_kg: parseFloat(data.weight) || 0,
        height_m: heightInMeters
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
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      const payload = transformFormDataToPayload(formData);
      console.log('Payload gerado:', payload);
      onComplete(payload);
    }
  };

  const handleBack = () => {
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

  const renderStep1 = () => (
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
        <label className="block text-gray-700 font-medium mb-2">CPF</label>
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
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-800"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dados Pessoais</h2>
        <p className="text-gray-600 text-base">Informe seu nome completo e sexo biológico</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Nome Completo</label>
          <input
            type="text"
            placeholder="Digite seu nome completo"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-800"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Sexo Biológico</label>
          <div className="grid grid-cols-2 gap-3">
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
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
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
            Idade (em anos)
            <span className="block text-sm text-gray-500 font-normal mt-1">Digite apenas números (ex: 25)</span>
          </label>
          <div className="flex items-center bg-white border border-gray-200 rounded-lg">
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
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Peso atual (em kg)
            <span className="block text-sm text-gray-500 font-normal mt-1">Digite apenas números (ex: 70 ou 65.5)</span>
          </label>
          <div className="flex items-center bg-white border border-gray-200 rounded-lg">
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
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Altura (em centímetros)
            <span className="block text-sm text-gray-500 font-normal mt-1">Digite apenas números em cm (ex: 170)</span>
          </label>
          <div className="flex items-center bg-white border border-gray-200 rounded-lg">
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
        </div>
      </div>
    </div>
  );

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

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Objetivo</h2>
        <p className="text-gray-600 text-base">Qual é o seu objetivo?</p>
      </div>
      
      <div className="space-y-3">
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
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequência de atividade física</h2>
        <p className="text-gray-600 text-base">Quantas vezes por semana você pratica atividade física?</p>
      </div>
      
      <div className="space-y-3">
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
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Nível de Intensidade</h2>
        <p className="text-gray-600 text-base">Qual a intensidade do exercício que você executa?</p>
      </div>
      
      <div className="space-y-3">
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
    </div>
  );

  const renderStep8 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tipo de Dieta</h2>
        <p className="text-gray-600 text-base">Qual tipo de dieta você segue?</p>
      </div>
      
      <div className="space-y-3">
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
    </div>
  );

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
        <button
          onClick={handleNext}
          className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default MenuAlimentarForm;

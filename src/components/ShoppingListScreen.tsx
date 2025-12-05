import React, { useState } from 'react';
import { ArrowLeft, Download, Check } from 'lucide-react';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
}

interface ShoppingCategory {
  id: string;
  name: string;
  items: ShoppingItem[];
}

interface ShoppingListScreenProps {
  onClose: () => void;
  onBack: () => void;
}

const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({ onClose, onBack }) => {
  const [allSelected, setAllSelected] = useState(false);
  
  const [categories, setCategories] = useState<ShoppingCategory[]>([
    {
      id: 'cereals',
      name: 'Cereais e grãos',
      items: [
        { id: '1', name: 'Pão Francês integral', quantity: '7 unidades (350 g)', checked: false },
        { id: '2', name: 'Feijão', quantity: '980 gramas (980 g)', checked: false },
        { id: '3', name: 'Arroz integral', quantity: '500 gramas (500 g)', checked: false },
        { id: '4', name: 'Aveia em flocos', quantity: '200 gramas (200 g)', checked: false }
      ]
    },
    {
      id: 'spices',
      name: 'Temperos e condimentos',
      items: [
        { id: '5', name: 'Pimenta do reino em pó', quantity: '7 gramas (7 g)', checked: true },
        { id: '6', name: 'Sal refinado', quantity: '11 colheres (café) (22 g)', checked: false },
        { id: '7', name: 'Alho', quantity: '2 cabeças (50 g)', checked: false },
        { id: '8', name: 'Cebola', quantity: '3 unidades (300 g)', checked: false },
        { id: '9', name: 'Orégano', quantity: '10 gramas (10 g)', checked: false }
      ]
    },
    {
      id: 'oils',
      name: 'Óleos vegetais',
      items: [
        { id: '10', name: 'Azeite de oliva', quantity: '1 unidade média (56 g)', checked: false },
        { id: '11', name: 'Óleo de coco', quantity: '200 gramas (200 g)', checked: false }
      ]
    },
    {
      id: 'sweets',
      name: 'Açúcares e doces',
      items: [
        { id: '12', name: 'Pasta de amendoim', quantity: '161 gramas (161 g)', checked: true },
        { id: '13', name: 'Mel', quantity: '300 gramas (300 g)', checked: false }
      ]
    },
    {
      id: 'eggs',
      name: 'Ovos',
      items: [
        { id: '14', name: 'Ovo de galinha', quantity: '35 unidades (1575 g)', checked: false }
      ]
    },
    {
      id: 'nuts',
      name: 'Oleaginosas e sementes',
      items: [
        { id: '15', name: 'Castanha de caju', quantity: '35 unidades médias (105 g)', checked: false },
        { id: '16', name: 'Semente de girassol', quantity: '175 gramas (175 g)', checked: false },
        { id: '17', name: 'Amêndoas', quantity: '100 gramas (100 g)', checked: false },
        { id: '18', name: 'Nozes', quantity: '80 gramas (80 g)', checked: false }
      ]
    },
    {
      id: 'fruits',
      name: 'Frutas',
      items: [
        { id: '19', name: 'Banana', quantity: '6 unidades (600 g)', checked: false },
        { id: '20', name: 'Maçã', quantity: '4 unidades (400 g)', checked: false },
        { id: '21', name: 'Abacate', quantity: '2 unidades (400 g)', checked: false }
      ]
    },
    {
      id: 'vegetables',
      name: 'Verduras e legumes',
      items: [
        { id: '22', name: 'Brócolis', quantity: '300 gramas (300 g)', checked: false },
        { id: '23', name: 'Cenoura', quantity: '500 gramas (500 g)', checked: false },
        { id: '24', name: 'Tomate', quantity: '4 unidades (400 g)', checked: false },
        { id: '25', name: 'Alface', quantity: '1 unidade (200 g)', checked: false }
      ]
    }
  ]);

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            items: category.items.map(item => 
              item.id === itemId 
                ? { ...item, checked: !item.checked }
                : item
            )
          }
        : category
    ));
  };

  const selectAllItems = () => {
    setCategories(prev => prev.map(category => ({
      ...category,
      items: category.items.map(item => ({ ...item, checked: !allSelected }))
    })));
    
    setAllSelected(!allSelected);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 flex items-center justify-between px-4 py-3">
        <button onClick={onBack} className="text-white hover:text-gray-300">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-white text-lg font-semibold">Lista de compras</h1>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          <Download size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Date Range */}
          <div className="mb-4">
            <p className="text-primary text-lg font-medium text-center">Segunda a Domingo</p>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Antes de ir ao supermercado:</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Verifique e marque abaixo o que você já tem na sua despensa e geladeira.</li>
              <li>• Reaproveite alimentos similares.</li>
              <li>• Compre os temperos e ervas que serão usados ao preparo das refeições.</li>
            </ul>
          </div>

          {/* Select All Button */}
          <div className="mb-6 text-right">
            <button 
              onClick={selectAllItems}
              className="text-primary text-sm font-medium hover:underline"
            >
              {allSelected ? 'Desmarcar todos' : 'Selecionar todos'}
            </button>
          </div>

          {/* Categories */}
          {categories.map((category) => (
            <div key={category.id} className="mb-4">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
              </div>
              
              <div className="space-y-1">
                {category.items.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-gray-50 rounded-lg p-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.quantity}</p>
                    </div>
                    
                    <button
                      onClick={() => toggleItem(category.id, item.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        item.checked
                          ? 'bg-primary border-primary text-white'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {item.checked && <Check size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingListScreen;

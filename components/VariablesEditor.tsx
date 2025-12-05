import React, { useState, useEffect } from 'react';
import { Variable } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface VariablesEditorProps {
  variables: Variable[];
  onUpdateVariables: (variables: Variable[]) => void;
  isDirty: boolean;
  onSetDirty: (isDirty: boolean) => void;
}

const VariablesEditor: React.FC<VariablesEditorProps> = ({ variables, onUpdateVariables, isDirty, onSetDirty }) => {
  const [localVariables, setLocalVariables] = useState<Variable[]>(variables || []);

  useEffect(() => {
    setLocalVariables(variables || []);
  }, [variables]);

  useEffect(() => {
    const dirty = JSON.stringify(localVariables) !== JSON.stringify(variables || []);
    onSetDirty(dirty);
  }, [localVariables, variables, onSetDirty]);

  const handleAddVariable = () => {
    const newVar: Variable = {
      id: `var_${Date.now()}`,
      name: 'Nova Variável',
      initialValue: 0,
      type: 'number'
    };
    setLocalVariables([...localVariables, newVar]);
  };

  const handleDeleteVariable = (id: string) => {
    setLocalVariables(localVariables.filter(v => v.id !== id));
  };

  const handleUpdateVariable = (id: string, field: keyof Variable, value: any) => {
    setLocalVariables(localVariables.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleSave = () => {
    onUpdateVariables(localVariables);
  };
  
  const handleUndo = () => {
    setLocalVariables(variables || []);
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <p className="text-brand-text-dim mt-1">
          Crie variáveis numéricas para rastrear status, inventário ou pontuação (ex: "Ouro", "Sanidade", "Chaves") que podem ser usadas para lógica condicional em cenas.
        </p>
      </div>

      <div className="bg-brand-surface p-6 rounded-md border border-brand-border">
          <div className="flex justify-between items-center border-b border-brand-border pb-4 mb-4">
            <h3 className="text-lg font-semibold text-brand-text">Lista de Variáveis</h3>
            <button
              onClick={handleAddVariable}
              className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Adicionar Variável
            </button>
          </div>
          
          {localVariables.length > 0 ? (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-bold text-brand-text-dim border-b border-brand-border">
                  <div className="col-span-5">Nome da Variável</div>
                  <div className="col-span-3 text-center">Valor Inicial</div>
                  <div className="col-span-3 text-center">Tipo</div>
                  <div className="col-span-1"></div>
              </div>
              {localVariables.map((variable) => (
                <div key={variable.id} className="grid grid-cols-12 gap-4 items-center bg-brand-bg border border-brand-border rounded-md p-3">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={variable.name}
                      onChange={(e) => handleUpdateVariable(variable.id, 'name', e.target.value)}
                      className="w-full bg-brand-surface border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"
                      placeholder="Nome (ex: Moedas)"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={variable.initialValue}
                      onChange={(e) => handleUpdateVariable(variable.id, 'initialValue', Number(e.target.value))}
                      className="w-full bg-brand-surface border border-brand-border rounded-md px-3 py-2 text-sm text-center focus:ring-0"
                    />
                  </div>
                   <div className="col-span-3 text-center text-sm text-brand-text-dim bg-brand-surface/50 py-2 rounded">
                      Número
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => handleDeleteVariable(variable.id)}
                      className="p-2 text-brand-text-dim hover:text-red-500 transition-colors"
                      title="Excluir variável"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-brand-border rounded-md">
              <p className="text-brand-text-dim">Nenhuma variável criada.</p>
            </div>
          )}
      </div>

      <div className="fixed bottom-6 right-10 z-10 flex gap-2">
          <button
            onClick={handleUndo}
            disabled={!isDirty}
            className="px-6 py-2 bg-brand-surface border border-brand-border text-brand-text-dim font-semibold rounded-md hover:bg-brand-border/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title={isDirty ? "Desfazer alterações" : "Nenhuma alteração para desfazer"}
          >
            Desfazer
          </button>
          <button
              onClick={handleSave}
              disabled={!isDirty}
              className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
              title={isDirty ? "Salvar alterações nas variáveis" : "Nenhuma alteração para salvar"}
          >
              Salvar
          </button>
      </div>
    </div>
  );
};

export default VariablesEditor;
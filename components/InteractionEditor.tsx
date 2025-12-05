


import React, { useState } from 'react';
import { Choice, Scene, Variable, Condition, Effect } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UploadIcon } from './icons/UploadIcon';
import { AdjustmentsHorizontalIcon } from './icons/AdjustmentsHorizontalIcon'; // Assuming I can reuse or create this, but sticking to existing ones or simple text for now if needed. I'll stick to text/structure.

interface ChoiceEditorProps {
  choices: Choice[];
  onUpdateChoices: (choices: Choice[]) => void;
  allScenes: Scene[];
  currentSceneId: string;
  variables: Variable[];
}

const OPERATORS = [
    { value: '>', label: 'Maior que' },
    { value: '<', label: 'Menor que' },
    { value: '>=', label: 'Maior ou Igual' },
    { value: '<=', label: 'Menor ou Igual' },
    { value: '==', label: 'Igual a' },
    { value: '!=', label: 'Diferente de' },
];

const ChoiceItem: React.FC<{
  choice: Choice;
  index: number;
  onUpdate: (index: number, choice: Choice) => void;
  onRemove: (index: number) => void;
  allScenes: Scene[];
  currentSceneId: string;
  variables: Variable[];
}> = ({ choice, index, onUpdate, onRemove, allScenes, currentSceneId, variables }) => {
    
    const [showLogic, setShowLogic] = useState(false);

    const handleChoiceChange = (field: keyof Choice, value: any) => {
        onUpdate(index, { ...choice, [field]: value });
    };

    const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    handleChoiceChange('soundEffect', event.target.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // Helper for Conditions
    const handleConditionChange = (field: keyof Condition, value: any) => {
        const currentCondition = choice.reqCondition || { variableId: variables[0]?.id || '', operator: '>=', value: 1 };
        handleChoiceChange('reqCondition', { ...currentCondition, [field]: value });
    };

    const toggleCondition = (enable: boolean) => {
        if (enable) {
             handleChoiceChange('reqCondition', { variableId: variables[0]?.id || '', operator: '>=', value: 1 });
        } else {
             handleChoiceChange('reqCondition', undefined);
        }
    };

    // Helper for Effects
    const addEffect = () => {
        const newEffect: Effect = { variableId: variables[0]?.id || '', operation: 'add', value: 1 };
        const currentEffects = choice.effects || [];
        handleChoiceChange('effects', [...currentEffects, newEffect]);
    };

    const removeEffect = (effectIndex: number) => {
        const currentEffects = choice.effects || [];
        handleChoiceChange('effects', currentEffects.filter((_, i) => i !== effectIndex));
    };

    const updateEffect = (effectIndex: number, field: keyof Effect, value: any) => {
        const currentEffects = choice.effects || [];
        const updatedEffects = [...currentEffects];
        updatedEffects[effectIndex] = { ...updatedEffects[effectIndex], [field]: value };
        handleChoiceChange('effects', updatedEffects);
    };
    
    const otherScenes = allScenes.filter(s => s.id !== currentSceneId);

    const whiteChevron = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke-width='1.5' stroke='white'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='m5.25 7.5 4.5 4.5 4.5-4.5' /%3e%3c/svg%3e";
    const selectBaseClasses = "w-full bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text appearance-none bg-no-repeat pr-8 focus:ring-0";
    const selectStyle = { backgroundImage: `url("${whiteChevron}")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em' };
    const optionBaseClasses = "bg-brand-surface text-brand-text";
    const optionDimClasses = "bg-brand-surface text-brand-text-dim";
    
    return (
      <div key={choice.id} className="relative pt-6 p-4 bg-brand-bg rounded-md border border-brand-border/50">
        <button
            onClick={() => onRemove(index)}
            className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-bl-lg hover:bg-red-600 transition-colors"
            title="Remover escolha"
        >
            <TrashIcon className="w-5 h-5" />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col h-full">
            <label htmlFor={`choice-text-${index}`} className="block text-sm font-medium text-brand-text-dim mb-1">Texto da Escolha</label>
            <textarea
              id={`choice-text-${index}`}
              value={choice.text}
              onChange={e => handleChoiceChange('text', e.target.value)}
              placeholder="Ex: Entrar na caverna escura."
              rows={3}
              className="w-full flex-grow bg-brand-border/30 border border-brand-border rounded-md px-3 py-2 text-sm focus:ring-0"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-dim mb-1">Cena de Destino</label>
              <select
                value={choice.goToScene || ''}
                onChange={e => handleChoiceChange('goToScene', e.target.value)}
                className={`${selectBaseClasses} mb-2`}
                style={selectStyle}
              >
                <option className={optionDimClasses} value="">Selecione a cena...</option>
                {otherScenes.map(scene => (
                  <option
                    className={optionBaseClasses}
                    key={scene.id}
                    value={scene.id}
                  >
                    {scene.name} ({scene.id}) {scene.isEndingScene ? '(Fim de Jogo)' : ''}
                  </option>
                ))}
              </select>
            </div>
            
             <button
                onClick={() => setShowLogic(!showLogic)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-semibold transition-colors flex items-center justify-between ${showLogic ? 'bg-brand-primary/20 text-brand-primary' : 'bg-brand-surface text-brand-text-dim hover:text-brand-text'}`}
            >
                <span>Lógica & Efeitos</span>
                <span>{showLogic ? '▲' : '▼'}</span>
            </button>
          </div>
        </div>

        {showLogic && (
            <div className="mt-4 p-4 bg-brand-surface rounded border border-brand-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
                {variables.length === 0 ? (
                    <p className="text-sm text-brand-text-dim italic">Você precisa criar variáveis na aba "Informações do Jogo" > "Variáveis" para usar lógica avançada.</p>
                ) : (
                    <div className="space-y-6">
                        {/* Conditions Section */}
                        <div>
                            <div className="flex items-center mb-2">
                                <input 
                                    type="checkbox" 
                                    id={`condition-toggle-${index}`}
                                    checked={!!choice.reqCondition} 
                                    onChange={(e) => toggleCondition(e.target.checked)}
                                    className="custom-checkbox"
                                />
                                <label htmlFor={`condition-toggle-${index}`} className="ml-2 text-sm font-bold text-brand-text">Mostrar esta escolha apenas se...</label>
                            </div>
                            
                            {choice.reqCondition && (
                                <div className="flex gap-2 items-center ml-6">
                                    <select
                                        value={choice.reqCondition.variableId}
                                        onChange={(e) => handleConditionChange('variableId', e.target.value)}
                                        className="bg-brand-bg border border-brand-border rounded px-2 py-1 text-sm text-brand-text"
                                    >
                                        {variables.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                    </select>
                                    <select
                                        value={choice.reqCondition.operator}
                                        onChange={(e) => handleConditionChange('operator', e.target.value)}
                                        className="bg-brand-bg border border-brand-border rounded px-2 py-1 text-sm text-brand-text"
                                    >
                                        {OPERATORS.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                                    </select>
                                    <input
                                        type="number"
                                        value={choice.reqCondition.value}
                                        onChange={(e) => handleConditionChange('value', Number(e.target.value))}
                                        className="bg-brand-bg border border-brand-border rounded px-2 py-1 text-sm text-brand-text w-20"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Effects Section */}
                        <div>
                            <h5 className="text-sm font-bold text-brand-text mb-2">Efeitos ao clicar:</h5>
                            <div className="space-y-2 ml-6">
                                {choice.effects?.map((effect, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <select
                                            value={effect.variableId}
                                            onChange={(e) => updateEffect(idx, 'variableId', e.target.value)}
                                            className="bg-brand-bg border border-brand-border rounded px-2 py-1 text-sm text-brand-text"
                                        >
                                            {variables.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                        </select>
                                        <select
                                            value={effect.operation}
                                            onChange={(e) => updateEffect(idx, 'operation', e.target.value)}
                                            className="bg-brand-bg border border-brand-border rounded px-2 py-1 text-sm text-brand-text"
                                        >
                                            <option value="add">Adicionar (+)</option>
                                            <option value="subtract">Remover (-)</option>
                                            <option value="set">Definir (=)</option>
                                        </select>
                                        <input
                                            type="number"
                                            value={effect.value}
                                            onChange={(e) => updateEffect(idx, 'value', Number(e.target.value))}
                                            className="bg-brand-bg border border-brand-border rounded px-2 py-1 text-sm text-brand-text w-20"
                                        />
                                        <button onClick={() => removeEffect(idx)} className="text-red-400 hover:text-red-300 px-2"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                <button onClick={addEffect} className="text-sm text-brand-primary hover:text-brand-primary-hover flex items-center gap-1">
                                    <PlusIcon className="w-3 h-3" /> Adicionar Efeito
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-brand-border/50 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
                <label className="block text-sm font-medium text-brand-text-dim">Efeito Sonoro (opcional)</label>
                {choice.soundEffect ? (
                  <div className="flex items-center gap-2 mt-1">
                    <audio controls src={choice.soundEffect} className="w-full max-w-sm h-8"></audio>
                    <button onClick={() => handleChoiceChange('soundEffect', undefined)} className="p-1 text-brand-text-dim hover:text-red-500" title="Remover som">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                <label className="mt-1 inline-flex items-center px-3 py-1.5 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors cursor-pointer text-sm">
                    <UploadIcon className="w-4 h-4 mr-2" /> Carregar Áudio
                    <input type="file" accept="audio/*" onChange={(e) => handleSoundUpload(e)} className="hidden" />
                </label>
                )}
            </div>
            <div>
                <label htmlFor={`transition-type-${index}`} className="block text-sm font-medium text-brand-text-dim">Transição Visual (opcional)</label>
                <select
                    id={`transition-type-${index}`}
                    value={choice.transitionType || 'none'}
                    onChange={e => handleChoiceChange('transitionType', e.target.value)}
                    className={`${selectBaseClasses} mt-1`}
                    style={selectStyle}
                >
                    <option className={optionBaseClasses} value="none">Sem transição (Padrão)</option>
                    <option className={optionBaseClasses} value="fade">Fade</option>
                    <option className={optionBaseClasses} value="wipe-down">Cortina (Cima)</option>
                    <option className={optionBaseClasses} value="wipe-up">Cortina (Baixo)</option>
                    <option className={optionBaseClasses} value="wipe-right">Cortina (Esquerda)</option>
                    <option className={optionBaseClasses} value="wipe-left">Cortina (Direita)</option>
                </select>
            </div>
        </div>
      </div>
    );
};


const ChoiceEditor: React.FC<ChoiceEditorProps> = ({ choices = [], onUpdateChoices, allScenes, currentSceneId, variables }) => {
  const handleAddChoice = () => {
    const newChoice: Choice = {
      id: `choice_${Math.random().toString(36).substring(2, 9)}`,
      text: 'Nova escolha',
    };
    onUpdateChoices([...choices, newChoice]);
  };

  const handleRemoveChoice = (index: number) => {
    onUpdateChoices(choices.filter((_, i) => i !== index));
  };
  
  const handleUpdateChoice = (index: number, updatedChoice: Choice) => {
    const newChoices = [...choices];
    newChoices[index] = updatedChoice;
    onUpdateChoices(newChoices);
  };

  return (
    <>
      <div className="space-y-4">
        {choices.map((choice, index) => (
            <ChoiceItem
                key={choice.id}
                choice={choice}
                index={index}
                onUpdate={handleUpdateChoice}
                onRemove={handleRemoveChoice}
                allScenes={allScenes}
                currentSceneId={currentSceneId}
                variables={variables}
            />
        ))}
         {choices.length === 0 && <p className="text-center text-brand-text-dim">Nenhuma escolha definida para esta cena.</p>}
      </div>
       <div className="flex justify-end mt-4">
        <button 
            onClick={handleAddChoice} 
            className="flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors duration-200"
        >
            <PlusIcon className="w-5 h-5 mr-2" />
            Adicionar Escolha
        </button>
      </div>
    </>
  );
};

export default ChoiceEditor;
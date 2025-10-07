

import React from 'react';
import { Choice, Scene } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UploadIcon } from './icons/UploadIcon';

interface ChoiceEditorProps {
  choices: Choice[];
  onUpdateChoices: (choices: Choice[]) => void;
  allScenes: Scene[];
  currentSceneId: string;
}

const ChoiceItem: React.FC<{
  choice: Choice;
  index: number;
  onUpdate: (index: number, choice: Choice) => void;
  onRemove: (index: number) => void;
  allScenes: Scene[];
  currentSceneId: string;
}> = ({ choice, index, onUpdate, onRemove, allScenes, currentSceneId }) => {
    
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
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-brand-border/50 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
                <label className="block text-sm font-medium text-brand-text-dim">Efeito Sonoro (opcional)</label>
                <p className="text-xs text-brand-text-dim mb-2">Será tocado quando a escolha for feita.</p>
                {choice.soundEffect ? (
                  <div className="flex items-center gap-2">
                    <audio controls src={choice.soundEffect} className="w-full max-w-sm"></audio>
                    <button onClick={() => handleChoiceChange('soundEffect', undefined)} className="p-2 text-brand-text-dim hover:text-red-500" title="Remover som">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                <label className="inline-flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary font-semibold rounded-md hover:bg-brand-primary/30 transition-colors cursor-pointer">
                    <UploadIcon className="w-5 h-5 mr-2" /> Carregar Áudio
                    <input type="file" accept="audio/*" onChange={(e) => handleSoundUpload(e)} className="hidden" />
                </label>
                )}
            </div>
            <div>
                <label htmlFor={`transition-type-${index}`} className="block text-sm font-medium text-brand-text-dim">Transição Visual (opcional)</label>
                <p className="text-xs text-brand-text-dim mb-2">Efeito visual ao mudar de cena.</p>
                <select
                    id={`transition-type-${index}`}
                    value={choice.transitionType || 'none'}
                    onChange={e => handleChoiceChange('transitionType', e.target.value)}
                    className={`${selectBaseClasses}`}
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


const ChoiceEditor: React.FC<ChoiceEditorProps> = ({ choices = [], onUpdateChoices, allScenes, currentSceneId }) => {
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

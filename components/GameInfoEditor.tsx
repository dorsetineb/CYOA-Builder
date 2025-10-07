

import React, { useState, useEffect } from 'react';
import { GameData } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface GameInfoEditorProps {
  title: string;
  logo: string;
  omitSplashTitle: boolean;
  splashImage: string;
  splashContentAlignment: 'left' | 'right';
  splashDescription: string;
  positiveEndingImage: string;
  positiveEndingContentAlignment: 'left' | 'right';
  positiveEndingDescription: string;
  negativeEndingImage: string;
  negativeEndingContentAlignment: 'left' | 'right';
  negativeEndingDescription: string;
  onUpdate: (field: keyof GameData, value: any) => void;
  isDirty: boolean;
  onSetDirty: (isDirty: boolean) => void;
}


const GameInfoEditor: React.FC<GameInfoEditorProps> = (props) => {
    const { 
        title, logo, omitSplashTitle, 
        splashImage, splashContentAlignment, splashDescription,
        positiveEndingImage, positiveEndingContentAlignment, positiveEndingDescription,
        negativeEndingImage, negativeEndingContentAlignment, negativeEndingDescription,
        onUpdate, isDirty, onSetDirty 
    } = props;

    const [localTitle, setLocalTitle] = useState(title);
    const [localLogo, setLocalLogo] = useState(logo);
    const [localOmitSplashTitle, setLocalOmitSplashTitle] = useState(omitSplashTitle);
    const [localSplashImage, setLocalSplashImage] = useState(splashImage);
    const [localSplashContentAlignment, setLocalSplashContentAlignment] = useState(splashContentAlignment);
    const [localSplashDescription, setLocalSplashDescription] = useState(splashDescription);
    const [localPositiveEndingImage, setLocalPositiveEndingImage] = useState(positiveEndingImage);
    const [localPositiveEndingContentAlignment, setLocalPositiveEndingContentAlignment] = useState(positiveEndingContentAlignment);
    const [localPositiveEndingDescription, setLocalPositiveEndingDescription] = useState(positiveEndingDescription);
    const [localNegativeEndingImage, setLocalNegativeEndingImage] = useState(negativeEndingImage);
    const [localNegativeEndingContentAlignment, setLocalNegativeEndingContentAlignment] = useState(negativeEndingContentAlignment);
    const [localNegativeEndingDescription, setLocalNegativeEndingDescription] = useState(negativeEndingDescription);
    const [activeTab, setActiveTab] = useState('abertura');

    useEffect(() => {
        const hasChanged = localTitle !== title || 
                         localLogo !== logo || 
                         localOmitSplashTitle !== omitSplashTitle ||
                         localSplashImage !== splashImage ||
                         localSplashContentAlignment !== splashContentAlignment ||
                         localSplashDescription !== splashDescription ||
                         localPositiveEndingImage !== positiveEndingImage ||
                         localPositiveEndingContentAlignment !== positiveEndingContentAlignment ||
                         localPositiveEndingDescription !== positiveEndingDescription ||
                         localNegativeEndingImage !== negativeEndingImage ||
                         localNegativeEndingContentAlignment !== negativeEndingContentAlignment ||
                         localNegativeEndingDescription !== negativeEndingDescription;
        onSetDirty(hasChanged);
    }, [localTitle, localLogo, localOmitSplashTitle, localSplashImage, localSplashContentAlignment, localSplashDescription, localPositiveEndingImage, localPositiveEndingContentAlignment, localPositiveEndingDescription, localNegativeEndingImage, localNegativeEndingContentAlignment, localNegativeEndingDescription, props, onSetDirty]);

    const handleSave = () => {
        if (localTitle !== title) onUpdate('gameTitle', localTitle);
        if (localLogo !== logo) onUpdate('gameLogo', localLogo);
        if (localOmitSplashTitle !== omitSplashTitle) onUpdate('gameOmitSplashTitle', localOmitSplashTitle);
        if (localSplashImage !== splashImage) onUpdate('gameSplashImage', localSplashImage);
        if (localSplashContentAlignment !== splashContentAlignment) onUpdate('gameSplashContentAlignment', localSplashContentAlignment);
        if (localSplashDescription !== splashDescription) onUpdate('gameSplashDescription', localSplashDescription);
        if (localPositiveEndingImage !== positiveEndingImage) onUpdate('positiveEndingImage', localPositiveEndingImage);
        if (localPositiveEndingContentAlignment !== positiveEndingContentAlignment) onUpdate('positiveEndingContentAlignment', localPositiveEndingContentAlignment);
        if (localPositiveEndingDescription !== positiveEndingDescription) onUpdate('positiveEndingDescription', localPositiveEndingDescription);
        if (localNegativeEndingImage !== negativeEndingImage) onUpdate('negativeEndingImage', localNegativeEndingImage);
        if (localNegativeEndingContentAlignment !== negativeEndingContentAlignment) onUpdate('negativeEndingContentAlignment', localNegativeEndingContentAlignment);
        if (localNegativeEndingDescription !== negativeEndingDescription) onUpdate('negativeEndingDescription', localNegativeEndingDescription);
    };
    
    const handleUndo = () => {
        setLocalTitle(title);
        setLocalLogo(logo);
        setLocalOmitSplashTitle(omitSplashTitle);
        setLocalSplashImage(splashImage);
        setLocalSplashContentAlignment(splashContentAlignment);
        setLocalSplashDescription(splashDescription);
        setLocalPositiveEndingImage(positiveEndingImage);
        setLocalPositiveEndingContentAlignment(positiveEndingContentAlignment);
        setLocalPositiveEndingDescription(positiveEndingDescription);
        setLocalNegativeEndingImage(negativeEndingImage);
        setLocalNegativeEndingContentAlignment(negativeEndingContentAlignment);
        setLocalNegativeEndingDescription(negativeEndingDescription);
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
              if (event.target && typeof event.target.result === 'string') {
                  setter(event.target.result);
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
    };
    
    const TABS = {
        abertura: 'Abertura do Jogo',
        fim_de_jogo: 'Fim de Jogo',
    };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-brand-text">Informações do Jogo</h2>
            {isDirty && (
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" title="Alterações não salvas"></div>
            )}
        </div>
        <p className="text-brand-text-dim mt-1">
          Configure o título, a tela de abertura e outras configurações globais do seu jogo.
        </p>
      </div>

      <div>
        <div className="border-b border-brand-border flex space-x-1">
          {Object.entries(TABS).map(([key, name]) => (
              <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`px-4 py-2 font-semibold text-sm rounded-t-md transition-colors ${
                      activeTab === key
                          ? 'bg-brand-surface text-brand-primary'
                          : 'text-brand-text-dim hover:text-brand-text'
                  }`}
              >
                  {name}
              </button>
          ))}
        </div>

        <div className="bg-brand-surface -mt-px p-6">
          {activeTab === 'abertura' && (
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2 flex flex-col">
                          <h4 className="text-lg font-semibold text-brand-text mb-2">Descrição do Jogo</h4>
                          <textarea
                            id="splashDescription"
                            value={localSplashDescription}
                            onChange={(e) => setLocalSplashDescription(e.target.value)}
                            rows={8}
                            className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 flex-grow"
                            placeholder="Uma breve descrição da sua aventura..."
                          />
                      </div>
                      <div className="space-y-6">
                           <div className="space-y-2">
                              <h4 className="text-lg font-semibold text-brand-text mb-2">Título do Jogo</h4>
                              <input
                                type="text"
                                id="gameTitle"
                                value={localTitle}
                                onChange={(e) => setLocalTitle(e.target.value)}
                                className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                placeholder="Ex: A Masmorra Esquecida"
                              />
                              <div className="flex items-center pt-1">
                                <input
                                  type="checkbox"
                                  id="omitSplashTitle"
                                  checked={localOmitSplashTitle}
                                  onChange={(e) => setLocalOmitSplashTitle(e.target.checked)}
                                  className="custom-checkbox"
                                />
                                <label htmlFor="omitSplashTitle" className="ml-2 text-sm text-brand-text-dim">Omitir título da abertura</label>
                              </div>
                          </div>
                          <div className="space-y-2">
                              <h4 className="text-lg font-semibold text-brand-text mb-2">Logotipo do Jogo (Opcional)</h4>
                              <div className="flex items-center gap-4">
                                  {localLogo && <img src={localLogo} alt="Pré-visualização do logo" className="h-16 w-auto bg-brand-bg p-1 border border-brand-border rounded" />}
                                  <label className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors cursor-pointer">
                                      <UploadIcon className="w-5 h-5 mr-2" /> 
                                      {logo ? 'Alterar Logo' : 'Carregar Logo'}
                                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalLogo)} className="hidden" />
                                  </label>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="pt-6 border-t border-brand-border/50">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-brand-text mb-2">Posicionamento do Conteúdo</h4>
                           <div
                              className="relative w-full aspect-video bg-indigo-500/30 border border-indigo-400 rounded-md flex"
                              style={{
                                  justifyContent: localSplashContentAlignment === 'left' ? 'flex-start' : 'flex-end',
                                  alignItems: 'flex-end'
                              }}
                              title="Área da Imagem de Fundo"
                          >
                              <div className="absolute top-2 left-2 text-indigo-200 font-semibold text-sm">
                                  Imagem de Fundo
                              </div>
                              <div
                                  className="w-2/3 h-1/2 m-4 bg-brand-primary/30 border border-brand-primary rounded-md flex items-center justify-center text-center text-sm p-2 text-brand-primary-hover font-semibold"
                                  title="Área de Texto"
                              >
                                  Texto de Abertura
                              </div>
                          </div>
                           <div className="pt-2">
                              <label htmlFor="splashContentAlignment" className="text-sm text-brand-text-dim mb-1 block">Alinhamento Horizontal</label>
                              <select
                                  id="splashContentAlignment"
                                  value={localSplashContentAlignment}
                                  onChange={(e) => setLocalSplashContentAlignment(e.target.value as 'left' | 'right')}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                              >
                                  <option value="right">Direita</option>
                                  <option value="left">Esquerda</option>
                              </select>
                          </div>
                        </div>
                         <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-brand-text mb-2">Imagem de Fundo</h4>
                          <div className="flex items-start gap-4">
                              {localSplashImage && <img src={localSplashImage} alt="Fundo da tela de abertura" className="h-24 w-auto aspect-video object-cover bg-brand-bg p-1 border border-brand-border rounded" />}
                              <label className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors cursor-pointer">
                                  <UploadIcon className="w-5 h-5 mr-2" /> 
                                  {splashImage ? 'Alterar Imagem' : 'Carregar Imagem'}
                                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalSplashImage)} className="hidden" />
                              </label>
                          </div>
                        </div>
                     </div>
                  </div>
              </div>
          )}

          {activeTab === 'fim_de_jogo' && (
              <div className="space-y-10">
                  {/* Positive Ending */}
                  <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-brand-text border-b border-brand-border pb-2">Final Positivo</h3>
                      <p className="text-sm text-brand-text-dim -mt-4">Esta tela aparece quando o jogador alcança uma cena marcada como "final".</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div className="space-y-2 flex flex-col">
                              <h4 className="text-lg font-semibold text-brand-text mb-2">Mensagem de Vitória</h4>
                              <textarea
                                  id="positiveEndingDescription"
                                  value={localPositiveEndingDescription}
                                  onChange={(e) => setLocalPositiveEndingDescription(e.target.value)}
                                  rows={4}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 flex-grow"
                                  placeholder="Parabéns! Você venceu."
                              />
                          </div>
                          <div className="space-y-6">
                              <div className="space-y-2">
                                  <h4 className="text-lg font-semibold text-brand-text mb-2">Posicionamento do Conteúdo</h4>
                                  <label htmlFor="positiveEndingContentAlignment" className="text-sm text-brand-text-dim mb-1 block">Alinhamento Horizontal</label>
                                  <select
                                      id="positiveEndingContentAlignment"
                                      value={localPositiveEndingContentAlignment}
                                      onChange={(e) => setLocalPositiveEndingContentAlignment(e.target.value as 'left' | 'right')}
                                      className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                  >
                                      <option value="right">Direita</option>
                                      <option value="left">Esquerda</option>
                                  </select>
                              </div>
                              <div className="space-y-2">
                                  <h4 className="text-lg font-semibold text-brand-text mb-2">Imagem de Fundo</h4>
                                  <div className="flex items-start gap-4">
                                      {localPositiveEndingImage && <img src={localPositiveEndingImage} alt="Fundo do final positivo" className="h-24 w-auto aspect-video object-cover bg-brand-bg p-1 border border-brand-border rounded" />}
                                      <label className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors cursor-pointer">
                                          <UploadIcon className="w-5 h-5 mr-2" /> 
                                          {positiveEndingImage ? 'Alterar Imagem' : 'Carregar Imagem'}
                                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalPositiveEndingImage)} className="hidden" />
                                      </label>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Negative Ending */}
                  <div className="space-y-6 pt-6 border-t border-brand-border/50">
                      <h3 className="text-2xl font-bold text-brand-text border-b border-brand-border pb-2">Final Negativo</h3>
                      <p className="text-sm text-brand-text-dim -mt-4">Esta tela aparece quando o jogador fica sem chances (vidas).</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div className="space-y-2 flex flex-col">
                              <h4 className="text-lg font-semibold text-brand-text mb-2">Mensagem de Derrota</h4>
                              <textarea
                                  id="negativeEndingDescription"
                                  value={localNegativeEndingDescription}
                                  onChange={(e) => setLocalNegativeEndingDescription(e.target.value)}
                                  rows={4}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0 flex-grow"
                                  placeholder="Fim de jogo."
                              />
                          </div>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                  <h4 className="text-lg font-semibold text-brand-text mb-2">Posicionamento do Conteúdo</h4>
                                  <label htmlFor="negativeEndingContentAlignment" className="text-sm text-brand-text-dim mb-1 block">Alinhamento Horizontal</label>
                                  <select
                                      id="negativeEndingContentAlignment"
                                      value={localNegativeEndingContentAlignment}
                                      onChange={(e) => setLocalNegativeEndingContentAlignment(e.target.value as 'left' | 'right')}
                                      className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                  >
                                      <option value="right">Direita</option>
                                      <option value="left">Esquerda</option>
                                  </select>
                              </div>
                              <div className="space-y-2">
                                  <h4 className="text-lg font-semibold text-brand-text mb-2">Imagem de Fundo</h4>
                                  <div className="flex items-start gap-4">
                                      {localNegativeEndingImage && <img src={localNegativeEndingImage} alt="Fundo do final negativo" className="h-24 w-auto aspect-video object-cover bg-brand-bg p-1 border border-brand-border rounded" />}
                                      <label className="flex items-center px-4 py-2 bg-brand-primary text-brand-bg font-semibold rounded-md hover:bg-brand-primary-hover transition-colors cursor-pointer">
                                          <UploadIcon className="w-5 h-5 mr-2" /> 
                                          {negativeEndingImage ? 'Alterar Imagem' : 'Carregar Imagem'}
                                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLocalNegativeEndingImage)} className="hidden" />
                                      </label>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}
        </div>
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
                title={isDirty ? "Salvar informações do jogo" : "Nenhuma alteração para salvar"}
            >
                Salvar
            </button>
        </div>
    </div>
  );
};

export default GameInfoEditor;

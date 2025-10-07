import React, { useState, useEffect } from 'react';
import { GameData } from '../types';

interface ThemeEditorProps {
  textColor: string;
  titleColor: string;
  splashButtonColor: string;
  splashButtonHoverColor: string;
  splashButtonTextColor: string;
  actionButtonColor: string;
  actionButtonTextColor: string;
  focusColor: string;
  chanceIconColor: string;
  gameFontFamily: string;
  enableChances: boolean;
  chanceIcon: 'circle' | 'cross' | 'heart';
  chanceLossMessage: string;
  chanceRestoreMessage: string;
  chanceReturnButtonText: string;
  gameTheme: 'dark' | 'light';
  textColorLight: string;
  titleColorLight: string;
  focusColorLight: string;
  onUpdate: (field: keyof GameData, value: any) => void;
  isDirty: boolean;
  onSetDirty: (isDirty: boolean) => void;
}

const FONTS = [
    { name: 'Pixel (Padrão)', family: "'Silkscreen', sans-serif" },
    { name: 'Pixel (Arcade)', family: "'Press Start 2P', cursive" },
    { name: 'Pixel (Terminal)', family: "'VT323', monospace" },
    { name: 'Pixel (Gótico)', family: "'DotGothic16', sans-serif" },
    { name: 'Máquina de Escrever', family: "'Special Elite', cursive" },
    { name: 'Mono (Arredondada)', family: "'Cutive Mono', monospace" },
    { name: 'Mono (Técnica)', family: "'Share Tech Mono', monospace" },
    { name: 'Mono (Console)', family: "'Inconsolata', monospace" },
    { name: 'Mono (Moderna)', family: "'Roboto Mono', monospace" },
    { name: 'Mono (Clássica)', family: "'Anonymous Pro', monospace" },
];

const PREDEFINED_THEMES = [
  {
    name: 'Meia-Noite',
    textColor: '#c9d1d9', titleColor: '#58a6ff', focusColor: '#58a6ff',
    textColorLight: '#24292f', titleColorLight: '#0969da', focusColorLight: '#0969da',
    splashButtonColor: '#2ea043', splashButtonHoverColor: '#238636', splashButtonTextColor: '#ffffff',
    actionButtonColor: '#ffffff', actionButtonTextColor: '#0d1117',
    chanceIconColor: '#ff4d4d',
  },
  {
    name: 'Floresta',
    textColor: '#d4d4d2', titleColor: '#a3e635', focusColor: '#a3e635',
    textColorLight: '#1c1917', titleColorLight: '#166534', focusColorLight: '#166534',
    splashButtonColor: '#4d7c0f', splashButtonHoverColor: '#365314', splashButtonTextColor: '#f0fdf4',
    actionButtonColor: '#22c55e', actionButtonTextColor: '#ffffff',
    chanceIconColor: '#dc2626',
  },
  {
    name: 'Sépia',
    textColor: '#e7e5e4', titleColor: '#f59e0b', focusColor: '#f59e0b',
    textColorLight: '#292524', titleColorLight: '#78350f', focusColorLight: '#78350f',
    splashButtonColor: '#a16207', splashButtonHoverColor: '#713f12', splashButtonTextColor: '#fefce8',
    actionButtonColor: '#ca8a04', actionButtonTextColor: '#ffffff',
    chanceIconColor: '#b91c1c',
  },
  {
    name: 'Terminal',
    textColor: '#34d399', titleColor: '#6ee7b7', focusColor: '#a7f3d0',
    textColorLight: '#064e3b', titleColorLight: '#047857', focusColorLight: '#059669',
    splashButtonColor: '#10b981', splashButtonHoverColor: '#059669', splashButtonTextColor: '#000000',
    actionButtonColor: '#34d399', actionButtonTextColor: '#000000',
    chanceIconColor: '#6ee7b7',
  },
  {
    name: 'Oceano',
    textColor: '#cbd5e1', titleColor: '#60a5fa', focusColor: '#93c5fd',
    textColorLight: '#1e293b', titleColorLight: '#2563eb', focusColorLight: '#3b82f6',
    splashButtonColor: '#3b82f6', splashButtonHoverColor: '#2563eb', splashButtonTextColor: '#ffffff',
    actionButtonColor: '#60a5fa', actionButtonTextColor: '#0f172a',
    chanceIconColor: '#3b82f6',
  },
  {
    name: 'Vampiro',
    textColor: '#fecaca', titleColor: '#fca5a5', focusColor: '#f87171',
    textColorLight: '#450a0a', titleColorLight: '#991b1b', focusColorLight: '#b91c1c',
    splashButtonColor: '#dc2626', splashButtonHoverColor: '#b91c1c', splashButtonTextColor: '#ffffff',
    actionButtonColor: '#ef4444', actionButtonTextColor: '#ffffff',
    chanceIconColor: '#fca5a5',
  },
];


const ColorInput: React.FC<{
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}> = ({ label, id, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-text-dim mb-1">{label}</label>
        <div className="flex items-center gap-2 p-1 bg-brand-bg border border-brand-border rounded-md focus-within:ring-0">
            <input
                type="color"
                id={`${id}-picker`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
                aria-label={`Seletor de cor para ${label}`}
            />
            <input
                type="text"
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent font-mono text-sm focus:outline-none focus:ring-0"
                placeholder={placeholder}
            />
        </div>
    </div>
);


const ThemeEditor: React.FC<ThemeEditorProps> = (props) => {
    const { 
        textColor, titleColor, splashButtonColor, splashButtonHoverColor,
        splashButtonTextColor, actionButtonColor, actionButtonTextColor,
        focusColor, chanceIconColor, gameFontFamily, 
        enableChances, chanceIcon, onUpdate, isDirty, onSetDirty,
        chanceLossMessage, chanceRestoreMessage, chanceReturnButtonText,
        gameTheme, textColorLight, titleColorLight, focusColorLight
    } = props;

    const [localTextColor, setLocalTextColor] = useState(textColor);
    const [localTitleColor, setLocalTitleColor] = useState(titleColor);
    const [localSplashButtonColor, setLocalSplashButtonColor] = useState(splashButtonColor);
    const [localSplashButtonHoverColor, setLocalSplashButtonHoverColor] = useState(splashButtonHoverColor);
    const [localSplashButtonTextColor, setLocalSplashButtonTextColor] = useState(splashButtonTextColor);
    const [localActionButtonColor, setLocalActionButtonColor] = useState(actionButtonColor);
    const [localActionButtonTextColor, setLocalActionButtonTextColor] = useState(actionButtonTextColor);
    const [localFocusColor, setLocalFocusColor] = useState(focusColor);
    const [localChanceIconColor, setLocalChanceIconColor] = useState(chanceIconColor);
    const [localFontFamily, setLocalFontFamily] = useState(gameFontFamily);
    const [localChanceIcon, setLocalChanceIcon] = useState(chanceIcon);
    const [localChanceLossMessage, setLocalChanceLossMessage] = useState(chanceLossMessage);
    const [localChanceRestoreMessage, setLocalChanceRestoreMessage] = useState(chanceRestoreMessage);
    const [localChanceReturnButtonText, setLocalChanceReturnButtonText] = useState(chanceReturnButtonText);
    const [localGameTheme, setLocalGameTheme] = useState(gameTheme);
    const [localTextColorLight, setLocalTextColorLight] = useState(textColorLight);
    const [localTitleColorLight, setLocalTitleColorLight] = useState(titleColorLight);
    const [localFocusColorLight, setLocalFocusColorLight] = useState(focusColorLight);
    const [focusPreview, setFocusPreview] = useState(false);
    const [isCustomizing, setIsCustomizing] = useState(false);

    useEffect(() => {
        const dirty = localTextColor !== textColor ||
                      localTitleColor !== titleColor ||
                      localSplashButtonColor !== splashButtonColor ||
                      localSplashButtonHoverColor !== splashButtonHoverColor ||
                      localSplashButtonTextColor !== splashButtonTextColor ||
                      localActionButtonColor !== actionButtonColor ||
                      localActionButtonTextColor !== actionButtonTextColor ||
                      localFocusColor !== focusColor ||
                      localChanceIconColor !== chanceIconColor ||
                      localFontFamily !== gameFontFamily ||
                      localChanceIcon !== chanceIcon ||
                      localChanceLossMessage !== chanceLossMessage ||
                      localChanceRestoreMessage !== chanceRestoreMessage ||
                      localChanceReturnButtonText !== chanceReturnButtonText ||
                      localGameTheme !== gameTheme ||
                      localTextColorLight !== textColorLight ||
                      localTitleColorLight !== titleColorLight ||
                      localFocusColorLight !== focusColorLight;
        onSetDirty(dirty);
    }, [localTextColor, localTitleColor, localSplashButtonColor, localSplashButtonHoverColor, localSplashButtonTextColor, localActionButtonColor, localActionButtonTextColor, localFocusColor, localChanceIconColor, localFontFamily, localChanceIcon, localChanceLossMessage, localChanceRestoreMessage, localChanceReturnButtonText, localGameTheme, localTextColorLight, localTitleColorLight, localFocusColorLight, props, onSetDirty]);

    const handleSave = () => {
        if (localTextColor !== textColor) onUpdate('gameTextColor', localTextColor);
        if (localTitleColor !== titleColor) onUpdate('gameTitleColor', localTitleColor);
        if (localSplashButtonColor !== splashButtonColor) onUpdate('gameSplashButtonColor', localSplashButtonColor);
        if (localSplashButtonHoverColor !== splashButtonHoverColor) onUpdate('gameSplashButtonHoverColor', localSplashButtonHoverColor);
        if (localSplashButtonTextColor !== splashButtonTextColor) onUpdate('gameSplashButtonTextColor', localSplashButtonTextColor);
        if (localActionButtonColor !== actionButtonColor) onUpdate('gameActionButtonColor', localActionButtonColor);
        if (localActionButtonTextColor !== actionButtonTextColor) onUpdate('gameActionButtonTextColor', localActionButtonTextColor);
        if (localFocusColor !== focusColor) onUpdate('gameFocusColor', localFocusColor);
        if (localChanceIconColor !== chanceIconColor) onUpdate('gameChanceIconColor', localChanceIconColor);
        if (localFontFamily !== gameFontFamily) onUpdate('gameFontFamily', localFontFamily);
        if (localChanceIcon !== chanceIcon) onUpdate('gameChanceIcon', localChanceIcon);
        if (localChanceLossMessage !== chanceLossMessage) onUpdate('gameChanceLossMessage', localChanceLossMessage);
        if (localChanceRestoreMessage !== chanceRestoreMessage) onUpdate('gameChanceRestoreMessage', localChanceRestoreMessage);
        if (localChanceReturnButtonText !== chanceReturnButtonText) onUpdate('gameChanceReturnButtonText', localChanceReturnButtonText);
        if (localGameTheme !== gameTheme) onUpdate('gameTheme', localGameTheme);
        if (localTextColorLight !== textColorLight) onUpdate('gameTextColorLight', localTextColorLight);
        if (localTitleColorLight !== titleColorLight) onUpdate('gameTitleColorLight', localTitleColorLight);
        if (localFocusColorLight !== focusColorLight) onUpdate('gameFocusColorLight', localFocusColorLight);
    };
    
    const handleUndo = () => {
        setLocalTextColor(textColor);
        setLocalTitleColor(titleColor);
        setLocalSplashButtonColor(splashButtonColor);
        setLocalSplashButtonHoverColor(splashButtonHoverColor);
        setLocalSplashButtonTextColor(splashButtonTextColor);
        setLocalActionButtonColor(actionButtonColor);
        setLocalActionButtonTextColor(actionButtonTextColor);
        setLocalFocusColor(focusColor);
        setLocalChanceIconColor(chanceIconColor);
        setLocalFontFamily(gameFontFamily);
        setLocalChanceIcon(chanceIcon);
        setLocalChanceLossMessage(chanceLossMessage);
        setLocalChanceRestoreMessage(chanceRestoreMessage);
        setLocalChanceReturnButtonText(chanceReturnButtonText);
        setLocalGameTheme(gameTheme);
        setLocalTextColorLight(textColorLight);
        setLocalTitleColorLight(titleColorLight);
        setLocalFocusColorLight(focusColorLight);
    };

    const applyTheme = (theme: typeof PREDEFINED_THEMES[0]) => {
      setLocalTextColor(theme.textColor);
      setLocalTitleColor(theme.titleColor);
      setLocalFocusColor(theme.focusColor);
      setLocalTextColorLight(theme.textColorLight);
      setLocalTitleColorLight(theme.titleColorLight);
      setLocalFocusColorLight(theme.focusColorLight);
      setLocalSplashButtonColor(theme.splashButtonColor);
      setLocalSplashButtonHoverColor(theme.splashButtonHoverColor);
      setLocalSplashButtonTextColor(theme.splashButtonTextColor);
      setLocalActionButtonColor(theme.actionButtonColor);
      setLocalActionButtonTextColor(theme.actionButtonTextColor);
      setLocalChanceIconColor(theme.chanceIconColor);
    };
    
    const HeartIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
        <svg fill={color} viewBox="0 0 24 24" className={className}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    );

    const CircleIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
      <svg fill={color} viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="10"/>
      </svg>
    );

    const CrossIcon: React.FC<{ color: string; className?: string }> = ({ color, className = "w-7 h-7" }) => (
      <svg stroke={color} strokeWidth="3" strokeLinecap="round" viewBox="0 0 24 24" className={className} fill="none">
        <path d="M12 5 V19 M5 12 H19"/>
      </svg>
    );

    const ChanceIcon: React.FC<{ type: 'heart' | 'circle' | 'cross', color: string, className?: string }> = ({ type, color, className }) => {
        switch (type) {
            case 'heart': return <HeartIcon color={color} className={className} />;
            case 'circle': return <CircleIcon color={color} className={className} />;
            case 'cross': return <CrossIcon color={color} className={className} />;
            default: return <HeartIcon color={color} className={className} />;
        }
    };


    return (
        <div className="space-y-6 pb-24">
            <div>
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-brand-text">Tema do Jogo</h2>
                    {isDirty && (
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" title="Alterações não salvas"></div>
                    )}
                </div>
                <p className="text-brand-text-dim mt-1">
                    Gerencie a paleta de cores, fonte e outros elementos visuais do seu jogo.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-brand-surface p-6 space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-brand-text">Tema da Interface</h3>
                        <div className="flex gap-2 rounded-md bg-brand-bg p-1">
                            <button
                                onClick={() => setLocalGameTheme('dark')}
                                className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                                    localGameTheme === 'dark' ? 'bg-brand-primary text-brand-bg' : 'hover:bg-brand-border/30'
                                }`}
                            >
                                Escuro
                            </button>
                            <button
                                onClick={() => setLocalGameTheme('light')}
                                className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
                                    localGameTheme === 'light' ? 'bg-brand-primary text-brand-bg' : 'hover:bg-brand-border/30'
                                }`}
                            >
                                Claro
                            </button>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-brand-text mb-4">Fonte do Jogo</h3>
                         <div>
                            <label htmlFor="font-select" className="block text-sm font-medium text-brand-text-dim mb-1">Fonte do Jogo</label>
                            <select
                                id="font-select"
                                value={localFontFamily}
                                onChange={(e) => setLocalFontFamily(e.target.value)}
                                className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                style={{fontFamily: localFontFamily}}
                            >
                                {FONTS.map(font => (
                                    <option key={font.family} value={font.family} style={{fontFamily: font.family}}>
                                        {font.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-brand-border/50">
                        <h3 className="text-lg font-semibold text-brand-text mb-4">Temas Pré-definidos</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {PREDEFINED_THEMES.map(theme => (
                                <button
                                    key={theme.name}
                                    onClick={() => applyTheme(theme)}
                                    className="text-left p-2 rounded-md border-2 border-brand-border hover:border-brand-primary transition-colors focus:outline-none focus:border-brand-primary bg-brand-bg"
                                    title={`Aplicar tema ${theme.name}`}
                                >
                                    <span className="font-semibold text-sm text-brand-text">{theme.name}</span>
                                    <div className="flex mt-2 gap-1">
                                        <div className="w-1/3 h-4 rounded" style={{ backgroundColor: theme.titleColor }}></div>
                                        <div className="w-1/3 h-4 rounded" style={{ backgroundColor: theme.textColor }}></div>
                                        <div className="w-1/3 h-4 rounded" style={{ backgroundColor: theme.splashButtonColor }}></div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {!isCustomizing && (
                         <div className="pt-6 border-t border-brand-border/50">
                             <button 
                                 onClick={() => setIsCustomizing(true)}
                                 className="w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30"
                             >
                                 Customizar Cores
                             </button>
                         </div>
                    )}

                    {isCustomizing && (
                      <>
                        {localGameTheme === 'dark' && (
                            <div className="pt-6 border-t border-brand-border/50">
                                <h3 className="text-lg font-semibold text-brand-text mb-4">Cores (Tema Escuro)</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <ColorInput label="Cor do Texto Padrão" id="textColor" value={localTextColor} onChange={setLocalTextColor} placeholder="#c9d1d9" />
                                    <ColorInput label="Cor do Título / Destaque" id="titleColor" value={localTitleColor} onChange={setLocalTitleColor} placeholder="#58a6ff" />
                                    <ColorInput label="Cor de Destaque (Foco)" id="focusColor" value={localFocusColor} onChange={setLocalFocusColor} placeholder="#58a6ff" />
                                </div>
                            </div>
                        )}

                        {localGameTheme === 'light' && (
                            <div className="pt-6 border-t border-brand-border/50">
                                <h3 className="text-lg font-semibold text-brand-text mb-4">Cores (Tema Claro)</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <ColorInput label="Cor do Texto Padrão" id="textColorLight" value={localTextColorLight} onChange={setLocalTextColorLight} placeholder="#24292f" />
                                    <ColorInput label="Cor do Título / Destaque" id="titleColorLight" value={localTitleColorLight} onChange={setLocalTitleColorLight} placeholder="#0969da" />
                                    <ColorInput label="Cor de Destaque (Foco)" id="focusColorLight" value={localFocusColorLight} onChange={setLocalFocusColorLight} placeholder="#0969da" />
                                </div>
                            </div>
                        )}


                        <div className="pt-6 border-t border-brand-border/50">
                            <h3 className="text-lg font-semibold text-brand-text mb-4">Botões (Geral)</h3>
                            <p className="text-xs text-brand-text-dim mb-4 -mt-3">Estas cores são aplicadas a ambos os temas.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput label="Cor do Botão de Início" id="splashButtonColor" value={localSplashButtonColor} onChange={setLocalSplashButtonColor} placeholder="#2ea043" />
                                <ColorInput label="Cor do Texto do Botão de Início" id="splashButtonTextColor" value={localSplashButtonTextColor} onChange={setLocalSplashButtonTextColor} placeholder="#ffffff" />
                                <ColorInput label="Cor do Botão de Início (Hover)" id="splashButtonHoverColor" value={localSplashButtonHoverColor} onChange={setLocalSplashButtonHoverColor} placeholder="#238636" />
                                <ColorInput label="Cor do Botão de Ação" id="actionButtonColor" value={localActionButtonColor} onChange={setLocalActionButtonColor} placeholder="#ffffff" />
                                <ColorInput label="Cor do Texto do Botão de Ação" id="actionButtonTextColor" value={localActionButtonTextColor} onChange={setLocalActionButtonTextColor} placeholder="#0d1117" />
                            </div>
                        </div>
                      </>
                    )}
                     {enableChances && (
                        <div className="pt-6 border-t border-brand-border/50">
                            <h3 className="text-lg font-semibold text-brand-text mb-4">Sistema de Chances (Vidas)</h3>
                            <div className="space-y-6 mt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {isCustomizing && (
                                      <ColorInput label="Cor dos Ícones de Vidas" id="chanceIconColor" value={localChanceIconColor} onChange={setLocalChanceIconColor} placeholder="#ff4d4d" />
                                    )}
                                    <div>
                                        <label htmlFor="chanceIcon" className="block text-sm font-medium text-brand-text-dim mb-1">Formato do Ícone</label>
                                        <select
                                            id="chanceIcon"
                                            value={localChanceIcon}
                                            onChange={(e) => setLocalChanceIcon(e.target.value as any)}
                                            className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                        >
                                            <option value="heart">Corações</option>
                                            <option value="circle">Círculos</option>
                                            <option value="cross">Cruzes</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="chanceLossMessage" className="block text-sm font-medium text-brand-text-dim mb-1">Mensagem de Perda de Chance</label>
                                    <input
                                        type="text"
                                        id="chanceLossMessage"
                                        value={localChanceLossMessage}
                                        onChange={(e) => setLocalChanceLossMessage(e.target.value)}
                                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                    />
                                    <p className="text-xs text-brand-text-dim mt-1">Use {'{chances}'} para mostrar as chances restantes.</p>
                                </div>
                                <div>
                                    <label htmlFor="chanceRestoreMessage" className="block text-sm font-medium text-brand-text-dim mb-1">Mensagem de Recuperação de Chance</label>
                                    <input
                                        type="text"
                                        id="chanceRestoreMessage"
                                        value={localChanceRestoreMessage}
                                        onChange={(e) => setLocalChanceRestoreMessage(e.target.value)}
                                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="chanceReturnButton" className="block text-sm font-medium text-brand-text-dim mb-1">Texto do Botão de Retorno</label>
                                    <input
                                        type="text"
                                        id="chanceReturnButton"
                                        value={localChanceReturnButtonText}
                                        onChange={(e) => setLocalChanceReturnButtonText(e.target.value)}
                                        className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                    />
                                </div>
                            </div>
                        </div>
                     )}
                </div>

                <div className="flex flex-col">
                    <p className="text-sm text-brand-text-dim mb-2 text-center">Pré-visualização ao vivo</p>
                    <div 
                        className={`flex-1 border-2 p-6 flex flex-col justify-between transition-colors ${localGameTheme === 'dark' ? 'bg-[#0d1117] border-brand-border' : 'bg-[#ffffff] border-[#d0d7de]'}`}
                        style={{ fontFamily: localFontFamily }}
                    >
                        <div className="flex justify-between items-start">
                             <h1 className="text-xl" style={{ color: localGameTheme === 'dark' ? localTitleColor : localTitleColorLight }}>Título do Jogo</h1>
                             {enableChances && (
                                <div className="flex gap-1">
                                    <ChanceIcon type={localChanceIcon} color={localChanceIconColor} />
                                    <ChanceIcon type={localChanceIcon} color={localChanceIconColor} />
                                    <ChanceIcon type={localChanceIcon} color={localChanceIconColor} />
                                </div>
                             )}
                        </div>
                        <div className="my-4">
                            <p className="text-sm" style={{ color: localGameTheme === 'dark' ? localTextColor : localTextColorLight }}>Esta é uma descrição de exemplo para a cena. Ela usa a cor de texto padrão que você definir.</p>
                            <p className="mt-2 text-sm italic" style={{ color: localGameTheme === 'dark' ? '#8b949e' : '#57606a' }}>&gt; comando de exemplo</p>
                        </div>
                        <div className="space-y-4">
                             <div className="flex items-center gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Campo de comando"
                                    className="flex-1 border-2 rounded p-2 text-sm transition-colors focus:ring-0"
                                    style={{
                                        backgroundColor: localGameTheme === 'dark' ? '#010409' : '#f6f8fa',
                                        color: localGameTheme === 'dark' ? localTextColor : localTextColorLight,
                                        borderColor: focusPreview 
                                            ? (localGameTheme === 'dark' ? localFocusColor : localFocusColorLight) 
                                            : (localGameTheme === 'dark' ? '#3036d' : '#d0d7de'),
                                        fontFamily: localFontFamily,
                                    }}
                                    onFocus={() => setFocusPreview(true)}
                                    onBlur={() => setFocusPreview(false)}
                                />
                                <button className="font-bold py-2 px-4 rounded" style={{ backgroundColor: localActionButtonColor, color: localActionButtonTextColor, fontFamily: localFontFamily }}>Ação</button>
                             </div>
                              <button
                                    className="w-full font-bold transition-all duration-200 ease-in-out text-lg py-3"
                                    style={{
                                        backgroundColor: localSplashButtonColor,
                                        color: localSplashButtonTextColor,
                                        fontFamily: localFontFamily,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = localSplashButtonHoverColor}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = localSplashButtonColor}
                                >
                                    Botão de Início
                                </button>
                        </div>
                    </div>
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
                    title={isDirty ? "Salvar alterações no tema" : "Nenhuma alteração para salvar"}
                >
                    Salvar
                </button>
            </div>
        </div>
    );
};

export default ThemeEditor;





import React, { useState, useEffect } from 'react';
import { GameData, Variable } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

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
  
  // Variables (Legacy prop, now handled in VariablesEditor, but kept for interface compatibility if needed)
  variables?: Variable[];

  // New props from merged UIEditor
  layoutOrientation: 'vertical' | 'horizontal';
  layoutOrder: 'image-first' | 'image-last';
  imageFrame: GameData['gameImageFrame'];
  splashButtonText: string;
  continueButtonText: string;
  restartButtonText: string;
  enableChances: boolean;
  maxChances: number;
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
  chanceIcon: 'circle' | 'cross' | 'heart';
  chanceReturnButtonText: string;
  gameWonButtonText: string;
  gameLostLastChanceButtonText: string;
  gameTheme: 'dark' | 'light';
  textColorLight: string;
  titleColorLight: string;
  focusColorLight: string;
  frameBookColor: string;
  frameTradingCardColor: string;
  frameChamferedColor: string;
  frameRoundedTopColor: string;
  gameSceneNameOverlayBg: string;
  gameSceneNameOverlayTextColor: string;

  onUpdate: (field: keyof GameData, value: any) => void;
  isDirty: boolean;
  onSetDirty: (isDirty: boolean) => void;
}

const FONTS = [
    { name: 'Silkscreen', family: "'Silkscreen', sans-serif" },
    { name: 'DotGothic16', family: "'DotGothic16', sans-serif" },
    { name: 'Cutive Mono', family: "'Cutive Mono', monospace" },
    { name: 'Space Mono', family: "'Space Mono', monospace" },
    { name: 'Inconsolata', family: "'Inconsolata', monospace" },
    { name: 'IBM Plex Mono', family: "'IBM Plex Mono', monospace" },
    { name: 'Chakra Petch', family: "'Chakra Petch', sans-serif" },
    { name: 'Crimson Text', family: "'Crimson Text', serif" },
];

const PREDEFINED_THEMES = [
  {
    name: 'Meia-Noite',
    textColor: '#c9d1d9', titleColor: '#58a6ff', focusColor: '#58a6ff',
    textColorLight: '#24292f', titleColorLight: '#0969da', focusColorLight: '#0969da',
    splashButtonColor: '#8B5CF6', splashButtonHoverColor: '#7C3AED', splashButtonTextColor: '#ffffff',
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
    name: 'Synthwave',
    textColor: '#e5e5e5', titleColor: '#f472b6', focusColor: '#ec4899',
    textColorLight: '#18181b', titleColorLight: '#be185d', focusColorLight: '#db2777',
    splashButtonColor: '#8b5cf6', splashButtonHoverColor: '#7c3aed', splashButtonTextColor: '#ffffff',
    actionButtonColor: '#ec4899', actionButtonTextColor: '#ffffff',
    chanceIconColor: '#f472b6',
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

const GameInfoEditor: React.FC<GameInfoEditorProps> = (props) => {
    const { 
        title, logo, omitSplashTitle, 
        splashImage, splashContentAlignment, splashDescription,
        positiveEndingImage, positiveEndingContentAlignment, positiveEndingDescription,
        negativeEndingImage, negativeEndingContentAlignment, negativeEndingDescription,
        // UI props
        layoutOrientation, layoutOrder, imageFrame, splashButtonText, continueButtonText,
        restartButtonText, enableChances, maxChances,
        textColor, titleColor, splashButtonColor, splashButtonHoverColor,
        splashButtonTextColor, actionButtonColor, actionButtonTextColor,
        focusColor, chanceIconColor, gameFontFamily, chanceIcon,
        chanceReturnButtonText, gameWonButtonText, gameLostLastChanceButtonText,
        gameTheme, textColorLight, titleColorLight, focusColorLight,
        frameBookColor, frameTradingCardColor, frameChamferedColor,
        frameRoundedTopColor, gameSceneNameOverlayBg, gameSceneNameOverlayTextColor,
        
        onUpdate, isDirty, onSetDirty 
    } = props;

    // Local State for Info
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


    // Local State for UI/Theme
    const [localLayoutOrientation, setLocalLayoutOrientation] = useState(layoutOrientation);
    const [localLayoutOrder, setLocalLayoutOrder] = useState(layoutOrder);
    const [localImageFrame, setLocalImageFrame] = useState(imageFrame);
    const [localSplashButtonText, setLocalSplashButtonText] = useState(splashButtonText);
    const [localContinueButtonText, setLocalContinueButtonText] = useState(continueButtonText);
    const [localRestartButtonText, setLocalRestartButtonText] = useState(restartButtonText);
    const [localEnableChances, setLocalEnableChances] = useState(enableChances);
    const [localMaxChances, setLocalMaxChances] = useState(maxChances);
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
    const [localChanceReturnButtonText, setLocalChanceReturnButtonText] = useState(chanceReturnButtonText);
    const [localGameWonButtonText, setLocalGameWonButtonText] = useState(gameWonButtonText);
    const [localGameLostLastChanceButtonText, setLocalGameLostLastChanceButtonText] = useState(gameLostLastChanceButtonText);
    const [localGameTheme, setLocalGameTheme] = useState(gameTheme);
    const [localTextColorLight, setLocalTextColorLight] = useState(textColorLight);
    const [localTitleColorLight, setLocalTitleColorLight] = useState(titleColorLight);
    const [localFocusColorLight, setLocalFocusColorLight] = useState(focusColorLight);
    const [localFrameBookColor, setLocalFrameBookColor] = useState(frameBookColor);
    const [localFrameTradingCardColor, setLocalFrameTradingCardColor] = useState(frameTradingCardColor);
    const [localFrameChamferedColor, setLocalFrameChamferedColor] = useState(frameChamferedColor);
    const [localFrameRoundedTopColor, setLocalFrameRoundedTopColor] = useState(frameRoundedTopColor);
    const [localGameSceneNameOverlayBg, setLocalGameSceneNameOverlayBg] = useState(gameSceneNameOverlayBg);
    const [localGameSceneNameOverlayTextColor, setLocalGameSceneNameOverlayTextColor] = useState(gameSceneNameOverlayTextColor);
    
    const [activeTab, setActiveTab] = useState('geral');
    const [focusPreview, setFocusPreview] = useState(false);
    const [isCustomizing, setIsCustomizing] = useState(false);

    // Sync Props to State
    useEffect(() => {
        // Info props
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

        // UI Props
        setLocalLayoutOrientation(layoutOrientation);
        setLocalLayoutOrder(layoutOrder);
        setLocalImageFrame(imageFrame);
        setLocalSplashButtonText(splashButtonText);
        setLocalContinueButtonText(continueButtonText);
        setLocalRestartButtonText(restartButtonText);
        setLocalEnableChances(enableChances);
        setLocalMaxChances(maxChances);
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
        setLocalChanceReturnButtonText(chanceReturnButtonText);
        setLocalGameWonButtonText(gameWonButtonText);
        setLocalGameLostLastChanceButtonText(gameLostLastChanceButtonText);
        setLocalGameTheme(gameTheme);
        setLocalTextColorLight(textColorLight);
        setLocalTitleColorLight(titleColorLight);
        setLocalFocusColorLight(focusColorLight);
        setLocalFrameBookColor(frameBookColor);
        setLocalFrameTradingCardColor(frameTradingCardColor);
        setLocalFrameChamferedColor(frameChamferedColor);
        setLocalFrameRoundedTopColor(frameRoundedTopColor);
        setLocalGameSceneNameOverlayBg(gameSceneNameOverlayBg);
        setLocalGameSceneNameOverlayTextColor(gameSceneNameOverlayTextColor);

    }, [
        title, logo, omitSplashTitle, splashImage, splashContentAlignment, splashDescription,
        positiveEndingImage, positiveEndingContentAlignment, positiveEndingDescription,
        negativeEndingImage, negativeEndingContentAlignment, negativeEndingDescription,
        layoutOrientation, layoutOrder, imageFrame, splashButtonText, continueButtonText, restartButtonText, enableChances, maxChances,
        textColor, titleColor, splashButtonColor, splashButtonHoverColor, splashButtonTextColor, actionButtonColor, actionButtonTextColor, focusColor,
        chanceIconColor, gameFontFamily, chanceIcon, chanceReturnButtonText, gameWonButtonText, gameLostLastChanceButtonText, gameTheme, textColorLight, titleColorLight, focusColorLight,
        frameBookColor, frameTradingCardColor, frameChamferedColor,
        frameRoundedTopColor, gameSceneNameOverlayBg, gameSceneNameOverlayTextColor
    ]);

    useEffect(() => {
        const newFrameColor = localGameTheme === 'dark' ? '#FFFFFF' : '#1a202c';
        setLocalFrameBookColor(newFrameColor);
        setLocalFrameTradingCardColor(newFrameColor);
        setLocalFrameChamferedColor(newFrameColor);
        setLocalFrameRoundedTopColor(newFrameColor);
    }, [localGameTheme]);

    // Check Dirty State
    useEffect(() => {
        const hasChanged = 
            // Info
            localTitle !== title || 
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
            localNegativeEndingDescription !== negativeEndingDescription ||
            // UI
            localLayoutOrientation !== layoutOrientation ||
            localLayoutOrder !== layoutOrder ||
            localImageFrame !== imageFrame ||
            localSplashButtonText !== splashButtonText ||
            localContinueButtonText !== continueButtonText ||
            localRestartButtonText !== restartButtonText ||
            localEnableChances !== enableChances ||
            localMaxChances !== maxChances ||
            localTextColor !== textColor ||
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
            localChanceReturnButtonText !== chanceReturnButtonText ||
            localGameWonButtonText !== gameWonButtonText ||
            localGameLostLastChanceButtonText !== gameLostLastChanceButtonText ||
            localGameTheme !== gameTheme ||
            localTextColorLight !== textColorLight ||
            localTitleColorLight !== titleColorLight ||
            localFocusColorLight !== focusColorLight ||
            localFrameBookColor !== frameBookColor ||
            localFrameTradingCardColor !== frameTradingCardColor ||
            localFrameChamferedColor !== frameChamferedColor ||
            localFrameRoundedTopColor !== frameRoundedTopColor ||
            localGameSceneNameOverlayBg !== gameSceneNameOverlayBg ||
            localGameSceneNameOverlayTextColor !== gameSceneNameOverlayTextColor;

        onSetDirty(hasChanged);
    }, [
        localTitle, localLogo, localOmitSplashTitle, localSplashImage, localSplashContentAlignment, localSplashDescription,
        localPositiveEndingImage, localPositiveEndingContentAlignment, localPositiveEndingDescription,
        localNegativeEndingImage, localNegativeEndingContentAlignment, localNegativeEndingDescription,
        localLayoutOrientation, localLayoutOrder, localImageFrame, localSplashButtonText, localContinueButtonText, localRestartButtonText, localEnableChances, localMaxChances,
        localTextColor, localTitleColor, localSplashButtonColor, localSplashButtonHoverColor, localSplashButtonTextColor, localActionButtonColor, localActionButtonTextColor, localFocusColor, localChanceIconColor, localFontFamily, localChanceIcon, localChanceReturnButtonText, localGameWonButtonText, localGameLostLastChanceButtonText, localGameTheme, localTextColorLight, localTitleColorLight, localFocusColorLight,
        localFrameBookColor, localFrameTradingCardColor, localFrameChamferedColor,
        localFrameRoundedTopColor, localGameSceneNameOverlayBg, localGameSceneNameOverlayTextColor,
        props, onSetDirty
    ]);

    const handleSave = () => {
        // Info
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
        
        // UI
        if (localLayoutOrientation !== layoutOrientation) onUpdate('gameLayoutOrientation', localLayoutOrientation);
        if (localLayoutOrder !== layoutOrder) onUpdate('gameLayoutOrder', localLayoutOrder);
        if (localImageFrame !== imageFrame) onUpdate('gameImageFrame', localImageFrame);
        if (localSplashButtonText !== splashButtonText) onUpdate('gameSplashButtonText', localSplashButtonText);
        if (localContinueButtonText !== continueButtonText) onUpdate('gameContinueButtonText', localContinueButtonText);
        if (localRestartButtonText !== restartButtonText) onUpdate('gameRestartButtonText', localRestartButtonText);
        if (localEnableChances !== enableChances) onUpdate('gameEnableChances', localEnableChances);
        if (localMaxChances !== maxChances) onUpdate('gameMaxChances', localMaxChances);
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
        if (localChanceReturnButtonText !== chanceReturnButtonText) onUpdate('gameChanceReturnButtonText', localChanceReturnButtonText);
        if (localGameWonButtonText !== gameWonButtonText) onUpdate('gameWonButtonText', localGameWonButtonText);
        if (localGameLostLastChanceButtonText !== gameLostLastChanceButtonText) onUpdate('gameLostLastChanceButtonText', localGameLostLastChanceButtonText);
        if (localGameTheme !== gameTheme) onUpdate('gameTheme', localGameTheme);
        if (localTextColorLight !== textColorLight) onUpdate('gameTextColorLight', localTextColorLight);
        if (localTitleColorLight !== titleColorLight) onUpdate('gameTitleColorLight', localTitleColorLight);
        if (localFocusColorLight !== focusColorLight) onUpdate('gameFocusColorLight', localFocusColorLight);
        if (localFrameBookColor !== frameBookColor) onUpdate('frameBookColor', localFrameBookColor);
        if (localFrameTradingCardColor !== frameTradingCardColor) onUpdate('frameTradingCardColor', localFrameTradingCardColor);
        if (localFrameChamferedColor !== frameChamferedColor) onUpdate('frameChamferedColor', localFrameChamferedColor);
        if (localFrameRoundedTopColor !== frameRoundedTopColor) onUpdate('frameRoundedTopColor', localFrameRoundedTopColor);
        if (localGameSceneNameOverlayBg !== gameSceneNameOverlayBg) onUpdate('gameSceneNameOverlayBg', localGameSceneNameOverlayBg);
        if (localGameSceneNameOverlayTextColor !== gameSceneNameOverlayTextColor) onUpdate('gameSceneNameOverlayTextColor', localGameSceneNameOverlayTextColor);
    };
    
    const handleUndo = () => {
        // Info
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
        
        // UI
        setLocalLayoutOrientation(layoutOrientation);
        setLocalLayoutOrder(layoutOrder);
        setLocalImageFrame(imageFrame);
        setLocalSplashButtonText(splashButtonText);
        setLocalContinueButtonText(continueButtonText);
        setLocalRestartButtonText(restartButtonText);
        setLocalEnableChances(enableChances);
        setLocalMaxChances(maxChances);
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
        setLocalChanceReturnButtonText(chanceReturnButtonText);
        setLocalGameWonButtonText(gameWonButtonText);
        setLocalGameLostLastChanceButtonText(gameLostLastChanceButtonText);
        setLocalGameTheme(gameTheme);
        setLocalTextColorLight(textColorLight);
        setLocalTitleColorLight(titleColorLight);
        setLocalFocusColorLight(focusColorLight);
        setLocalFrameBookColor(frameBookColor);
        setLocalFrameTradingCardColor(frameTradingCardColor);
        setLocalFrameChamferedColor(frameChamferedColor);
        setLocalFrameRoundedTopColor(frameRoundedTopColor);
        setLocalGameSceneNameOverlayBg(gameSceneNameOverlayBg);
        setLocalGameSceneNameOverlayTextColor(gameSceneNameOverlayTextColor);
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
    
    // Preview Styles helpers
    const getFramePreviewStyles = (frame: GameData['gameImageFrame']) => {
        const panelStyles: React.CSSProperties = { boxSizing: 'border-box' };
        const containerStyles: React.CSSProperties = {
            backgroundColor: localGameTheme === 'dark' ? '#1a202c' : '#e2e8f0',
            color: localGameTheme === 'dark' ? '#a0aec0' : '#4a5568',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
        };

        switch (frame) {
            case 'rounded-top':
                panelStyles.padding = '5px';
                panelStyles.backgroundColor = localFrameRoundedTopColor;
                panelStyles.border = 'none';
                panelStyles.borderRadius = '40px 40px 4px 4px';
                containerStyles.borderRadius = '35px 35px 0 0';
                break;
            case 'book-cover':
                panelStyles.padding = '8px';
                panelStyles.border = `5px solid ${localFrameBookColor}`;
                break;
            case 'trading-card':
                panelStyles.backgroundColor = localFrameTradingCardColor;
                panelStyles.borderRadius = '12px';
                panelStyles.padding = '4px';
                containerStyles.border = 'none';
                containerStyles.borderRadius = '8px';
                break;
            case 'chamfered':
                const previewChamferSize = '8px';
                const previewBorderWidth = '5px';
                const previewChamferPath = `polygon(${previewChamferSize} 0, calc(100% - ${previewChamferSize}) 0, 100% ${previewChamferSize}, 100% calc(100% - ${previewChamferSize}), calc(100% - ${previewChamferSize}) 100%, ${previewChamferSize} 100%, 0 calc(100% - ${previewChamferSize}), 0 ${previewChamferSize})`;
                
                panelStyles.padding = previewBorderWidth;
                panelStyles.backgroundColor = localFrameChamferedColor;
                panelStyles.clipPath = previewChamferPath;
                panelStyles.border = 'none';

                containerStyles.clipPath = previewChamferPath;
                containerStyles.border = 'none';
                break;
            default: // 'none' frame
                panelStyles.border = 'none';
                panelStyles.padding = '0';
        }
        return { panelStyles, containerStyles };
    };

    const { panelStyles, containerStyles } = getFramePreviewStyles(localImageFrame);
    
    const TABS = {
        geral: 'Geral',
        aparencia: 'Layout',
        textos: 'Textos',
        cores: 'Cores e Fontes',
        finais: 'Finais',
    };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <p className="text-brand-text-dim mt-1">
          Configure o título, a interface, as cores e as telas de vitória/derrota do seu jogo.
        </p>
      </div>

      <div>
        <div className="border-b border-brand-border flex space-x-1 overflow-x-auto">
          {Object.entries(TABS).map(([key, name]) => (
              <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`px-4 py-2 font-semibold text-sm rounded-t-md transition-colors whitespace-nowrap ${
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
          {activeTab === 'geral' && (
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

          {activeTab === 'aparencia' && (
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-center">
                      <div className="space-y-6">
                          <div>
                              <label htmlFor="orientation-select" className="block text-sm font-medium text-brand-text-dim mb-1">Orientação</label>
                              <select
                                  id="orientation-select"
                                  value={localLayoutOrientation}
                                  onChange={(e) => setLocalLayoutOrientation(e.target.value as 'vertical' | 'horizontal')}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                              >
                                  <option value="vertical">Vertical</option>
                                  <option value="horizontal">Horizontal</option>
                              </select>
                          </div>
                          <div>
                              <label htmlFor="order-select" className="block text-sm font-medium text-brand-text-dim mb-1">Posição da Imagem</label>
                              <select
                                  id="order-select"
                                  value={localLayoutOrder}
                                  onChange={(e) => setLocalLayoutOrder(e.target.value as 'image-first' | 'image-last')}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                              >
                                  <option value="image-first">{localLayoutOrientation === 'vertical' ? 'Esquerda' : 'Acima'}</option>
                                  <option value="image-last">{localLayoutOrientation === 'vertical' ? 'Direita' : 'Abaixo'}</option>
                              </select>
                          </div>
                          <div>
                              <label htmlFor="frame-select" className="block text-sm font-medium text-brand-text-dim mb-1">Moldura da Imagem</label>
                              <select
                                  id="frame-select"
                                  value={localImageFrame}
                                  onChange={(e) => setLocalImageFrame(e.target.value as GameData['gameImageFrame'])}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                              >
                                  <option value="none">Sem moldura</option>
                                  <option value="rounded-top">Portal</option>
                                  <option value="book-cover">Quadrada</option>
                                  <option value="trading-card">Arredondada</option>
                                  <option value="chamfered">Chanfrada</option>
                              </select>
                          </div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center">
                          <p className="text-sm text-brand-text-dim mb-2">Pré-visualização do Layout</p>
                          <div 
                              className={`w-full max-w-sm ${localLayoutOrientation === 'horizontal' ? 'aspect-[4/5]' : 'aspect-video'} bg-brand-bg border-2 border-brand-border rounded-lg flex p-2 gap-2`}
                              style={{ flexDirection: localLayoutOrientation === 'horizontal' ? 'column' : 'row' }}
                          >
                            <div 
                                className={`flex items-center justify-center ${localLayoutOrder === 'image-first' ? 'order-1' : 'order-2'} transition-all duration-300 ${localLayoutOrientation === 'horizontal' ? 'w-full h-1/2' : 'w-1/2 h-full'}`}
                                style={panelStyles}
                            >
                                  <div 
                                      className={`flex-1 w-full h-full rounded flex items-center justify-center text-center text-sm p-2 font-semibold`}
                                      style={containerStyles}
                                  >
                                      Imagem
                                  </div>
                              </div>
                              <div className={`flex-1 bg-brand-primary/30 border border-brand-primary rounded flex items-center justify-center text-center text-sm p-2 text-brand-primary-hover font-semibold ${localLayoutOrder === 'image-first' ? 'order-2' : 'order-1'} ${localLayoutOrientation === 'horizontal' ? 'w-full h-1/2' : 'w-1/2 h-full'}`}>
                                  Descrição
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="pt-6 border-t border-brand-border/50">
                      <h3 className="text-lg font-semibold text-brand-text mb-4">Sistema de Chances (Vidas)</h3>
                      <div className="flex items-center">
                          <input 
                              type="checkbox" 
                              id="enableChances" 
                              checked={localEnableChances} 
                              onChange={(e) => setLocalEnableChances(e.target.checked)}
                              className="custom-checkbox"
                          />
                          <label htmlFor="enableChances" className="ml-2 text-sm text-brand-text-dim">Habilitar sistema de chances</label>
                      </div>
                      {localEnableChances && (
                          <div className="mt-4 pl-6 border-l-2 border-brand-border/50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4">
                                  <div>
                                      <label htmlFor="maxChances" className="block text-sm font-medium text-brand-text-dim mb-1">Número de Chances</label>
                                      <input
                                          type="number"
                                          id="maxChances"
                                          value={localMaxChances}
                                          onChange={(e) => setLocalMaxChances(Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 1)))}
                                          min="1"
                                          max="10"
                                          className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                      />
                                  </div>
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
                          </div>
                      )}
                  </div>
              </div>
          )}
          
          {activeTab === 'textos' && (
              <div className="space-y-8">
                  <div>
                      <h3 className="text-lg font-semibold text-brand-text mb-4">Textos dos Botões</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div>
                              <label htmlFor="splashButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Botão de Início</label>
                              <input
                                  type="text"
                                  id="splashButtonText"
                                  value={localSplashButtonText}
                                  onChange={(e) => setLocalSplashButtonText(e.target.value)}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                  placeholder="INICIAR"
                              />
                          </div>
                          <div>
                              <label htmlFor="continueButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Botão de Continuar</label>
                              <input
                                  type="text"
                                  id="continueButtonText"
                                  value={localContinueButtonText}
                                  onChange={(e) => setLocalContinueButtonText(e.target.value)}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                  placeholder="Continuar Aventura"
                              />
                          </div>
                          <div>
                              <label htmlFor="restartButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Botão de Reiniciar (Fim de Jogo)</label>
                              <input
                                  type="text"
                                  id="restartButtonText"
                                  value={localRestartButtonText}
                                  onChange={(e) => setLocalRestartButtonText(e.target.value)}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                  placeholder="Reiniciar Aventura"
                              />
                          </div>
                          {localEnableChances && (
                            <div>
                                <label htmlFor="chanceReturnButton" className="block text-sm font-medium text-brand-text-dim mb-1">Botão de Tentar Novamente</label>
                                <p className="text-xs text-brand-text-dim mb-2">Aparece após perder uma chance.</p>
                                <input
                                    type="text"
                                    id="chanceReturnButton"
                                    value={localChanceReturnButtonText}
                                    onChange={(e) => setLocalChanceReturnButtonText(e.target.value)}
                                    className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                    placeholder="Tentar Novamente"
                                />
                            </div>
                          )}
                           {localEnableChances && (
                            <div>
                                <label htmlFor="gameLostLastChanceButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Botão de Perda Final</label>
                                <p className="text-xs text-brand-text-dim mb-2">Aparece ao perder a última chance.</p>
                                <input
                                    type="text"
                                    id="gameLostLastChanceButtonText"
                                    value={localGameLostLastChanceButtonText}
                                    onChange={(e) => setLocalGameLostLastChanceButtonText(e.target.value)}
                                    className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                    placeholder="Dessa vez, você perdeu"
                                />
                            </div>
                          )}
                          <div>
                              <label htmlFor="gameWonButtonText" className="block text-sm font-medium text-brand-text-dim mb-1">Botão de Vitória</label>
                              <p className="text-xs text-brand-text-dim mb-2">Aparece na cena final de vitória.</p>
                              <input
                                  type="text"
                                  id="gameWonButtonText"
                                  value={localGameWonButtonText}
                                  onChange={(e) => setLocalGameWonButtonText(e.target.value)}
                                  className="w-full bg-brand-bg border border-brand-border rounded-md px-3 py-2 focus:ring-0"
                                  placeholder="Você venceu!"
                              />
                          </div>
                      </div>
                  </div>
              </div>
          )}
          
          {activeTab === 'cores' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-brand-surface space-y-6">
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

                    <div className="pt-6 border-t border-brand-border/50">
                        <h3 className="text-lg font-semibold text-brand-text mb-4">Cores da Moldura</h3>
                        
                        {localImageFrame === 'rounded-top' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput label="Cor da Moldura" id="frameRoundedTopColor" value={localFrameRoundedTopColor} onChange={setLocalFrameRoundedTopColor} placeholder="#FFFFFF" />
                            </div>
                        )}
                        {localImageFrame === 'book-cover' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput label="Cor da Moldura" id="frameBookColor" value={localFrameBookColor} onChange={setLocalFrameBookColor} placeholder="#FFFFFF" />
                            </div>
                        )}
                        {localImageFrame === 'trading-card' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput label="Cor da Moldura" id="frameTradingCardColor" value={localFrameTradingCardColor} onChange={setLocalFrameTradingCardColor} placeholder="#FFFFFF" />
                            </div>
                        )}
                        {localImageFrame === 'chamfered' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput label="Cor da Moldura" id="frameChamferedColor" value={localFrameChamferedColor} onChange={setLocalFrameChamferedColor} placeholder="#FFFFFF" />
                            </div>
                        )}
                        {localImageFrame === 'none' && (
                            <p className="text-brand-text-dim text-sm text-center py-4 bg-brand-bg rounded-md">
                                Nenhuma moldura especial selecionada.
                            </p>
                        )}
                    </div>

                    <div className="pt-6 border-t border-brand-border/50">
                        <h3 className="text-lg font-semibold text-brand-text mb-4">Box de Nome da Cena</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ColorInput label="Cor de Fundo do Box" id="sceneNameOverlayBg" value={localGameSceneNameOverlayBg} onChange={setLocalGameSceneNameOverlayBg} placeholder="#0d1117" />
                            <ColorInput label="Cor do Texto do Box" id="sceneNameOverlayTextColor" value={localGameSceneNameOverlayTextColor} onChange={setLocalGameSceneNameOverlayTextColor} placeholder="#c9d1d9" />
                        </div>
                    </div>

                    {!isCustomizing && (
                         <div className="pt-6 border-t border-brand-border/50">
                             <button 
                                 onClick={() => setIsCustomizing(true)}
                                 className="w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30"
                             >
                                 Customizar Cores de Tema e Botões
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
                            </div>
                        </div>
                      </>
                    )}
                     {enableChances && (
                        <div className="pt-6 border-t border-brand-border/50">
                            <h3 className="text-lg font-semibold text-brand-text mb-4">Cor do Ícone de Chance</h3>
                            <div className="space-y-6 mt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {isCustomizing && (
                                      <ColorInput label="Cor dos Ícones de Vidas" id="chanceIconColor" value={localChanceIconColor} onChange={setLocalChanceIconColor} placeholder="#ff4d4d" />
                                    )}
                                </div>
                            </div>
                        </div>
                     )}
                </div>

                <div className="flex flex-col">
                    <p className="text-sm text-brand-text-dim mb-2 text-center">Pré-visualização ao vivo</p>
                    <div 
                        className={`flex-1 border-2 flex flex-col transition-colors ${localGameTheme === 'dark' ? 'bg-[#0d1117] border-brand-border' : 'bg-[#ffffff] border-[#d0d7de]'}`}
                        style={{ fontFamily: localFontFamily }}
                    >
                        {/* Upper Part */}
                        <div className="flex flex-1 p-4 gap-4">
                            {/* Image Panel Mock */}
                            <div className="w-2/5 h-full flex items-center justify-center relative" style={panelStyles}>
                                <div className="font-semibold" style={containerStyles}>
                                    Imagem
                                </div>
                                <div 
                                    className="absolute bottom-4 text-xs font-bold px-2 py-1 rounded" 
                                    style={{ 
                                        backgroundColor: localGameSceneNameOverlayBg, 
                                        color: localGameSceneNameOverlayTextColor,
                                        border: `1px solid ${localGameTheme === 'dark' ? '#30363d' : '#d0d7de'}`
                                    }}
                                >
                                    Nome da Cena
                                </div>
                            </div>
                            {/* Text Panel Mock */}
                            <div className="w-3/5 flex flex-col">
                                <h1 className="text-xl" style={{ color: localGameTheme === 'dark' ? localTitleColor : localTitleColorLight }}>Título do Jogo</h1>
                                <p className="text-sm mt-2" style={{ color: localGameTheme === 'dark' ? localTextColor : localTextColorLight }}>Esta é uma descrição de exemplo para a cena.</p>
                                <p className="mt-2 text-sm italic" style={{ color: localGameTheme === 'dark' ? '#8b949e' : '#57606a' }}>&gt; comando de exemplo</p>
                                {enableChances && (
                                <div className="flex gap-1 mt-auto">
                                    <ChanceIcon type={localChanceIcon} color={localChanceIconColor} />
                                    <ChanceIcon type={localChanceIcon} color={localChanceIconColor} />
                                    <ChanceIcon type={localChanceIcon} color={localChanceIconColor} />
                                </div>
                                )}
                            </div>
                        </div>

                        {/* Lower Part */}
                        <div className="p-4 space-y-4 border-t" style={{borderColor: localGameTheme === 'dark' ? '#30363d' : '#d0d7de'}}>
                             <div className="flex items-center gap-4">
                                <button className="flex-1 text-left font-bold py-2 px-4 rounded" style={{ backgroundColor: localGameTheme === 'dark' ? '#161b22' : '#f6f8fa', color: localGameTheme === 'dark' ? localTextColor : localTextColorLight, fontFamily: localFontFamily, border: `2px solid ${localGameTheme === 'dark' ? '#3036d' : '#d0d7de'}` }}>Exemplo de Escolha 1</button>
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
          )}

          {activeTab === 'finais' && (
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
                title={isDirty ? "Salvar configurações do jogo" : "Nenhuma alteração para salvar"}
            >
                Salvar
            </button>
        </div>
    </div>
  );
};

export default GameInfoEditor;
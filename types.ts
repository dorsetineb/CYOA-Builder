

export interface Choice {
  id: string;
  text: string;
  goToScene?: string; // ID of the scene to move to
  soundEffect?: string; // base64 data URL for interaction sound
  transitionType?: 'none' | 'fade' | 'wipe-down' | 'wipe-up' | 'wipe-left' | 'wipe-right';
}

// FIX: Added the missing Exits interface required by ExitsEditor.tsx.
export interface Exits {
  norte?: string;
  sul?: string;
  leste?: string;
  oeste?: string;
  acima?: string;
  abaixo?: string;
}

export interface Scene {
  id: string;
  name: string;
  image: string; // URL or base64 string
  description: string;
  choices: Choice[];
  isEndingScene?: boolean;
  removesChanceOnEntry?: boolean;
  restoresChanceOnEntry?: boolean;
  mapX?: number;
  mapY?: number;
}

export interface GameData {
  startScene: string;
  scenes: {
    [id: string]: Scene;
  };
  sceneOrder: string[];
  gameHTML: string;
  gameCSS: string;
  gameTitle?: string;
  gameFontFamily?: string;
  gameLogo?: string; // base64 string
  gameSplashImage?: string; // base64 string
  gameTextColor?: string;
  gameTitleColor?: string;
  gameOmitSplashTitle?: boolean;
  gameSplashContentAlignment?: 'left' | 'right';
  gameSplashDescription?: string;
  gameSplashButtonText?: string;
  gameContinueButtonText?: string;
  gameRestartButtonText?: string;
  gameSplashButtonColor?: string;
  gameSplashButtonHoverColor?: string;
  gameSplashButtonTextColor?: string;
  gameLayoutOrientation?: 'vertical' | 'horizontal';
  gameLayoutOrder?: 'image-first' | 'image-last';
  gameImageFrame?: 'none' | 'book-cover' | 'trading-card' | 'chamfered' | 'rounded-top';
  gameActionButtonColor?: string;
  gameActionButtonTextColor?: string;
  gameFocusColor?: string;
  gameEnableChances?: boolean;
  gameMaxChances?: number;
  gameChanceIcon?: 'circle' | 'cross' | 'heart';
  gameChanceIconColor?: string;
  gameChanceReturnButtonText?: string;
  gameTheme?: 'dark' | 'light';
  gameTextColorLight?: string;
  gameTitleColorLight?: string;
  gameFocusColorLight?: string;
  positiveEndingImage?: string;
  positiveEndingContentAlignment?: 'left' | 'right';
  positiveEndingDescription?: string;
  negativeEndingImage?: string;
  negativeEndingContentAlignment?: 'left' | 'right';
  negativeEndingDescription?: string;
  frameBookColor?: string;
  frameTradingCardColor?: string;
  frameChamferedColor?: string;
  frameRoundedTopColor?: string;
  gameSceneNameOverlayBg?: string;
  gameSceneNameOverlayTextColor?: string;
}

export type View = 'scenes' | 'interface' | 'game_info' | 'map';
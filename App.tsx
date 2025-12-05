

import React, { useState, useCallback, useMemo } from 'react';
import { GameData, Scene, View, Choice } from './types';
import Sidebar from './components/Sidebar';
import SceneEditor from './components/SceneEditor';
import Header from './components/Header';
import { WelcomePlaceholder } from './components/WelcomePlaceholder';
import GameInfoEditor from './components/GameInfoEditor';
import VariablesEditor from './components/VariablesEditor';
import Preview from './components/Preview';
import SceneMap from './components/SceneMap';

const gameHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>__GAME_TITLE__</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    __FONT_STYLESHEET__
    <link rel="stylesheet" href="style.css">
</head>
<body class="__THEME_CLASS__ __FRAME_CLASS__ __FONT_ADJUST_CLASS__">
    <audio id="scene-sound-effect" preload="auto"></audio>
    <div class="main-wrapper">
        <div id="splash-screen" class="splash-screen __SPLASH_ALIGN_CLASS__" __SPLASH_BG_STYLE__>
          <div class="splash-content" __SPLASH_TEXT_STYLE__>
            <div class="splash-text">
                __SPLASH_LOGO_IMG_TAG__
                __SPLASH_TITLE_H1_TAG__
                <p>__SPLASH_DESCRIPTION__</p>
            </div>
            <div class="splash-buttons">
                <button id="continue-button" class="hidden">__CONTINUE_BUTTON_TEXT__</button>
                <button id="splash-start-button">__SPLASH_BUTTON_TEXT__</button>
            </div>
          </div>
        </div>

        <div id="positive-ending-screen" class="splash-screen hidden __POSITIVE_ENDING_ALIGN_CLASS__" __POSITIVE_ENDING_BG_STYLE__>
            <div class="splash-content">
                <div class="splash-text">
                    <p>__POSITIVE_ENDING_DESCRIPTION__</p>
                </div>
                <button class="ending-restart-button">__RESTART_BUTTON_TEXT__</button>
            </div>
        </div>
        <div id="negative-ending-screen" class="splash-screen hidden __NEGATIVE_ENDING_ALIGN_CLASS__" __NEGATIVE_ENDING_BG_STYLE__>
            <div class="splash-content">
                <div class="splash-text">
                    <p>__NEGATIVE_ENDING_DESCRIPTION__</p>
                </div>
                <button class="ending-restart-button">__RESTART_BUTTON_TEXT__</button>
            </div>
        </div>

        <div class="game-container __LAYOUT_ORIENTATION_CLASS__ __LAYOUT_ORDER_CLASS__">
            <div class="image-panel">
                <div id="transition-overlay" class="transition-overlay"></div>
                <div id="image-container" class="image-container">
                  <img id="scene-image" src="" alt="Ilustração da cena">
                  <div id="scene-name-overlay" class="scene-name-overlay"></div>
                </div>
            </div>
            <div class="text-panel">
                <div class="diary-button-container">
                    <button id="diary-button">Diário</button>
                </div>
                <div id="scene-description" class="scene-description"></div>
                __CHANCES_CONTAINER__
                <div id="choices-container" class="choices-container"></div>
            </div>
        </div>
    </div>

    <!-- Diary Modal -->
    <div id="diary-modal" class="modal-overlay hidden">
        <div class="modal-content diary-modal-content">
            <button class="modal-close-button">&times;</button>
            <h2>Diário</h2>
            <div id="diary-log" class="diary-log"></div>
        </div>
    </div>
</body>
</html>
`;

const gameCSS = `
body {
    padding: 0;
}
body.with-spacing {
    padding: 2rem;
}
body.dark-theme {
    --bg-color: #0d1117;
    --panel-bg: #161b22;
    --border-color: #30363d;
    --text-color: __GAME_TEXT_COLOR__;
    --text-dim-color: #8b949e;
    --accent-color: __GAME_TITLE_COLOR__;
    --danger-color: #f85149;
    --danger-hover-bg: #da3633;
    --highlight-color: #eab308;
    --input-bg: #010409;
    --button-bg: #21262d;
    --button-hover-bg: #30363d;
    .choice-button { font-size: 1em; }
    #diary-button { font-size: 1em; }
}

body.light-theme {
    --bg-color: #ffffff;
    --panel-bg: #f6f8fa;
    --border-color: #d0d7de;
    --text-color: __GAME_TEXT_COLOR_LIGHT__;
    --text-dim-color: #57606a;
    --accent-color: __GAME_TITLE_COLOR_LIGHT__;
    --danger-color: #cf222e;
    --danger-hover-bg: #a40e26;
    --highlight-color: #9a6700;
    --input-bg: #ffffff;
    --button-bg: #f6f8fa;
    --button-hover-bg: #e5e7eb;
    .choice-button { font-size: 1em; }
    #diary-button { font-size: 1em; }
}

:root {
    --font-family: __FONT_FAMILY__;
    --splash-button-bg: __SPLASH_BUTTON_COLOR__;
    --splash-button-hover-bg: __SPLASH_BUTTON_HOVER_COLOR__;
    --splash-button-text-color: __SPLASH_BUTTON_TEXT_COLOR__;
    --action-button-bg: __ACTION_BUTTON_COLOR__;
    --action-button-text-color: __ACTION_BUTTON_TEXT_COLOR__;
    --splash-align-items: flex-end;
    --splash-justify-content: flex-end;
    --splash-text-align: right;
    --splash-content-align-items: flex-end;
    --scene-name-overlay-bg: __SCENE_NAME_OVERLAY_BG__;
    --scene-name-overlay-text-color: __SCENE_NAME_OVERLAY_TEXT_COLOR__;
}

/* Reset and base styles */
* { box-sizing: border-box; }
body {
    font-family: var(--font-family);
    background-color: var(--bg-color);
    color: var(--text-color);
    margin: 0;
    height: 100vh;
    overflow: hidden;
}

.main-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    max-width: 1280px;
    margin: 0 auto;
}
body.with-spacing .main-wrapper {
    height: 100%;
}


/* Splash Screen */
.splash-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    background-size: cover;
    background-position: center;
    z-index: 2000;
    padding: 0;
    display: flex;
    align-items: var(--splash-align-items);
    justify-content: var(--splash-justify-content);
}
.splash-screen.align-left {
    --splash-justify-content: flex-start;
    --splash-align-items: flex-start;
    --splash-text-align: left;
    --splash-content-align-items: flex-start;
}
.splash-content {
    text-align: var(--splash-text-align);
    display: flex;
    flex-direction: column;
    align-items: var(--splash-content-align-items);
    gap: 20px;
    width: 100%;
    padding: 5vw 225px;
}
.splash-logo {
    max-height: 150px;
    width: auto;
    margin-bottom: 20px;
}
.splash-text h1 {
    font-size: 2.5em;
    color: var(--accent-color);
    margin: 0;
    text-shadow: none;
}
.splash-text p {
    font-size: 1.1em;
    margin-top: 10px;
    color: var(--text-color);
    max-width: 60ch;
    white-space: pre-wrap;
}
.splash-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    align-items: var(--splash-content-align-items);
}
#splash-start-button, .ending-restart-button, #continue-button {
    font-family: var(--font-family);
    padding: 12px 24px;
    font-size: 1.2em;
    font-weight: bold;
    border: none;
    cursor: pointer;
    color: var(--splash-button-text-color);
    transition: all 0.2s ease-in-out;
    width: 100%;
    max-width: 350px;
}
#splash-start-button, .ending-restart-button {
    background-color: var(--splash-button-bg);
}
#continue-button {
    background-color: #1d4ed8; /* Blue-700 */
}
#splash-start-button:hover, .ending-restart-button:hover, #continue-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 3px 0px rgba(0, 0, 0, 0.4);
}
#splash-start-button:hover, .ending-restart-button:hover {
    background-color: var(--splash-button-hover-bg);
}
#continue-button:hover {
    background-color: #2563eb; /* Blue-600 */
}


/* Chances Container */
.chances-container {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-start;
    padding-bottom: 15px;
    border-bottom: 2px solid var(--border-color);
}
.chance-icon {
    width: 28px;
    height: 28px;
    transition: all 0.3s ease;
}
.chance-icon.lost {
    opacity: 0.5;
}

/* Main Layout */
.game-container {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
}
.image-panel {
    flex: 0 0 45%;
    max-width: 650px;
    border-right: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--input-bg);
    position: relative;
    transition: padding 0.3s ease-in-out, background-color 0.3s ease-in-out;
}
.image-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    transition: border 0.3s ease-in-out, outline 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}
#scene-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.scene-name-overlay {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--scene-name-overlay-bg);
    color: var(--scene-name-overlay-text-color);
    border: 2px solid var(--border-color);
    border-radius: 0; /* Sharp corners */
    font-size: 0.9em;
    font-weight: bold;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    pointer-events: none;
    text-align: center;
    padding: 8px 16px;
    box-sizing: border-box;
}

.text-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 60px 30px 30px;
    position: relative;
}

/* Layout Adjustments */
.game-container.layout-horizontal {
    flex-direction: column;
}
.game-container.layout-horizontal .image-panel {
    flex-basis: 45%; /* Use flex-basis for height in column layout */
    max-width: none;
    width: 100%;
    border-right: none;
    border-bottom: 2px solid var(--border-color);
}
.game-container.layout-horizontal .text-panel {
    min-height: 0; /* Fix for flexbox scrolling issues */
}
.game-container.layout-image-last {
    flex-direction: row-reverse;
}
.game-container.layout-image-last .image-panel {
    border-right: none;
    border-left: 2px solid var(--border-color);
}
.game-container.layout-horizontal.layout-image-last {
    flex-direction: column-reverse;
}
.game-container.layout-horizontal.layout-image-last .image-panel {
    border-left: none; /* Reset from row-reverse */
    border-bottom: none;
    border-top: 2px solid var(--border-color);
}


.scene-description {
    flex-grow: 1;
    overflow-y: auto;
    white-space: pre-wrap;
    line-height: 1.8;
    padding-bottom: 20px;
}
.verb-echo { color: var(--text-dim-color); font-style: italic; }
.highlight-item {
    font-weight: bold;
    color: var(--highlight-color);
}
.highlight-word {
    font-weight: bold;
    color: var(--accent-color);
    cursor: pointer;
    transition: color 0.2s;
}
.highlight-word:hover {
    filter: brightness(1.2);
    text-decoration: underline;
}

.choices-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-top: 20px;
    margin-top: auto;
    flex-shrink: 0;
}

.choice-button {
    font-family: var(--font-family);
    width: 100%;
    text-align: left;
    padding: 15px 20px;
    font-size: 1em;
    border: 2px solid var(--border-color);
    background-color: var(--button-bg);
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.choice-button:hover {
    background-color: var(--border-color);
    border-color: var(--accent-color);
    transform: translateX(5px);
}

.diary-button-container {
    position: absolute;
    top: 20px;
    right: 30px;
}

#diary-button {
    font-family: var(--font-family);
    padding: 8px 12px;
    border: 2px solid var(--border-color);
    background-color: var(--panel-bg);
    color: var(--text-color);
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
    font-size: 1em;
}

#diary-button:hover {
    background-color: var(--border-color);
    border-color: var(--text-dim-color);
}

/* Diary Modal */
.hidden { display: none !important; }
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal-content {
    background-color: var(--panel-bg);
    padding: 30px;
    border: 2px solid var(--border-color);
    position: relative;
    max-width: 600px;
    width: 90%;
}
.modal-content h2 {
    margin-top: 0;
    font-size: 1.5em;
    color: var(--accent-color);
}
.modal-close-button {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    color: var(--text-dim-color);
    font-size: 2em;
    cursor: pointer;
    line-height: 1;
}
.diary-modal-content {
    max-width: 80vw;
    height: 80vh;
    display: flex;
    flex-direction: column;
}
.diary-log { flex-grow: 1; overflow-y: auto; text-align: left; }
.diary-entry {
    display: flex;
    gap: 15px;
    align-items: flex-start;
    padding: 15px;
    border-bottom: 1px solid var(--border-color);
}
.diary-entry:last-child { border-bottom: none; }
.diary-entry .image-container {
    flex: 0 0 150px;
}
.diary-entry .image-container img {
    max-width: 150px;
    width: 100%;
    border: 1px solid var(--border-color);
}
.diary-entry .text-container {
    flex: 1;
}
.diary-entry .scene-name {
    font-weight: bold;
    color: var(--accent-color);
    margin-bottom: 8px;
    display: block;
}
.diary-entry .text-container p {
    margin: 0;
    white-space: pre-wrap;
}
.diary-entry .text-container .verb-echo {
    display: block;
    margin-top: 10px;
    color: var(--text-dim-color);
    font-style: italic;
}
.diary-entry .highlight-word {
    cursor: default;
}
.diary-entry .highlight-word:hover {
    filter: none;
    text-decoration: none;
}


/* Transition Overlay */
.transition-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s ease-in-out;
    z-index: 500;
    background-size: cover;
    background-position: center;
}
.transition-overlay.active {
    opacity: 1;
    pointer-events: auto;
}
.transition-overlay.is-wiping {
    opacity: 1; /* For wipes, we want the image to be visible immediately */
    transition: clip-path 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.transition-overlay.wipe-down-start {
    clip-path: inset(0 0 100% 0);
}
.transition-overlay.wipe-up-start {
    clip-path: inset(100% 0 0 0);
}
.transition-overlay.wipe-left-start {
    clip-path: inset(0 0 0 100%);
}
.transition-overlay.wipe-right-start {
    clip-path: inset(0 100% 0 0);
}
.transition-overlay.wipe-down-start.active,
.transition-overlay.wipe-up-start.active,
.transition-overlay.wipe-left-start.active,
.transition-overlay.wipe-right-start.active {
    clip-path: inset(0 0 0 0);
}

/* Image Frame Styles */
.frame-none .image-panel {
    border: none !important;
}
.frame-rounded-top .image-panel {
    padding: 10px;
    background: __FRAME_ROUNDED_TOP_COLOR__;
    border: none !important;
    border-radius: 150px 150px 6px 6px;
    box-shadow: none;
}
.frame-rounded-top .image-container {
    border-radius: 140px 140px 0 0;
}

/* --- New Frame Styles --- */
.frame-book-cover .image-panel {
    padding: 15px;
    background: var(--bg-color);
    border: 10px solid __FRAME_BOOK_COLOR__ !important;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
}
.frame-book-cover .image-container {
    box-shadow: 0 0 15px rgba(0,0,0,0.7);
}

.frame-trading-card .image-panel {
    padding: 8px;
    background: __FRAME_TRADING_CARD_COLOR__;
    border-right-color: transparent;
    border-radius: 20px;
}
.frame-trading-card .image-container {
    border: none;
    border-radius: 12px;
}
#scene-image {
    border-radius: 10px;
}

.frame-chamfered .image-panel {
    padding: 10px;
    background: __FRAME_CHAMFERED_COLOR__;
    border: none !important;
    clip-path: polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px);
}
.frame-chamfered .image-container {
    width: 100%;
    height: 100%;
    border: none;
    background-color: transparent;
    clip-path: polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px);
}

/* Font Size Adjustments */
body.font-adjust-gothic {
    font-size: 1.15em;
}

/* Custom Scrollbar */
.scene-description::-webkit-scrollbar, .diary-log::-webkit-scrollbar {
  width: 12px;
}
.scene-description::-webkit-scrollbar-track, .diary-log::-webkit-scrollbar-track {
  background: var(--panel-bg); 
}
.scene-description::-webkit-scrollbar-thumb, .diary-log::-webkit-scrollbar-thumb {
  background-color: var(--text-dim-color);
  border-radius: 6px;
  border: 3px solid var(--panel-bg);
}
.scene-description::-webkit-scrollbar-thumb:hover, .diary-log::-webkit-scrollbar-thumb:hover {
  background-color: var(--text-color);
}
`;

const initialScenes: { [id: string]: Scene } = {
  // --- Começo ---
  "scene_start": {
    id: "scene_start",
    name: "A Cela",
    description: "Você está em uma cela de masmorra fria e úmida. A porta de madeira é velha e parece fraca. Uma pequena janela com grades fica no alto da parede, fora de alcance. Há uma pilha de feno em um canto.",
    image: "",
    choices: [
      { id: 'choice_1', text: "Tentar forçar a porta.", goToScene: 'scene_corridor_barulhento' },
      { id: 'choice_2', text: "Examinar a pilha de feno.", goToScene: 'scene_cela_com_chave' }
    ]
  },
  "scene_cela_com_chave": {
    id: "scene_cela_com_chave",
    name: "A Cela (com chave)",
    description: "Você remexe no feno e, para sua surpresa, encontra uma chave de ferro, velha e enferrujada. Parece ser a chave da sua cela.",
    image: "",
    choices: [
      { id: 'choice_3', text: "Usar a chave na porta.", goToScene: 'scene_corridor_silencioso' },
      { id: 'choice_4', text: "Ignorar a chave e forçar a porta.", goToScene: 'scene_corridor_barulhento' }
    ]
  },
  // --- Corredores ---
  "scene_corridor_barulhento": {
    id: "scene_corridor_barulhento",
    name: "Corredor (Barulhento)",
    description: "Você se joga contra a porta. Com um estalo alto, a madeira cede e você está livre! O barulho, no entanto, ecoou pelo corredor silencioso. O corredor se divide à sua frente.",
    image: "",
    choices: [
      { id: 'choice_5', text: "Seguir pela esquerda, em direção a uma luz.", goToScene: 'scene_sala_guarda_alertado' },
      { id: 'choice_6', text: "Seguir pela direita, para a escuridão.", goToScene: 'scene_arsenal' }
    ]
  },
  "scene_corridor_silencioso": {
    id: "scene_corridor_silencioso",
    name: "Corredor (Silencioso)",
    description: "A chave gira com um rangido. A porta se abre, revelando um corredor escuro. Você está fora da cela sem fazer barulho. O corredor se divide à sua frente.",
    image: "",
    choices: [
      { id: 'choice_7', text: "Seguir pela esquerda, em direção a uma luz.", goToScene: 'scene_sala_guarda_dormindo' },
      { id: 'choice_8', text: "Seguir pela direita, para a escuridão.", goToScene: 'scene_arsenal' }
    ]
  },
  // --- Salas do Meio ---
  "scene_arsenal": {
    id: "scene_arsenal",
    name: "Arsenal",
    description: "Você encontra um pequeno arsenal. Há uma espada curta em uma prateleira e uma tocha apagada em um suporte na parede.",
    image: "",
    choices: [
      { id: 'choice_9', text: "Pegar a espada e continuar.", goToScene: 'scene_saida_com_espada' },
      { id: 'choice_10', text: "Pegar a tocha e continuar.", goToScene: 'scene_saida_com_tocha' },
      { id: 'choice_11', text: "Ignorar os itens e continuar.", goToScene: 'scene_saida_sem_nada' }
    ]
  },
  "scene_sala_guarda_alertado": {
    id: "scene_sala_guarda_alertado",
    name: "Sala da Guarda (Alertado)",
    description: "Você entra em uma sala e dá de cara com um guarda, que foi alertado pelo barulho que você fez. Ele puxa a espada e avança!",
    image: "",
    choices: [
      { id: 'choice_12', text: "Lutar com as próprias mãos.", goToScene: 'scene_fim_morte_guarda' },
      { id: 'choice_13', text: "Tentar fugir de volta para o corredor.", goToScene: 'scene_fim_morte_guarda' }
    ]
  },
  "scene_sala_guarda_dormindo": {
    id: "scene_sala_guarda_dormindo",
    name: "Sala da Guarda (Dormindo)",
    description: "Você entra sorrateiramente em uma sala. Um guarda está dormindo em uma cadeira, com a cabeça sobre a mesa. A chave da saída está pendurada em seu cinto.",
    image: "",
    choices: [
      { id: 'choice_14', text: "Tentar pegar a chave silenciosamente.", goToScene: 'scene_saida_com_chave_saida' },
      { id: 'choice_15', text: "Deixá-lo em paz e procurar outra saída (pela direita).", goToScene: 'scene_arsenal' }
    ]
  },
  // --- Caminhos para o Fim ---
  "scene_saida_com_espada": {
    id: "scene_saida_com_espada",
    name: "Porta de Saída (com Espada)",
    description: "Você chega ao final do corredor e encontra uma porta trancada. Não há como abri-la. De repente, um guarda aparece vindo da outra direção!",
    image: "",
    choices: [
      { id: 'choice_16', text: "Lutar com o guarda usando a espada.", goToScene: 'scene_fim_morte_guarda_armado' },
      { id: 'choice_17', text: "Tentar se render.", goToScene: 'scene_fim_morte_rendicao' }
    ]
  },
  "scene_saida_com_tocha": {
    id: "scene_saida_com_tocha",
    name: "Porta de Saída (com Tocha)",
    description: "Você chega a uma porta de madeira maciça. Ao lado, há um buraco escuro na parede, cheirando a mofo. A tocha que você carrega pode iluminar o caminho.",
    image: "",
    choices: [
      { id: 'choice_18', text: "Entrar no buraco escuro com a tocha.", goToScene: 'scene_passagem_secreta' },
      { id: 'choice_19', text: "Ignorar o buraco e tentar a porta.", goToScene: 'scene_saida_sem_nada' }
    ]
  },
  "scene_passagem_secreta": {
    id: "scene_passagem_secreta",
    name: "Passagem Secreta",
    description: "A tocha ilumina uma passagem estreita e empoeirada. Você a segue e, para sua surpresa, encontra uma escada que sobe em direção à luz do luar.",
    image: "",
    choices: [
      { id: 'choice_20', text: "Subir a escada para a liberdade!", goToScene: 'scene_fim_liberdade' }
    ]
  },
  "scene_saida_sem_nada": {
    id: "scene_saida_sem_nada",
    name: "Porta de Saída (Sem Nada)",
    description: "Você chega a uma porta de madeira maciça, trancada. Você não tem como abri-la. Seus esforços foram em vão. Você ouve passos se aproximando...",
    image: "",
    choices: [
      { id: 'choice_21', text: "Esperar o inevitável.", goToScene: 'scene_fim_morte_capturado' }
    ]
  },
  "scene_saida_com_chave_saida": {
    id: "scene_saida_com_chave_saida",
    name: "Porta de Saída (com Chave)",
    description: "Com as mãos trêmulas, você pega a chave do cinto do guarda adormecido. Ela se encaixa perfeitamente na grande porta de saída no final do corredor. Você está a um passo da liberdade.",
    image: "",
    choices: [
      { id: 'choice_22', text: "Abrir a porta e fugir.", goToScene: 'scene_fim_liberdade' }
    ]
  },
  // --- Finais ---
  "scene_fim_liberdade": {
    id: "scene_fim_liberdade",
    name: "Liberdade!",
    description: "Você abre a porta e respira o ar fresco da noite. Você está livre! A masmorra ficou para trás.",
    image: "",
    choices: [],
    isEndingScene: true
  },
  "scene_fim_morte_guarda": {
    id: "scene_fim_morte_guarda",
    name: "Fim da Linha (Luta)",
    description: "O guarda é mais forte e mais rápido. Sua tentativa de fuga termina aqui, de forma abrupta.",
    image: "",
    choices: [],
    removesChanceOnEntry: true
  },
  "scene_fim_morte_guarda_armado": {
    id: "scene_fim_morte_guarda_armado",
    name: "Fim da Linha (Armado)",
    description: "Mesmo com uma espada, o guarda é um soldado treinado. Ele desvia de seu ataque desajeitado e o derruba. Sua aventura termina aqui.",
    image: "",
    choices: [],
    removesChanceOnEntry: true
  },
  "scene_fim_morte_rendicao": {
    id: "scene_fim_morte_rendicao",
    name: "Fim da Linha (Rendição)",
    description: "Você joga a espada no chão e levanta as mãos. O guarda não está interessado em prisioneiros. Fim da linha.",
    image: "",
    choices: [],
    removesChanceOnEntry: true
  },
  "scene_fim_morte_capturado": {
    id: "scene_fim_morte_capturado",
    name: "Fim da Linha (Capturado)",
    description: "Guardas chegam e encontram você na porta trancada. Você é jogado de volta na sua cela, desta vez com segurança reforçada. Não há mais escapatória.",
    image: "",
    choices: [],
    removesChanceOnEntry: true
  }
};


const generateUniqueId = (prefix: 'scn' | 'choice', existingIds: string[]): string => {
    let id;
    do {
        id = `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
    } while (existingIds.includes(id));
    return id;
};

const initializeGameData = (): GameData => {
    const sceneIdMap: { [oldId: string]: string } = {};
    const newScenes: { [id: string]: Scene } = {};
    const existingScnIds: string[] = [];
    const initialSceneOrder = Object.keys(initialScenes);

    // First pass: generate new IDs for scenes and create a map.
    initialSceneOrder.forEach(oldSceneId => {
        const newSceneId = generateUniqueId('scn', existingScnIds);
        existingScnIds.push(newSceneId);
        sceneIdMap[oldSceneId] = newSceneId;
    });
    
    // Second pass: build the new scenes object using the new IDs and updating all references.
    initialSceneOrder.forEach(oldSceneId => {
        const oldScene = initialScenes[oldSceneId];
        const newSceneId = sceneIdMap[oldSceneId];

        const newChoices: Choice[] = oldScene.choices.map(choice => ({
            ...choice,
            id: generateUniqueId('choice', []), // Choice IDs are local to the scene
            goToScene: choice.goToScene ? sceneIdMap[choice.goToScene] : undefined,
        }));

        newScenes[newSceneId] = {
            ...oldScene,
            id: newSceneId,
            choices: newChoices,
        };
    });

    const newSceneOrder = initialSceneOrder.map(oldId => sceneIdMap[oldId]);
    const newStartScene = sceneIdMap["scene_start"];
    
    return {
        startScene: newStartScene,
        scenes: newScenes,
        sceneOrder: newSceneOrder,
        variables: [], // Initialize empty variables
        gameHTML: gameHTML,
        gameCSS: gameCSS,
        gameTitle: "Fuga da Masmorra",
        gameFontFamily: "'Silkscreen', sans-serif",
        gameLogo: "", // base64 string
        gameSplashImage: "", // base64 string
        gameSplashContentAlignment: 'right',
        gameSplashDescription: "Uma aventura de escolhas em uma masmorra escura.",
        gameTextColor: "#c9d1d9",
        gameTitleColor: "#58a6ff",
        gameOmitSplashTitle: false,
        gameSplashButtonText: "COMEÇAR",
        gameContinueButtonText: "CONTINUAR",
        gameRestartButtonText: "RECOMEÇAR",
        gameSplashButtonColor: "#8B5CF6",
        gameSplashButtonHoverColor: "#7C3AED",
        gameSplashButtonTextColor: "#ffffff",
        gameLayoutOrientation: 'vertical',
        gameLayoutOrder: 'image-first',
        gameImageFrame: 'none',
        gameActionButtonColor: '#ffffff',
        gameActionButtonTextColor: '#0d1117',
        gameFocusColor: '#58a6ff',
        gameEnableChances: true,
        gameMaxChances: 1,
        gameChanceIcon: 'heart',
        gameChanceIconColor: '#ff4d4d',
        gameChanceReturnButtonText: "Tentar Novamente",
        gameWonButtonText: "Você venceu!",
        gameLostLastChanceButtonText: "Dessa vez, você perdeu",
        gameTheme: 'dark',
        gameTextColorLight: '#24292f',
        gameTitleColorLight: '#0969da',
        gameFocusColorLight: '#0969da',
        positiveEndingImage: "",
        positiveEndingContentAlignment: 'right',
        positiveEndingDescription: "Você encontrou um final feliz!",
        negativeEndingImage: "",
        negativeEndingContentAlignment: 'right',
        negativeEndingDescription: "Você não sobreviveu...",
        frameBookColor: '#FFFFFF',
        frameTradingCardColor: '#FFFFFF',
        frameChamferedColor: '#FFFFFF',
        frameRoundedTopColor: '#FFFFFF',
        gameSceneNameOverlayBg: '#0d1117',
        gameSceneNameOverlayTextColor: '#c9d1d9',
    };
};

const createNewGameData = (): GameData => {
    const newSceneId = 'scn_start';
    const newScene: Scene = {
        id: newSceneId,
        name: "Cena Inicial",
        description: "Esta é a sua primeira cena. Descreva o que o jogador vê e adicione algumas escolhas abaixo.",
        image: "",
        choices: []
    };

    // Return a fresh, default GameData object
    return {
        startScene: newSceneId,
        scenes: { [newSceneId]: newScene },
        sceneOrder: [newSceneId],
        variables: [],
        gameHTML: gameHTML,
        gameCSS: gameCSS,
        gameTitle: "Meu Novo Jogo",
        gameFontFamily: "'Silkscreen', sans-serif",
        gameLogo: "",
        gameSplashImage: "",
        gameSplashContentAlignment: 'right',
        gameSplashDescription: "A descrição da sua nova aventura vai aqui...",
        gameTextColor: "#c9d1d9",
        gameTitleColor: "#58a6ff",
        gameOmitSplashTitle: false,
        gameSplashButtonText: "INICIAR",
        gameContinueButtonText: "CONTINUAR",
        gameRestartButtonText: "REINICIAR",
        gameSplashButtonColor: "#8B5CF6",
        gameSplashButtonHoverColor: "#7C3AED",
        gameSplashButtonTextColor: "#ffffff",
        gameLayoutOrientation: 'vertical',
        gameLayoutOrder: 'image-first',
        gameImageFrame: 'none',
        gameActionButtonColor: '#ffffff',
        gameActionButtonTextColor: '#0d1117',
        gameFocusColor: '#58a6ff',
        gameEnableChances: true,
        gameMaxChances: 3,
        gameChanceIcon: 'heart',
        gameChanceIconColor: '#ff4d4d',
        gameChanceReturnButtonText: "Tentar Novamente",
        gameWonButtonText: "Você venceu!",
        gameLostLastChanceButtonText: "Fim de Jogo",
        gameTheme: 'dark',
        gameTextColorLight: '#24292f',
        gameTitleColorLight: '#0969da',
        gameFocusColorLight: '#0969da',
        positiveEndingImage: "",
        positiveEndingContentAlignment: 'right',
        positiveEndingDescription: "Você venceu!",
        negativeEndingImage: "",
        negativeEndingContentAlignment: 'right',
        negativeEndingDescription: "Fim de jogo.",
        frameBookColor: '#FFFFFF',
        frameTradingCardColor: '#FFFFFF',
        frameChamferedColor: '#FFFFFF',
        frameRoundedTopColor: '#FFFFFF',
        gameSceneNameOverlayBg: '#0d1117',
        gameSceneNameOverlayTextColor: '#c9d1d9',
    };
};


const App: React.FC = () => {
  const [gameData, setGameData] = useState<GameData>(() => initializeGameData());
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('scenes');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [gameDataForPreview, setGameDataForPreview] = useState<GameData | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const effectiveSelectedSceneId = 
    selectedSceneId && gameData.scenes[selectedSceneId]
    ? selectedSceneId
    : gameData.startScene;

  const confirmNavigation = useCallback((callback: () => void) => {
    if (isDirty) {
      setIsDirty(false);
    }
    callback();
  }, [isDirty]);

  const handleTogglePreview = useCallback(() => {
    confirmNavigation(() => {
        setIsPreviewMode(prev => {
            const isOpening = !prev;
            if (isOpening) {
                setGameDataForPreview(null);
            }
            return isOpening;
        });
    });
  }, [confirmNavigation]);
  
  const handlePreviewSingleScene = useCallback((sceneWithUnsavedChanges: Scene) => {
    const tempGameData = JSON.parse(JSON.stringify(gameData));
    tempGameData.scenes[sceneWithUnsavedChanges.id] = sceneWithUnsavedChanges;
    tempGameData.startScene = sceneWithUnsavedChanges.id;
    
    setGameDataForPreview(tempGameData);
    setIsPreviewMode(true);
  }, [gameData]);

  const handleSelectSceneAndSwitchView = useCallback((id: string) => {
    confirmNavigation(() => {
        setSelectedSceneId(id);
        setCurrentView('scenes');
        setIsPreviewMode(false);
    });
  }, [confirmNavigation]);

  const handleSetView = useCallback((view: View) => {
    confirmNavigation(() => {
        setCurrentView(view);
    });
  }, [confirmNavigation]);

  const handleImportGame = useCallback((dataToImport: any) => {
    confirmNavigation(() => {
        const importedData = { ...dataToImport };
        // Simplified import - no longer attempts to migrate old formats
        setGameData(prev => ({...prev, ...importedData}));
        setSelectedSceneId(importedData.startScene || Object.keys(importedData.scenes)[0]);
        setCurrentView('scenes');
        setIsPreviewMode(false);
    });
  }, [confirmNavigation]);

  const handleAddScene = useCallback(() => {
    confirmNavigation(() => {
        const newSceneId = generateUniqueId('scn', Object.keys(gameData.scenes));
        const newScene: Scene = {
          id: newSceneId,
          name: "Nova Cena",
          description: "Descreva esta nova cena...",
          image: "",
          choices: []
        };
        setGameData(prev => ({
          ...prev,
          scenes: { ...prev.scenes, [newSceneId]: newScene },
          sceneOrder: [...prev.sceneOrder, newSceneId],
        }));
        setSelectedSceneId(newSceneId);
        setCurrentView('scenes');
    });
  }, [gameData.scenes, confirmNavigation]);

  const handleCopyScene = useCallback((sceneToCopy: Scene) => {
    confirmNavigation(() => {
        const allScnIds = Object.keys(gameData.scenes);
        const newSceneId = generateUniqueId('scn', allScnIds);
        const newScene: Scene = JSON.parse(JSON.stringify(sceneToCopy));

        newScene.id = newSceneId;
        newScene.name = `${sceneToCopy.name} (Cópia)`;
        
        newScene.choices = newScene.choices.map(choice => ({
            ...choice,
            id: generateUniqueId('choice', [])
        }));

        const originalSceneIndex = gameData.sceneOrder.indexOf(sceneToCopy.id);
        const newSceneOrder = [...gameData.sceneOrder];
        newSceneOrder.splice(originalSceneIndex + 1, 0, newSceneId);

        setGameData(prev => ({
            ...prev,
            scenes: { ...prev.scenes, [newSceneId]: newScene },
            sceneOrder: newSceneOrder,
        }));
        
        setSelectedSceneId(newSceneId);
        setCurrentView('scenes');
    });
}, [gameData, confirmNavigation]);

  const handleUpdateScene = useCallback((updatedScene: Scene) => {
    setGameData(prev => {
      const newScenes = { 
          ...prev.scenes,
          [updatedScene.id]: updatedScene 
      };
      
      return {
        ...prev,
        scenes: newScenes,
      };
    });
    setIsDirty(false);
  }, []);

  const handleDeleteScene = useCallback((idToDelete: string) => {
    if (idToDelete === gameData.startScene) {
        alert("A cena inicial não pode ser deletada.");
        return;
    }

    setGameData(prev => {
        const newScenes = { ...prev.scenes };
        delete newScenes[idToDelete];

        const cleanedScenes = Object.keys(newScenes).reduce((acc, sceneId) => {
            const scene = newScenes[sceneId];
            const needsCleaning = scene.choices.some(choice => choice.goToScene === idToDelete);

            if (needsCleaning) {
                const cleanedChoices = scene.choices.filter(choice => choice.goToScene !== idToDelete);
                acc[sceneId] = { ...scene, choices: cleanedChoices };
            } else {
                acc[sceneId] = scene;
            }
            return acc;
        }, {} as { [id: string]: Scene });

        const newSceneOrder = prev.sceneOrder.filter(id => id !== idToDelete);
        
        if (effectiveSelectedSceneId === idToDelete) {
            setSelectedSceneId(prev.startScene);
        }
        
        return {
            ...prev,
            scenes: cleanedScenes,
            sceneOrder: newSceneOrder,
        };
    });

    setIsDirty(false);
  }, [gameData.startScene, effectiveSelectedSceneId]);
  
  const handleReorderScenes = useCallback((newOrder: string[]) => {
      setGameData(prev => {
        const filteredOrder = newOrder.filter(id => id !== prev.startScene);
        const finalOrder = [prev.startScene, ...filteredOrder];
        return { ...prev, sceneOrder: finalOrder };
      });
  }, []);
  
  const handleUpdateGameData = useCallback((field: keyof GameData, value: any) => {
    setGameData(prev => ({ ...prev, [field]: value }));
    setIsDirty(false);
  }, []);

  const handleUpdateScenePosition = useCallback((sceneId: string, x: number, y: number) => {
    setGameData(prev => {
        const newScenes = { ...prev.scenes };
        if (newScenes[sceneId]) {
            newScenes[sceneId] = { ...newScenes[sceneId], mapX: x, mapY: y };
        }
        return { ...prev, scenes: newScenes };
    });
  }, []);

  const handleNewGame = useCallback(() => {
    const newGameData = createNewGameData();
    setGameData(newGameData);
    setSelectedSceneId(newGameData.startScene);
    setCurrentView('scenes');
    setIsPreviewMode(false);
    setIsDirty(false);
  }, []);

  const scenesInOrder = useMemo(() => gameData.sceneOrder.map(id => gameData.scenes[id]).filter(Boolean), [gameData.sceneOrder, gameData.scenes]);
  const selectedScene = effectiveSelectedSceneId ? gameData.scenes[effectiveSelectedSceneId] : null;

  const renderCurrentView = () => {
    switch (currentView) {
      case 'scenes':
        return selectedScene ? (
          <SceneEditor
            key={selectedScene.id}
            scene={selectedScene}
            allScenes={scenesInOrder}
            variables={gameData.variables || []}
            onUpdateScene={handleUpdateScene}
            onCopyScene={handleCopyScene}
            onPreviewScene={handlePreviewSingleScene}
            onSelectScene={handleSelectSceneAndSwitchView}
            isDirty={isDirty}
            onSetDirty={setIsDirty}
            layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
          />
        ) : (
          <WelcomePlaceholder />
        );
      case 'game_info':
        return (
          <GameInfoEditor
            title={gameData.gameTitle || 'Fuja da Masmorra'}
            logo={gameData.gameLogo || ''}
            omitSplashTitle={gameData.gameOmitSplashTitle || false}
            splashImage={gameData.gameSplashImage || ''}
            splashContentAlignment={gameData.gameSplashContentAlignment || 'right'}
            splashDescription={gameData.gameSplashDescription || ''}
            positiveEndingImage={gameData.positiveEndingImage || ''}
            positiveEndingContentAlignment={gameData.positiveEndingContentAlignment || 'right'}
            positiveEndingDescription={gameData.positiveEndingDescription || ''}
            negativeEndingImage={gameData.negativeEndingImage || ''}
            negativeEndingContentAlignment={gameData.negativeEndingContentAlignment || 'right'}
            negativeEndingDescription={gameData.negativeEndingDescription || ''}
            
            // Variables - no longer used in GameInfoEditor but kept for type compat if needed
            variables={gameData.variables}

            // New props from merged UIEditor
            layoutOrientation={gameData.gameLayoutOrientation || 'vertical'}
            layoutOrder={gameData.gameLayoutOrder || 'image-first'}
            imageFrame={gameData.gameImageFrame || 'none'}
            splashButtonText={gameData.gameSplashButtonText || 'INICIAR AVENTURA'}
            continueButtonText={gameData.gameContinueButtonText || 'Continuar Aventura'}
            restartButtonText={gameData.gameRestartButtonText || 'Reiniciar Aventura'}
            enableChances={gameData.gameEnableChances || false}
            maxChances={gameData.gameMaxChances || 3}
            textColor={gameData.gameTextColor || '#c9d1d9'}
            titleColor={gameData.gameTitleColor || '#58a6ff'}
            splashButtonColor={gameData.gameSplashButtonColor || '#2ea043'}
            splashButtonHoverColor={gameData.gameSplashButtonHoverColor || '#238636'}
            splashButtonTextColor={gameData.gameSplashButtonTextColor || '#ffffff'}
            actionButtonColor={gameData.gameActionButtonColor || '#ffffff'}
            actionButtonTextColor={gameData.gameActionButtonTextColor || '#0d1117'}
            focusColor={gameData.gameFocusColor || '#58a6ff'}
            chanceIconColor={gameData.gameChanceIconColor || '#ff4d4d'}
            gameFontFamily={gameData.gameFontFamily || "'Silkscreen', sans-serif"}
            chanceIcon={gameData.gameChanceIcon || 'heart'}
            chanceReturnButtonText={gameData.gameChanceReturnButtonText || ''}
            gameWonButtonText={gameData.gameWonButtonText || ''}
            gameLostLastChanceButtonText={gameData.gameLostLastChanceButtonText || ''}
            gameTheme={gameData.gameTheme || 'dark'}
            textColorLight={gameData.gameTextColorLight || '#24292f'}
            titleColorLight={gameData.gameTitleColorLight || '#0969da'}
            focusColorLight={gameData.gameFocusColorLight || '#0969da'}
            frameBookColor={gameData.frameBookColor || '#FFFFFF'}
            frameTradingCardColor={gameData.frameTradingCardColor || '#FFFFFF'}
            frameChamferedColor={gameData.frameChamferedColor || '#FFFFFF'}
            frameRoundedTopColor={gameData.frameRoundedTopColor || '#FFFFFF'}
            gameSceneNameOverlayBg={gameData.gameSceneNameOverlayBg || '#0d1117'}
            gameSceneNameOverlayTextColor={gameData.gameSceneNameOverlayTextColor || '#c9d1d9'}
            
            onUpdate={handleUpdateGameData}
            isDirty={isDirty}
            onSetDirty={setIsDirty}
          />
        );
      case 'map':
        return (
          <SceneMap
            allScenesMap={gameData.scenes}
            startSceneId={gameData.startScene}
            onSelectScene={handleSelectSceneAndSwitchView}
            onUpdateScenePosition={handleUpdateScenePosition}
            onAddScene={handleAddScene}
          />
        );
      case 'variables':
        return (
          <VariablesEditor
            variables={gameData.variables || []}
            onUpdateVariables={(newVariables) => handleUpdateGameData('variables', newVariables)}
            isDirty={isDirty}
            onSetDirty={setIsDirty}
          />
        );
      default:
        return <WelcomePlaceholder />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-brand-bg text-brand-text font-sans">
      <Header
        gameData={gameData}
        onImportGame={handleImportGame}
        isPreviewing={isPreviewMode}
        onTogglePreview={handleTogglePreview}
      />
      {isPreviewMode ? (
        <Preview gameData={gameDataForPreview || gameData} />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            scenes={scenesInOrder}
            startSceneId={gameData.startScene}
            selectedSceneId={effectiveSelectedSceneId}
            currentView={currentView}
            onSelectScene={handleSelectSceneAndSwitchView}
            onAddScene={handleAddScene}
            onDeleteScene={handleDeleteScene}
            onReorderScenes={handleReorderScenes}
            onSetView={handleSetView}
            onNewGame={handleNewGame}
          />
          <main className="flex-1 p-6 overflow-y-auto">
            {renderCurrentView()}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
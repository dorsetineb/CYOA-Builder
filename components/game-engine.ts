


import { GameData, Scene } from '../types';

export const prepareGameDataForEngine = (data: GameData): object => {
    // Create a deep copy of scenes to avoid modifying the original data
    const scenesForEngine: { [id: string]: Partial<Scene> } = JSON.parse(JSON.stringify(data.scenes));

    // The engine expects 'interactions', but we now use 'choices'.
    // We can just pass the choices array as is, since the new engine will know how to handle it.
    // No major transformation is needed here anymore, just passing the relevant data.
    return {
        cena_inicial: data.startScene,
        cenas: scenesForEngine,
        variables: data.variables, // Pass variables definition
        gameEnableChances: data.gameEnableChances,
        gameMaxChances: data.gameMaxChances,
        gameChanceIcon: data.gameChanceIcon,
        gameChanceIconColor: data.gameChanceIconColor,
        gameChanceReturnButtonText: data.gameChanceReturnButtonText,
        gameWonButtonText: data.gameWonButtonText,
        gameLostLastChanceButtonText: data.gameLostLastChanceButtonText,
        gameTheme: data.gameTheme,
        gameTextColorLight: data.gameTextColorLight,
        gameTitleColorLight: data.gameTitleColorLight,
        gameFocusColorLight: data.gameFocusColorLight,
        positiveEndingImage: data.positiveEndingImage,
        positiveEndingContentAlignment: data.positiveEndingContentAlignment,
        positiveEndingDescription: data.positiveEndingDescription,
        negativeEndingImage: data.negativeEndingImage,
        negativeEndingContentAlignment: data.negativeEndingContentAlignment,
        negativeEndingDescription: data.negativeEndingDescription,
        gameRestartButtonText: data.gameRestartButtonText,
        gameContinueButtonText: data.gameContinueButtonText,
    };
};

export const gameJS = `
document.addEventListener('DOMContentLoaded', () => {
    // --- Icon SVGs ---
    const ICONS = {
        heart: '<svg fill="%COLOR%" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        circle: '<svg fill="%COLOR%" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
        cross: '<svg stroke="%COLOR%" stroke-width="3" stroke-linecap="round" viewBox="0 0 24 24"><path d="M12 5 V19 M5 12 H19"/></svg>'
    };
    
    const ICONS_OUTLINE = {
        heart: '<svg fill="none" stroke="%COLOR%" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        circle: '<svg fill="none" stroke="%COLOR%" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
        cross: ICONS.cross // Cross is already an outline
    };

    // --- DOM Elements ---
    const sceneDescriptionElement = document.getElementById('scene-description');
    const sceneImageElement = document.getElementById('scene-image');
    const sceneSoundEffectElement = document.getElementById('scene-sound-effect');
    const transitionOverlay = document.getElementById('transition-overlay');
    const splashScreen = document.getElementById('splash-screen');
    const startButton = document.getElementById('splash-start-button');
    const continueButton = document.getElementById('continue-button');
    const diaryButton = document.getElementById('diary-button');
    const diaryModal = document.getElementById('diary-modal');
    const diaryLogElement = document.getElementById('diary-log');
    const diaryModalCloseButton = diaryModal ? diaryModal.querySelector('.modal-close-button') : null;
    const positiveEndingScreen = document.getElementById('positive-ending-screen');
    const negativeEndingScreen = document.getElementById('negative-ending-screen');
    const endingRestartButtons = document.querySelectorAll('.ending-restart-button');
    const gameHeader = document.querySelector('.game-header');
    const gameContainer = document.querySelector('.game-container');
    const sceneNameOverlayElement = document.getElementById('scene-name-overlay');
    const choicesContainer = document.getElementById('choices-container');


    // --- State Variables ---
    let gameData = null;
    let originalScenes = null;
    const SAVE_KEY = 'cyoaBuilderSaveData_v2';
    let currentState = {
        currentSceneId: null,
        previousSceneId: null,
        diaryLog: [],
        scenesState: {},
        chances: null,
        variables: {},
    };
    let onRenderCompleteCallback = null;

    // --- Logic Helpers ---

    function checkCondition(condition) {
        if (!condition || !condition.variableId) return true;
        
        const currentVal = currentState.variables[condition.variableId] !== undefined 
            ? currentState.variables[condition.variableId] 
            : 0;
            
        const targetVal = condition.value;
        
        switch (condition.operator) {
            case '>': return currentVal > targetVal;
            case '<': return currentVal < targetVal;
            case '>=': return currentVal >= targetVal;
            case '<=': return currentVal <= targetVal;
            case '==': return currentVal === targetVal;
            case '!=': return currentVal !== targetVal;
            default: return true;
        }
    }

    function applyEffects(effects) {
        if (!effects || effects.length === 0) return;
        
        effects.forEach(effect => {
            const currentVal = currentState.variables[effect.variableId] !== undefined 
                ? currentState.variables[effect.variableId] 
                : 0;
            
            let newVal = currentVal;
            
            if (effect.operation === 'add') {
                newVal += effect.value;
            } else if (effect.operation === 'subtract') {
                newVal -= effect.value;
            } else if (effect.operation === 'set') {
                newVal = effect.value;
            }
            
            currentState.variables[effect.variableId] = newVal;
        });
    }

    // --- Game Logic ---
    function saveState() {
        if (window.isPreview) return;
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(currentState));
        } catch (e) {
            console.warn("Could not save game state to localStorage:", e);
        }
    }

    function loadState() {
        if (window.isPreview) return false;
        try {
            const savedData = localStorage.getItem(SAVE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                if (parsedData.currentSceneId && parsedData.scenesState) {
                    currentState = parsedData;
                    // Ensure variables exist in loaded state
                    if (!currentState.variables) currentState.variables = {};
                    return true;
                }
            }
        } catch (e) {
            console.warn("Could not load game state from localStorage:", e);
            localStorage.removeItem(SAVE_KEY);
        }
        return false;
    }
    
    function renderChances() {
        if (!gameData.gameEnableChances) return;
        const container = document.querySelector('.chances-container');
        if (!container) return;
        container.innerHTML = '';
        
        const iconType = gameData.gameChanceIcon || 'heart';
        const activeColor = gameData.gameChanceIconColor || '#ff4d4d';
        const lostColor = '#4a5568';

        for (let i = 1; i <= gameData.gameMaxChances; i++) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'chance-icon';
            const isLost = i > currentState.chances;
            
            let iconSvg;
            let color;

            if (isLost) {
                iconWrapper.classList.add('lost');
                iconSvg = ICONS_OUTLINE[iconType] || ICONS_OUTLINE.heart;
                color = lostColor;
            } else {
                iconSvg = ICONS[iconType] || ICONS.heart;
                color = activeColor;
            }
            
            iconWrapper.innerHTML = iconSvg.replace(/%COLOR%/g, color);
            container.appendChild(iconWrapper);
        }
    }

    function showEnding(type) {
        let screenToShow;
        if (type === 'positive' && positiveEndingScreen) {
            screenToShow = positiveEndingScreen;
        } else if (type === 'negative' && negativeEndingScreen) {
            screenToShow = negativeEndingScreen;
        }

        if (screenToShow) {
            if(gameHeader) gameHeader.classList.add('hidden');
            if(gameContainer) gameContainer.classList.add('hidden');
            if (choicesContainer) choicesContainer.innerHTML = '';
            screenToShow.classList.remove('hidden');
            currentState.diaryLog.push({ type: 'ending', data: { type } });
            saveState();
        }
    }

    function changeScene(sceneId, isStateLoad = false) {
        const scene = currentState.scenesState[sceneId];
        if (!scene) {
            console.error('Error: Scene with ID "' + sceneId + '" not found.');
            if (sceneDescriptionElement) sceneDescriptionElement.textContent = 'Error: Scene "' + sceneId + '" not found.';
            return;
        }
        
        // --- AUTO-REDIRECT LOGIC (Scene Scripts) ---
        if (scene.scripts && scene.scripts.length > 0) {
            for (let script of scene.scripts) {
                 if (script.triggerCondition && checkCondition(script.triggerCondition)) {
                     // Condition met, redirect immediately
                     // Use setTimeout to avoid recursion depth issues if many auto-jumps happen
                     setTimeout(() => changeScene(script.goToScene, isStateLoad), 0);
                     return; 
                 }
            }
        }
        
        onRenderCompleteCallback = null;
        if(choicesContainer) choicesContainer.innerHTML = '';

        if (!isStateLoad && !gameData.gameEnableChances && scene.removesChanceOnEntry) {
            if (sceneDescriptionElement) sceneDescriptionElement.innerHTML = '';
            showEnding('negative');
            return;
        }
        
        if (!isStateLoad) {
            if (scene.isEndingScene) {
                onRenderCompleteCallback = () => {
                    const winButton = document.createElement('button');
                    winButton.textContent = gameData.gameWonButtonText || "você venceu";
                    winButton.className = 'choice-button';
                    winButton.style.textAlign = 'center';
                    winButton.onclick = () => showEnding('positive');
                    if (choicesContainer) choicesContainer.appendChild(winButton);
                };
            } else if (gameData.gameEnableChances) {
                if (scene.removesChanceOnEntry) {
                    currentState.chances--;
                    renderChances();
                    if (currentState.chances <= 0) {
                        onRenderCompleteCallback = () => {
                            const gameOverButton = document.createElement('button');
                            gameOverButton.textContent = gameData.gameLostLastChanceButtonText || "dessa vez, você perdeu";
                            gameOverButton.className = 'choice-button';
                            gameOverButton.style.textAlign = 'center';
                            gameOverButton.onclick = () => showEnding('negative');
                            if (choicesContainer) choicesContainer.appendChild(gameOverButton);
                        };
                    } else {
                        onRenderCompleteCallback = () => {
                            const returnButton = document.createElement('button');
                            returnButton.textContent = gameData.gameChanceReturnButtonText || 'Tentar Novamente';
                            returnButton.className = 'choice-button';
                            returnButton.style.textAlign = 'center';
                            returnButton.onclick = () => performSceneChange(currentState.previousSceneId);
                            if (choicesContainer) choicesContainer.appendChild(returnButton);
                        };
                    }
                } else if (scene.restoresChanceOnEntry) {
                    if (currentState.chances < gameData.gameMaxChances) {
                        currentState.chances++;
                        renderChances();
                    }
                }
            }
        }

        if (!isStateLoad && currentState.currentSceneId !== sceneId) {
            currentState.previousSceneId = currentState.currentSceneId;
        }

        currentState.currentSceneId = sceneId;
        
        if (!isStateLoad) {
            const lastLogEntry = currentState.diaryLog[currentState.diaryLog.length - 1];
            if (!lastLogEntry || lastLogEntry.type !== 'scene_load' || lastLogEntry.data.id !== scene.id) {
                currentState.diaryLog.push({
                    type: 'scene_load',
                    data: {
                        id: scene.id,
                        name: scene.name,
                        image: scene.image,
                        description: scene.description,
                    }
                });
            }
        }
        
        if (sceneImageElement && scene.image) {
            sceneImageElement.src = scene.image;
        } else if (sceneImageElement) {
            sceneImageElement.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        }
        
        if (sceneNameOverlayElement) {
            sceneNameOverlayElement.textContent = scene.name;
        }

        if (sceneDescriptionElement) {
            sceneDescriptionElement.innerHTML = '';
            const p = document.createElement('p');
            p.innerHTML = scene.description.replace(/\\n/g, '<br>');
            sceneDescriptionElement.appendChild(p);
            sceneDescriptionElement.scrollTop = 0;
        }

        // Render choices or handle callback
        if (onRenderCompleteCallback) {
            onRenderCompleteCallback();
            onRenderCompleteCallback = null;
        } else {
            scene.choices.forEach(choice => {
                // CHECK CONDITION
                if (choice.reqCondition && !checkCondition(choice.reqCondition)) {
                    return; // Skip rendering this choice
                }

                const button = document.createElement('button');
                button.className = 'choice-button';
                button.textContent = choice.text;
                button.onclick = () => {
                    // APPLY EFFECTS
                    if (choice.effects) {
                        applyEffects(choice.effects);
                    }
                
                    currentState.diaryLog.push({ type: 'choice', data: { text: choice.text, from: scene.id, to: choice.goToScene } });
                    performSceneChange(choice.goToScene, choice.soundEffect, choice.transitionType);
                };
                if (choicesContainer) choicesContainer.appendChild(button);
            });
        }

        if (!isStateLoad) {
            saveState();
        }
    }

    function performSceneChange(sceneId, soundEffectUrl, transitionType = 'none') {
        if (!transitionOverlay) {
            changeScene(sceneId);
            return;
        }
    
        const newScene = currentState.scenesState[sceneId];
        if (!newScene) {
            console.error('New scene not found for transition:', sceneId);
            changeScene(sceneId);
            return;
        }
    
        if (soundEffectUrl && sceneSoundEffectElement) {
            sceneSoundEffectElement.src = soundEffectUrl;
            sceneSoundEffectElement.play().catch(e => console.warn("Sound autoplay failed:", e));
        }
    
        if (sceneNameOverlayElement) sceneNameOverlayElement.style.opacity = '0';
    
        if (transitionType === 'none' || !transitionType) {
            changeScene(sceneId);
            if (sceneNameOverlayElement) setTimeout(() => { sceneNameOverlayElement.style.opacity = '1'; }, 50);
            return;
        }
    
        const onTransitionEnd = () => {
            transitionOverlay.removeEventListener('transitionend', onTransitionEnd);
            changeScene(sceneId);
            transitionOverlay.className = 'transition-overlay';
            transitionOverlay.style.cssText = ''; 
            if (sceneNameOverlayElement) setTimeout(() => { sceneNameOverlayElement.style.opacity = '1'; }, 50);
        };
        
        transitionOverlay.addEventListener('transitionend', onTransitionEnd, { once: true });
        transitionOverlay.style.backgroundImage = \`url('\${newScene.image || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}')\`;
        
        let startClass = '', transClass = '';
        switch (transitionType) {
            case 'fade': break;
            case 'wipe-down': startClass = 'wipe-down-start'; transClass = 'is-wiping'; break;
            case 'wipe-up': startClass = 'wipe-up-start'; transClass = 'is-wiping'; break;
            case 'wipe-left': startClass = 'wipe-left-start'; transClass = 'is-wiping'; break;
            case 'wipe-right': startClass = 'wipe-right-start'; transClass = 'is-wiping'; break;
            default:
                transitionOverlay.removeEventListener('transitionend', onTransitionEnd);
                changeScene(sceneId);
                return;
        }
    
        transitionOverlay.className = 'transition-overlay';
        if (startClass) transitionOverlay.classList.add(startClass);
        if (transClass) transitionOverlay.classList.add(transClass);
    
        requestAnimationFrame(() => {
             requestAnimationFrame(() => {
                transitionOverlay.classList.add('active');
             });
        });
    }

    function renderDiary() {
        if (!diaryLogElement) return;
        diaryLogElement.innerHTML = '';
    
        let lastSceneId = null;
    
        currentState.diaryLog.forEach(entry => {
            if (entry.type === 'scene_load' && entry.data.id !== lastSceneId) {
                const scene = entry.data;
                const div = document.createElement('div');
                div.className = 'diary-entry';
                
                div.innerHTML = \`
                    <div class="image-container">
                        <img src="\${scene.image || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}" alt="\${scene.name}">
                    </div>
                    <div class="text-container">
                        <span class="scene-name">\${scene.name}</span>
                        <p>\${scene.description.replace(/\\n/g, '<br>')}</p>
                    </div>
                \`;
                diaryLogElement.appendChild(div);
                lastSceneId = scene.id;
            } else if (entry.type === 'choice') {
                const choice = entry.data;
                const p = document.createElement('p');
                p.className = 'verb-echo';
                p.style.textAlign = 'center';
                p.style.padding = '8px';
                p.innerHTML = \`<em>Você escolheu: "\${choice.text}"</em>\`;
                const lastEntryElement = diaryLogElement.querySelector('.diary-entry:last-child .text-container');
                if (lastEntryElement) {
                    lastEntryElement.appendChild(p);
                }
            }
        });
    
        diaryLogElement.scrollTop = diaryLogElement.scrollHeight;
    }
    
    function initializeGame(startFresh = false) {
        if (startFresh) {
            try {
                localStorage.removeItem(SAVE_KEY);
            } catch (e) {
                console.warn("Could not remove saved game state from localStorage:", e);
            }
        }

        gameData = window.embeddedGameData;
        if (!gameData) {
            console.error('Game data not found!');
            if (sceneDescriptionElement) sceneDescriptionElement.textContent = 'Error: Game data is missing.';
            return;
        }
        
        originalScenes = JSON.parse(JSON.stringify(gameData.cenas));
        const hasSave = loadState();

        if (startFresh || !hasSave) {
            currentState.currentSceneId = gameData.cena_inicial;
            currentState.previousSceneId = null;
            currentState.diaryLog = [];
            currentState.scenesState = JSON.parse(JSON.stringify(originalScenes));
            
            // Initialize Variables
            currentState.variables = {};
            if (gameData.variables) {
                gameData.variables.forEach(v => {
                    currentState.variables[v.id] = v.initialValue;
                });
            }

            if (gameData.gameEnableChances) {
                currentState.chances = gameData.gameMaxChances;
            }
        }
        
        changeScene(currentState.currentSceneId, hasSave && !startFresh);
        if(gameData.gameEnableChances) renderChances();
    }
    
    // --- Event Listeners ---
    if (diaryButton) {
        diaryButton.addEventListener('click', () => {
            renderDiary();
            if (diaryModal) diaryModal.classList.remove('hidden');
        });
    }

    if (diaryModalCloseButton) {
        diaryModalCloseButton.addEventListener('click', () => {
            if (diaryModal) diaryModal.classList.add('hidden');
        });
    }
    
    if (startButton) {
        startButton.addEventListener('click', () => {
            initializeGame(true);
            if (splashScreen) splashScreen.classList.add('hidden');
            if(sceneNameOverlayElement) setTimeout(() => sceneNameOverlayElement.style.opacity = '1', 500);
        });
    }
    
    endingRestartButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (positiveEndingScreen) positiveEndingScreen.classList.add('hidden');
            if (negativeEndingScreen) negativeEndingScreen.classList.add('hidden');
            if (splashScreen) splashScreen.classList.add('hidden');
            if (gameContainer) gameContainer.classList.remove('hidden');
            initializeGame(true);
        });
    });

    if (continueButton) {
        if (!window.isPreview && localStorage.getItem(SAVE_KEY)) {
            continueButton.classList.remove('hidden');
            continueButton.addEventListener('click', () => {
                 if (splashScreen) splashScreen.classList.add('hidden');
                 if(sceneNameOverlayElement) setTimeout(() => sceneNameOverlayElement.style.opacity = '1', 500);
            });
        }
    }

    initializeGame();
});
`
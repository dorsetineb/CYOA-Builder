
import React from 'react';
import SceneList from './SceneList';
import { Scene, View } from '../types';
import { CodeIcon } from './icons/CodeIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { MapIcon } from './icons/MapIcon';
import { DocumentPlusIcon } from './icons/DocumentPlusIcon';

interface SidebarProps {
  scenes: Scene[];
  startSceneId: string;
  selectedSceneId: string | null;
  currentView: View;
  onSelectScene: (id: string) => void;
  onAddScene: () => void;
  onDeleteScene: (id: string) => void;
  onReorderScenes: (newOrder: string[]) => void;
  onSetView: (view: View) => void;
  onNewGame: () => void;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { currentView, onSetView, scenes, onNewGame, ...sceneListProps } = props;

  const getButtonClass = (view: View) => 
    `w-full flex items-center p-2 rounded-md transition-colors text-left ${
      currentView === view 
        ? 'bg-brand-primary/20 text-brand-primary' 
        : 'hover:bg-brand-border/50'
    }`;

  return (
    <aside className="w-1/4 xl:w-1/5 bg-brand-sidebar p-4 border-r border-brand-border flex flex-col">
      <nav className="flex flex-col gap-2 flex-grow overflow-y-auto">
        <button className={getButtonClass('game_info')} onClick={() => onSetView('game_info')}>
          <InformationCircleIcon className="w-5 h-5 mr-3" />
          <span className="font-semibold">Informações do Jogo</span>
        </button>
        <button className={getButtonClass('interface')} onClick={() => onSetView('interface')}>
          <CodeIcon className="w-5 h-5 mr-3" />
          <span className="font-semibold">Interface</span>
        </button>
      
        {/* Scene Editor Section */}
        <div>
            <button className={getButtonClass('scenes')} onClick={() => onSetView('scenes')}>
                <BookOpenIcon className="w-5 h-5 mr-3" />
                <span className="font-semibold">Editor de Cenas</span>
                <span className="ml-auto bg-white text-brand-bg text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {scenes.length}
                </span>
            </button>
            {currentView === 'scenes' && (
              <div className="pl-4 pt-2 mt-2 border-l-2 border-brand-border/50 ml-2">
                <SceneList scenes={scenes} {...sceneListProps} />
              </div>
            )}
        </div>
        
        <button className={getButtonClass('map')} onClick={() => onSetView('map')}>
            <MapIcon className="w-5 h-5 mr-3" />
            <span className="font-semibold">Mapa de Cenas</span>
        </button>
      </nav>
      <div className="flex-shrink-0 mt-4 pt-4 border-t border-brand-border">
          <button
              onClick={onNewGame}
              className="w-full flex items-center justify-center px-4 py-2 border-2 border-solid border-brand-primary text-brand-primary font-semibold rounded-md hover:bg-brand-primary/20 transition-colors duration-200"
          >
              Novo Jogo
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;

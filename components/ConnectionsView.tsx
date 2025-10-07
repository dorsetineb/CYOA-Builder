

import React from 'react';
import { Scene, Choice } from '../types';
import { ConnectionDetail } from './SceneEditor';

interface ConnectionsViewProps {
  currentScene: Scene;
  inputConnections: ConnectionDetail[];
  outputConnections: ConnectionDetail[];
  onSelectScene: (sceneId: string) => void;
}

const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  currentScene,
  inputConnections,
  outputConnections,
  onSelectScene,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Input Scenes Column */}
      <div className="space-y-3">
        <h4 className="flex items-center gap-2 text-md font-semibold text-brand-text-dim border-b border-brand-border pb-2">
          Entradas
          <span className="bg-white text-brand-bg text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {inputConnections.length}
          </span>
        </h4>
        <p className="text-xs text-brand-text-dim -mt-2">Cenas que levam para esta cena.</p>
        <div className="space-y-3">
          {inputConnections.length > 0 ? (
            inputConnections.map(({ scene, choices }) => (
              <div
                key={scene.id}
                className="w-full text-left p-3 bg-brand-bg border border-brand-border rounded-md"
              >
                <button onClick={() => onSelectScene(scene.id)} className="w-full text-left rounded-md -m-1 p-1 hover:bg-brand-border/30 transition-colors">
                  <p className="font-semibold text-brand-text">{scene.name}</p>
                  <p className="text-xs font-mono text-brand-text-dim">{scene.id}</p>
                </button>
                <div className="mt-2 pt-2 border-t border-brand-border/50 text-xs space-y-1">
                  {choices.map(choice => (
                      <div key={choice.id} className="text-brand-text bg-brand-surface p-2 rounded items-center">
                        <span className="italic">"{choice.text}"</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-brand-text-dim text-sm text-center py-4 bg-brand-bg rounded-md">Nenhuma cena leva diretamente para aqui.</p>
          )}
        </div>
      </div>

      {/* Output Scenes Column */}
      <div className="space-y-3">
        <h4 className="flex items-center gap-2 text-md font-semibold text-brand-text-dim border-b border-brand-border pb-2">
            Saídas
            <span className="bg-white text-brand-bg text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {outputConnections.length}
            </span>
        </h4>
        <p className="text-xs text-brand-text-dim -mt-2">Cenas alcançáveis a partir desta cena.</p>
        <div className="space-y-3">
          {outputConnections.length > 0 ? (
            outputConnections.map(({ scene, choices }) => (
              <div
                key={scene.id}
                className="w-full text-left p-3 bg-brand-bg border border-brand-border rounded-md"
              >
                <button onClick={() => onSelectScene(scene.id)} className="w-full text-left rounded-md -m-1 p-1 hover:bg-brand-border/30 transition-colors">
                  <p className="font-semibold text-brand-text">{scene.name}</p>
                  <p className="text-xs font-mono text-brand-text-dim">{scene.id}</p>
                </button>
                 <div className="mt-2 pt-2 border-t border-brand-border/50 text-xs space-y-1">
                    {choices.map(choice => (
                        <div key={choice.id} className="text-brand-text bg-brand-surface p-2 rounded items-center">
                            <span className="italic">"{choice.text}"</span>
                        </div>
                      )
                    )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-brand-text-dim text-sm text-center py-4 bg-brand-bg rounded-md">Esta cena não leva diretamente a nenhuma outra.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsView;



import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Scene, GameData, Choice } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';

interface SceneMapProps {
  allScenesMap: GameData['scenes'];
  startSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onUpdateScenePosition: (sceneId: string, x: number, y: number) => void;
  onAddScene: () => void;
}

const NODE_WIDTH = 250;
const NODE_HEADER_HEIGHT = 70;
const CHOICE_ITEM_HEIGHT = 36;
const X_GAP = 150;
const Y_GAP = 50;
const CHOICE_ITEM_MARGIN_Y = 4; // Corresponds to gap-1
const PADDING = 8; // Corresponds to p-2 or py-2
const CONNECTOR_RADIUS = 8; // Half of connector width (w-4)

type Node = Scene & { x: number; y: number; level: number; height: number };
type Edge = { source: string; target: string; sourceChoiceId: string };

const SceneMap: React.FC<SceneMapProps> = ({ allScenesMap, startSceneId, onSelectScene, onUpdateScenePosition, onAddScene }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [dragInfo, setDragInfo] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const { initialNodes, edges, bounds, nodeLevels, nodesWithForwardIncomingEdges, nodesWithBackwardIncomingEdges, choicesWithForwardOutgoingEdges, choicesWithBackwardOutgoingEdges } = useMemo(() => {
    const nodeData = new Map<string, { height: number }>();
    Object.values(allScenesMap).forEach((scene: Scene) => {
        const linkingChoices = scene.choices?.filter(choice => choice.goToScene) || [];
        const choicesHeight = linkingChoices.length > 0
            ? (linkingChoices.length * CHOICE_ITEM_HEIGHT) + ((linkingChoices.length - 1) * CHOICE_ITEM_MARGIN_Y) + PADDING
            : 0;
        nodeData.set(scene.id, { height: NODE_HEADER_HEIGHT + choicesHeight });
    });
    
    const createdEdges: Edge[] = [];
    Object.values(allScenesMap).forEach((scene: Scene) => {
        scene.choices?.forEach(choice => {
            if (choice.goToScene && allScenesMap[choice.goToScene]) {
                createdEdges.push({ source: scene.id, target: choice.goToScene, sourceChoiceId: choice.id });
            }
        });
    });

    const levels = new Map<number, string[]>();
    const visited = new Set<string>();
    const nodeLevels = new Map<string, number>();
    
    if (startSceneId && allScenesMap[startSceneId]) {
      const queue: { id: string; level: number }[] = [{ id: startSceneId, level: 0 }];
      visited.add(startSceneId);

      while (queue.length > 0) {
        const { id, level } = queue.shift()!;
        const scene = allScenesMap[id];
        if (!scene) continue;
        
        nodeLevels.set(id, level);

        if (!levels.has(level)) levels.set(level, []);
        levels.get(level)!.push(id);

        scene.choices?.forEach(choice => {
          if (choice.goToScene && allScenesMap[choice.goToScene]) {
            if (!visited.has(choice.goToScene)) {
              visited.add(choice.goToScene);
              queue.push({ id: choice.goToScene, level: level + 1 });
            }
          }
        });
      }
    }
    
    const unlinkedScenes = Object.keys(allScenesMap).filter(id => !visited.has(id));
    if(unlinkedScenes.length > 0) {
        let unlinkedLevel = levels.size > 0 ? levels.size : 0;
        unlinkedScenes.forEach(id => {
            if (!levels.has(unlinkedLevel)) levels.set(unlinkedLevel, []);
            if(!levels.get(unlinkedLevel)!.includes(id)) {
                levels.get(unlinkedLevel)!.push(id);
            }
            nodeLevels.set(id, unlinkedLevel);
        });
    }
    
    const positionedNodes: Node[] = [];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    levels.forEach((levelScenes, level) => {
        const calculatedX = level * (NODE_WIDTH + X_GAP);
        
        const autoPlacedScenes = levelScenes.filter(id => allScenesMap[id]?.mapY === undefined);
        const levelHeight = autoPlacedScenes.reduce((sum, id) => sum + (nodeData.get(id)?.height || 0) + Y_GAP, 0) - Y_GAP;
        let currentY = -levelHeight / 2;

        levelScenes.forEach((id) => {
            const scene = allScenesMap[id];
            if (!scene) return;
            const { height } = nodeData.get(id)!;

            const x = scene.mapX ?? calculatedX;
            const y = scene.mapY ?? currentY;

            positionedNodes.push({ ...scene, x, y, level: nodeLevels.get(id)!, height });

            if (scene.mapY === undefined) {
                currentY += height + Y_GAP;
            }

            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x + NODE_WIDTH);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y + height);
        });
    });

    const nodesWithForwardIncomingEdges = new Set<string>();
    const nodesWithBackwardIncomingEdges = new Set<string>();
    const choicesWithForwardOutgoingEdges = new Set<string>();
    const choicesWithBackwardOutgoingEdges = new Set<string>();

    createdEdges.forEach(edge => {
        const sourceLevel = nodeLevels.get(edge.source);
        const targetLevel = nodeLevels.get(edge.target);

        if (sourceLevel !== undefined && targetLevel !== undefined) {
            if (targetLevel < sourceLevel) {
                nodesWithBackwardIncomingEdges.add(edge.target);
                choicesWithBackwardOutgoingEdges.add(edge.sourceChoiceId);
            } else {
                nodesWithForwardIncomingEdges.add(edge.target);
                choicesWithForwardOutgoingEdges.add(edge.sourceChoiceId);
            }
        } else {
            nodesWithForwardIncomingEdges.add(edge.target);
            choicesWithForwardOutgoingEdges.add(edge.sourceChoiceId);
        }
    });

    return { 
        initialNodes: positionedNodes, 
        edges: createdEdges, 
        bounds: { minX: minX === Infinity ? 0 : minX, minY: minY === Infinity ? 0 : minY, maxX: maxX === -Infinity ? NODE_WIDTH : maxX, maxY: maxY === -Infinity ? NODE_HEADER_HEIGHT : maxY }, 
        nodeLevels, 
        nodesWithForwardIncomingEdges, 
        nodesWithBackwardIncomingEdges,
        choicesWithForwardOutgoingEdges,
        choicesWithBackwardOutgoingEdges
    };
  }, [allScenesMap, startSceneId]);
  
  const [nodes, setNodes] = useState(initialNodes);

  useEffect(() => {
    if (!dragInfo) {
      setNodes(initialNodes);
    }
  }, [initialNodes, dragInfo]);

  useEffect(() => {
    if (containerRef.current && initialNodes.length > 0) {
      const { width } = containerRef.current.getBoundingClientRect();
      setView(v => ({...v, x: (width - bounds.maxX) / 2 , y: Y_GAP * 2}));
    }
  }, []);

  const handleZoom = useCallback((direction: 'in' | 'out') => {
      if (!containerRef.current) return;
      const scaleFactor = 1.2;
      const newScale = direction === 'in' ? view.scale * scaleFactor : view.scale / scaleFactor;
      const clampedScale = Math.max(0.2, Math.min(2, newScale));

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const newX = centerX - (centerX - view.x) * (clampedScale / view.scale);
      const newY = centerY - (centerY - view.y) * (clampedScale / view.scale);

      setView({ x: newX, y: newY, scale: clampedScale });
  }, [view]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const { deltaY } = e;
    const direction = deltaY < 0 ? 'in' : 'out';
    handleZoom(direction);
  }, [handleZoom]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - view.x, y: e.clientY - view.y });
  }, [view.x, view.y]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragInfo) {
      const newX = (e.clientX - view.x) / view.scale - dragInfo.offsetX;
      const newY = (e.clientY - view.y) / view.scale - dragInfo.offsetY;
      setNodes(currentNodes =>
        currentNodes.map(n =>
          n.id === dragInfo.id ? { ...n, x: newX, y: newY } : n
        )
      );
      return;
    }

    if (isPanning) {
      setView(v => ({ ...v, x: e.clientX - panStart.x, y: e.clientY - panStart.y}));
    }
  }, [isPanning, panStart, dragInfo, view.x, view.y, view.scale]);

  const handleMouseUp = useCallback(() => {
    if (dragInfo) {
      const finalNode = nodes.find(n => n.id === dragInfo.id);
      if (finalNode) {
        onUpdateScenePosition(finalNode.id, finalNode.x, finalNode.y);
      }
      setDragInfo(null);
    }
    setIsPanning(false);
  }, [dragInfo, nodes, onUpdateScenePosition]);

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    dragStartPos.current = { x: e.clientX, y: e.clientY };

    const startX = (e.clientX - view.x) / view.scale;
    const startY = (e.clientY - view.y) / view.scale;
    setDragInfo({
      id: nodeId,
      offsetX: startX - node.x,
      offsetY: startY - node.y,
    });
  };

  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    const dist = Math.sqrt(
        Math.pow(e.clientX - dragStartPos.current.x, 2) +
        Math.pow(e.clientY - dragStartPos.current.y, 2)
    );
    if (dist < 5) {
        onSelectScene(nodeId);
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-brand-text">Mapa de Cenas</h2>
        <p className="text-brand-text-dim mt-1">
          Visualize e organize a estrutura do seu jogo. Arraste as cenas para reposicioná-las e clique para editá-las.
        </p>
      </div>
      <div 
        ref={containerRef}
        className={`w-full h-full bg-brand-bg rounded-lg border border-brand-border overflow-hidden ${isPanning || dragInfo ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{backgroundImage: 'radial-gradient(#4a5568 1px, transparent 1px)', backgroundSize: '20px 20px'}}
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
            className="transition-transform duration-100"
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
        >
          <svg className="absolute" width={bounds.maxX - bounds.minX + NODE_WIDTH + X_GAP} height={bounds.maxY - bounds.minY + Y_GAP * 4} style={{ transform: `translate(${bounds.minX}px, ${bounds.minY}px)`, zIndex: 0 }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#8B5CF6" />
              </marker>
            </defs>
            {edges.map((edge, i) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const linkingChoices = sourceNode.choices.filter(choice => choice.goToScene);
              const choiceIndex = linkingChoices.findIndex(choice => choice.id === edge.sourceChoiceId);
              if (choiceIndex === -1) return null;
              
              const y1_offset = NODE_HEADER_HEIGHT + (choiceIndex * (CHOICE_ITEM_HEIGHT + CHOICE_ITEM_MARGIN_Y)) + (CHOICE_ITEM_HEIGHT / 2);
              
              const sourceLevel = nodeLevels.get(edge.source);
              const targetLevel = nodeLevels.get(edge.target);
              const isBackwardConnection = sourceLevel !== undefined && targetLevel !== undefined && targetLevel < sourceLevel;

              let x1, y1, x2, y2, d;

              y1 = sourceNode.y + y1_offset - bounds.minY;
              y2 = targetNode.y + (NODE_HEADER_HEIGHT / 2) - bounds.minY;

              if (isBackwardConnection) {
                  x1 = sourceNode.x - bounds.minX;
                  x2 = targetNode.x + NODE_WIDTH + CONNECTOR_RADIUS - bounds.minX;
                  const controlOffset = Math.max(75, Math.abs(x1 - x2) * 0.3);
                  const cx1 = x1 - controlOffset;
                  const cx2 = x2 + controlOffset;
                  d = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
              } else {
                  x1 = sourceNode.x + NODE_WIDTH - bounds.minX;
                  x2 = targetNode.x - CONNECTOR_RADIUS - bounds.minX;
                  const controlOffset = Math.abs(x2 - x1) * 0.5;
                  const cx1 = x1 + controlOffset;
                  const cx2 = x2 - controlOffset;
                  d = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
              }

              return (
                <path
                  key={`${edge.source}-${edge.target}-${i}`}
                  d={d}
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrow)"
                />
              );
            })}
          </svg>
          
          {nodes.map(node => {
            const linkingChoices = node.choices.filter(choice => choice.goToScene && allScenesMap[choice.goToScene]);
            
            const borderColorClass = (() => {
                if (node.id === startSceneId) return 'border-yellow-400';
                if (node.isEndingScene) return 'border-brand-primary';
                if (node.removesChanceOnEntry) return 'border-red-500';
                if (node.restoresChanceOnEntry) return 'border-white';
                return 'border-brand-border';
            })();

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onClick={(e) => handleNodeClick(e, node.id)}
                className={`absolute bg-brand-surface rounded-xl shadow-lg flex flex-col transition-all duration-300 border-2 ${borderColorClass} cursor-pointer hover:border-yellow-400 hover:shadow-xl`}
                style={{ width: NODE_WIDTH, transform: `translate(${node.x}px, ${node.y}px)`, height: node.height, userSelect: 'none' }}
              >
                  <div className="p-3 relative flex-shrink-0 text-center" style={{height: NODE_HEADER_HEIGHT}}>
                      <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors ${nodesWithForwardIncomingEdges.has(node.id) ? 'bg-brand-primary' : 'bg-transparent border-2 border-slate-400'}`} />
                      <div className={`absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-4 h-4 rounded-full z-20 transition-colors ${nodesWithBackwardIncomingEdges.has(node.id) ? 'bg-brand-primary' : 'bg-transparent border-2 border-slate-400'}`} />
                      
                      <h3 className="font-bold text-brand-text truncate">{node.name}</h3>
                      <p className="text-xs text-brand-text-dim">(ID: {node.id})</p>
                      {node.id === startSceneId && <p className="text-xs font-bold text-yellow-400 mt-1">(Início)</p>}
                      {node.isEndingScene && <p className="text-xs font-bold text-brand-primary mt-1">(Fim de Jogo)</p>}
                  </div>
                  
                  {linkingChoices.length > 0 && (
                    <div className="flex flex-col gap-1 pb-2">
                        {linkingChoices.map(choice => {
                                return (
                                <div key={choice.id} className="relative bg-brand-primary/10 text-brand-primary-hover font-medium py-1 flex items-center rounded-md" style={{height: CHOICE_ITEM_HEIGHT}}>
                                    <div className={`absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-4 h-4 rounded-full z-10 transition-colors ${choicesWithBackwardOutgoingEdges.has(choice.id) ? 'bg-brand-primary' : 'bg-transparent border-2 border-slate-400'}`} />
                                    <span className="truncate px-4 text-center w-full text-sm" title={choice.text}>{choice.text}</span>
                                    <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-10 right-0 translate-x-1/2 transition-colors ${choicesWithForwardOutgoingEdges.has(choice.id) ? 'bg-brand-primary' : 'bg-transparent border-2 border-slate-400'}`} />
                                </div>
                                );
                          })
                        }
                    </div>
                  )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 z-10 bg-brand-surface/80 backdrop-blur-sm p-3 rounded-lg border border-brand-border text-xs text-brand-text-dim">
          <h4 className="font-bold text-sm text-brand-text mb-2">Legenda</h4>
          <ul className="space-y-1.5">
              <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm border-2 border-yellow-400"></div>
                  <span>Cena Inicial</span>
              </li>
              <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm border-2 border-brand-primary"></div>
                  <span>Fim de Jogo</span>
              </li>
              <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm border-2 border-red-500"></div>
                  <span>Remove Chance</span>
              </li>
              <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm border-2 border-white"></div>
                  <span>Restaura Chance</span>
              </li>
          </ul>
      </div>
      <div className="absolute bottom-4 right-4 z-10 flex items-end gap-2">
          <button 
              onClick={onAddScene} 
              className="flex items-center px-4 py-2 bg-brand-surface border border-brand-border text-brand-text font-semibold rounded-md hover:bg-brand-border/30 transition-colors"
              title="Adicionar uma nova cena"
          >
              <PlusIcon className="w-5 h-5 mr-2" />
              Adicionar Cena
          </button>
          <div className="flex flex-col gap-2">
            <button onClick={() => handleZoom('in')} className="w-10 h-10 flex items-center justify-center bg-brand-surface border border-brand-border rounded-md hover:bg-brand-border/50">
                <PlusIcon className="w-6 h-6" />
            </button>
            <button onClick={() => handleZoom('out')} className="w-10 h-10 flex items-center justify-center bg-brand-surface border border-brand-border rounded-md hover:bg-brand-border/50">
                <MinusIcon className="w-6 h-6" />
            </button>
          </div>
      </div>
    </div>
  );
};


const MinusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
);

export default SceneMap;
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Position,
  Connection,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import type { AutomationRule, WalletAccount, IncomeSource, AutomationMilestone, AutomationTemplate, TemplateNode, TemplateEdge, TemplateParameter, AutomationBoard, AutomationAction, AutoInvestRule } from '../types';
import AutomationEditorPanel from './AutomationEditorPanel';
import GoalNode from './GoalNode';
import SourceNode from './SourceNode';
import MilestoneNode from './MilestoneNode';
import ActionNode from './ActionNode';
import AutoInvestNode from './AutoInvestNode';
import { PlusCircleIcon, ZapIcon, ExportIcon, ClipboardIcon, ChevronDownIcon, TrashIcon, ClockIcon, PowerIcon } from './icons';
import { addDays, addWeeks, addMonths, formatDistanceToNow } from 'date-fns';

interface AutomationWorkflowPageProps {
  rules: AutomationRule[];
  incomeSources: IncomeSource[];
  automationMilestones: AutomationMilestone[];
  automationActions: AutomationAction[];
  autoInvestRules: AutoInvestRule[];
  onAddGoal: () => void;
  onAddSource: () => void;
  onEditSource: (source: IncomeSource) => void;
  onSaveRule: (rule: AutomationRule) => void;
  onOpenTemplateLibrary: () => void;
  onDeleteRule: (ruleId: string) => void;
  onRuleConnect: (connection: Connection) => void;
  onRunTimeTriggers: () => void;
  onAddMilestone: () => void;
  onSaveMilestone: (milestone: AutomationMilestone) => void;
  onDeleteMilestone: (milestoneId: string) => void;
  onSaveAsTemplate: (template: Omit<AutomationTemplate, 'id' | 'category'> & { category: string }) => void;
  onAddAutomationAction: (type: 'deposit_to_brokerage' | 'activate_ai_trader') => void;
  onSaveAutomationAction: (action: AutomationAction) => void;
  onDeleteAutomationAction: (actionId: string) => void;
  onAddAutoInvestRule: () => void;
  onSaveAutoInvestRule: (rule: AutoInvestRule) => void;
  onDeleteAutoInvestRule: (ruleId: string) => void;
  accounts: WalletAccount[];
  // New Props for Board Management
  boards: AutomationBoard[];
  activeBoardId: string;
  onAddBoard: () => void;
  onSwitchBoard: (boardId: string) => void;
  onRenameBoard: (boardId: string, newName: string) => void;
  onDeleteBoard: (boardId: string) => void;
  onToggleBoardStatus: (boardId: string) => void;
  // New props for AI Assist
  aiActionState: { isLoading: boolean, targetNodeId: string | null };
  onRequestOptimalMilestones: (ruleId: string) => void;
  onCreateNextGoal: (ruleId: string) => void;
  onOpenAiAssistant: () => void;
}

const nodeTypes = { goalNode: GoalNode, sourceNode: SourceNode, milestoneNode: MilestoneNode, actionNode: ActionNode, autoInvestNode: AutoInvestNode };

const AutomationWorkflowPage: React.FC<AutomationWorkflowPageProps> = ({ 
    rules, incomeSources, automationMilestones, automationActions, autoInvestRules, onSaveRule, onOpenTemplateLibrary, onAddGoal, onAddSource, onEditSource, onDeleteRule, 
    onRuleConnect, onRunTimeTriggers, accounts, onAddMilestone, onSaveMilestone, onDeleteMilestone, onSaveAsTemplate,
    onAddAutomationAction, onSaveAutomationAction, onDeleteAutomationAction,
    onAddAutoInvestRule, onSaveAutoInvestRule, onDeleteAutoInvestRule,
    boards, activeBoardId, onAddBoard, onSwitchBoard, onRenameBoard, onDeleteBoard, onToggleBoardStatus,
    aiActionState, onRequestOptimalMilestones, onCreateNextGoal, onOpenAiAssistant
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const activeBoard = boards.find(b => b.id === activeBoardId);
  const boardMenuRef = useRef<HTMLDivElement>(null);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  // --- Board Menu Inline Form State ---
  const [isRenaming, setIsRenaming] = useState(false);
  const [boardNameInput, setBoardNameInput] = useState('');


  // Click outside handler for board menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boardMenuRef.current && !boardMenuRef.current.contains(event.target as Node)) {
        setIsBoardMenuOpen(false);
        resetFormState(); // Also reset form state
      }
    };

    if (isBoardMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBoardMenuOpen]);

  // Click outside handler for actions menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setIsActionsMenuOpen(false);
      }
    };

    if (isActionsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActionsMenuOpen]);

  useMemo(() => {
    const newNodes: Node[] = [];
    
    incomeSources.forEach((source, index) => {
        const account = accounts.find(a => a.id === source.accountId);
        newNodes.push({
            id: source.id,
            type: 'sourceNode',
            data: { source, account },
            position: { x: 150 + index * 350, y: 50 },
            sourcePosition: Position.Bottom,
        })
    });

    automationActions.forEach((action, index) => {
        newNodes.push({
            id: action.id,
            type: 'actionNode',
            data: { action },
            position: { x: 200 + index * 350, y: 900 + (index % 2) * 150 },
        });
    });

    const calculateTimeToMilestone = (
        percentage: number,
        rule: AutomationRule,
        account: WalletAccount | undefined
    ): string | null => {
        if (!account) return null;

        const amountForMilestone = rule.goal * (percentage / 100);
        const amountNeeded = Math.max(0, amountForMilestone - account.balance);

        if (amountNeeded <= 0) return 'Achieved';

        const getMonthlyAmount = (source: IncomeSource): number => {
            const amount = source.expectedAmount || 0;
            if (amount <= 0) return 0;
            switch (source.depositFrequency) {
                case 'daily': return amount * 30.44;
                case 'weekly': return amount * 4.33;
                case 'bi-weekly': return amount * 2.167;
                case 'monthly': return amount;
                default: return 0;
            }
        };
        
        const directIncomeSources = rule.sourceTriggers
            .map(id => incomeSources.find(s => s.id === id))
            .filter((s): s is IncomeSource => !!s);
        
        if (directIncomeSources.length === 0) {
            // TODO: Could implement recursive calculation for chained goals later
            return null;
        }

        const totalMonthlyContribution = directIncomeSources.reduce((total, source) => {
            return total + (getMonthlyAmount(source) * (rule.percentage / 100));
        }, 0);

        if (totalMonthlyContribution <= 0) return null;

        const monthsNeeded = amountNeeded / totalMonthlyContribution;
        const completionDate = addMonths(new Date(), monthsNeeded);

        return formatDistanceToNow(completionDate, { addSuffix: true });
    };


    rules.forEach((rule, index) => {
      const account = accounts.find(a => a.id === rule.destinationAccountId);
      const timeToGoal = calculateTimeToMilestone(100, rule, account);
      
      const augmentedMilestones = rule.milestones?.map(m => ({
          ...m,
          timeEstimate: calculateTimeToMilestone(m.percentage, rule, account),
      }));

      newNodes.push({
        id: rule.id,
        type: 'goalNode',
        position: { x: index * 350, y: 300 + (index % 3) * 280 },
        data: { 
            rule, 
            account, 
            timeToGoal, 
            milestones: augmentedMilestones,
            isAiLoading: aiActionState.isLoading && aiActionState.targetNodeId === rule.id,
            onRequestOptimalMilestones,
            onCreateNextGoal,
            onOpenAiAssistant
        },
      });
    });

    automationMilestones.forEach((milestone, index) => {
        const sourceGoalName = rules.find(r => r.id === milestone.sourceGoalId)?.name || '...';
        
        let timeEstimate: string | null = null;
        const sourceRuleForMilestone = rules.find(r => r.id === milestone.sourceGoalId);
        if (sourceRuleForMilestone) {
            const accountForMilestone = accounts.find(a => a.id === sourceRuleForMilestone.destinationAccountId);
            timeEstimate = calculateTimeToMilestone(
                milestone.triggerPercentage,
                sourceRuleForMilestone,
                accountForMilestone
            );
        }

        newNodes.push({
            id: milestone.id,
            type: 'milestoneNode',
            position: { x: 150 + index * 350, y: 600 + (index % 2) * 200 },
            data: { milestone, sourceGoalName, timeEstimate },
        });
    });
    
    autoInvestRules.forEach((rule, index) => {
        const sourceGoalName = rules.find(r => r.id === rule.sourceGoalId)?.name || '...';
        newNodes.push({
            id: rule.id,
            type: 'autoInvestNode',
            position: { x: 100 + index * 350, y: 1200 + (index % 2) * 150 },
            data: { rule, sourceGoalName },
        });
    });

    const newEdges: Edge[] = [];
    const allNodesWithTriggers = [...rules, ...automationActions];

    allNodesWithTriggers.forEach(node => {
      (node.sourceTriggers || []).forEach(sourceId => {
        if (newNodes.some(n => n.id === sourceId)) {
          newEdges.push({
            id: `e-${sourceId}-${node.id}`,
            source: sourceId,
            target: node.id,
            animated: ('status' in node && node.status === 'active') || !('status' in node),
            style: { strokeWidth: 2 }
          });
        }
      });
    });
      
    automationMilestones.forEach(m => {
        if (m.sourceGoalId && newNodes.some(n => n.id === m.sourceGoalId)) {
            newEdges.push({
                id: `e-watch-${m.sourceGoalId}-${m.id}`,
                source: m.sourceGoalId,
                target: m.id,
                type: 'smoothstep',
                animated: false,
                style: { stroke: '#94a3b8', strokeDasharray: '5 5' }
            });
        }
    });

    autoInvestRules.forEach(r => {
        if (r.sourceGoalId && newNodes.some(n => n.id === r.sourceGoalId)) {
             newEdges.push({
                id: `e-invest-watch-${r.sourceGoalId}-${r.id}`,
                source: r.sourceGoalId,
                target: r.id,
                type: 'smoothstep',
                animated: false,
                style: { stroke: '#06b6d4', strokeDasharray: '5 5' }
            });
        }
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  }, [rules, accounts, incomeSources, automationMilestones, automationActions, autoInvestRules, aiActionState, onRequestOptimalMilestones, onCreateNextGoal, onOpenAiAssistant]);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const onConnect = useCallback((params: Connection) => {
    onRuleConnect(params);
  }, [onRuleConnect]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  };
  
  const onPaneClick = () => {
    setSelectedNodeId(null);
  }

    // --- Board Menu Handlers ---
    const resetFormState = () => {
        setIsRenaming(false);
        setBoardNameInput('');
    };

    const startRename = () => {
        if (activeBoard) {
            setIsRenaming(true);
            setBoardNameInput(activeBoard.name);
        }
    };

    const handlePerformRename = () => {
        if (boardNameInput.trim() && activeBoard) {
            onRenameBoard(activeBoard.id, boardNameInput.trim());
        }
        resetFormState();
        setIsBoardMenuOpen(false);
    };

    const handleDelete = () => {
      if(activeBoard) {
          onDeleteBoard(activeBoard.id);
      }
      setIsBoardMenuOpen(false);
  }

  const handleSaveFlowAsTemplate = () => {
    const name = prompt("Enter a name for your template:");
    if (!name) return;
    const description = prompt("Enter a description for your template:");
    if (!description) return;
    const category = prompt("Enter a category (e.g., Savings, Debt):", "Personal");
    if (!category) return;

    const templateNodes: TemplateNode[] = [];
    const templateEdges: TemplateEdge[] = [];
    const templateParameters: TemplateParameter[] = [];
    const idMap = new Map<string, string>(); // Maps real ID to template-local ID
    let nodeCounter = 1;

    // Convert sources to template nodes
    incomeSources.forEach(source => {
        const localId = `source-${nodeCounter++}`;
        idMap.set(source.id, localId);
        templateNodes.push({
            id: localId,
            type: 'source',
            data: { ...source, accountId: `{{${source.name.toUpperCase().replace(/\s/g, '_')}_ACCOUNT_ID}}` },
            position: { x: 0, y: 0 } // Position will be recalculated on deploy
        });
        templateParameters.push({
            id: `${source.name.toUpperCase().replace(/\s/g, '_')}_ACCOUNT_ID`,
            displayName: `${source.name} Account`,
            type: 'accountSelector',
            prompt: `Select the account for your '${source.name}' income source.`
        });
    });

    // Convert rules to template nodes
    rules.forEach(rule => {
        const localId = `goal-${nodeCounter++}`;
        idMap.set(rule.id, localId);
        templateNodes.push({
            id: localId,
            type: 'goal',
            data: { ...rule,
              sourceTriggers: [], // Edges will define this
              destinationAccountId: `{{${rule.name.toUpperCase().replace(/\s/g, '_')}_ACCOUNT_ID}}`,
              goal: `{{${rule.name.toUpperCase().replace(/\s/g, '_')}_GOAL_AMOUNT}}`
            },
            position: { x: 0, y: 0 }
        });
        templateParameters.push({
            id: `${rule.name.toUpperCase().replace(/\s/g, '_')}_ACCOUNT_ID`,
            displayName: `${rule.name} Destination`,
            type: 'accountSelector',
            prompt: `Select the destination account for your '${rule.name}' goal.`
        });
        templateParameters.push({
            id: `${rule.name.toUpperCase().replace(/\s/g, '_')}_GOAL_AMOUNT`,
            displayName: `${rule.name} Goal Amount`,
            type: 'amountInput',
            defaultValue: rule.goal,
            prompt: `What is the total goal amount for '${rule.name}'?`
        });
    });
    
    // Create edges
    rules.forEach(rule => {
      rule.sourceTriggers.forEach(sourceId => {
        const localRuleId = idMap.get(rule.id);
        const localSourceId = idMap.get(sourceId);
        if (localRuleId && localSourceId) {
          templateEdges.push({
            id: `e-${localSourceId}-${localRuleId}`,
            source: localSourceId,
            target: localRuleId
          });
        }
      });
    });

    onSaveAsTemplate({
        name,
        description,
        category,
        iconName: 'WorkflowIcon',
        parameters: templateParameters,
        nodes: templateNodes,
        edges: templateEdges,
        categoriesToCreate: [] // For this basic save, we don't create new budget categories
    });

    alert(`Template "${name}" saved successfully!`);
  };


  return (
    <div className="h-full flex bg-gray-50 rounded-2xl overflow-hidden">
      <div className="flex-1 flex flex-col">
        <header className="absolute top-8 left-8 z-10 bg-white/50 backdrop-blur-sm p-4 rounded-lg flex items-center space-x-4">
            <div className="relative" ref={boardMenuRef}>
                <div 
                    className="flex items-center space-x-3 cursor-pointer group"
                    onClick={() => setIsBoardMenuOpen(p => !p)}
                >
                    <ClipboardIcon className="w-10 h-10 text-purple-700" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{activeBoard?.name || '...'}</h1>
                        <p className="text-sm text-gray-500 group-hover:text-purple-600">Click to manage boards</p>
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isBoardMenuOpen ? 'rotate-180' : ''}`} />
                </div>
                {isBoardMenuOpen && (
                    <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-xl border z-20 p-2">
                        {isRenaming ? (
                             <form onSubmit={(e) => { e.preventDefault(); handlePerformRename(); }}>
                                <input
                                    type="text"
                                    value={boardNameInput}
                                    onChange={(e) => setBoardNameInput(e.target.value)}
                                    autoFocus
                                    className="w-full text-sm p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button type="button" onClick={resetFormState} className="text-xs font-semibold p-1 rounded-md hover:bg-gray-100">Cancel</button>
                                    <button type="submit" className="text-xs font-semibold px-2 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700">Save</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <p className="text-xs font-semibold text-gray-400 uppercase px-2 pt-1 pb-2">Switch Board</p>
                                {boards.map(board => (
                                    <button key={board.id} onClick={() => { onSwitchBoard(board.id); setIsBoardMenuOpen(false); }} className={`w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 ${board.id === activeBoardId ? 'text-purple-600' : 'text-gray-700'}`}>
                                        {board.name}
                                    </button>
                                ))}
                                <div className="border-t my-2"></div>
                                <button onClick={startRename} className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700">Rename Current Board</button>
                                <button onClick={() => { onAddBoard(); setIsBoardMenuOpen(false); }} className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700">Create New Board</button>
                                <button onClick={handleDelete} className="w-full text-left font-semibold p-2 rounded-md hover:bg-red-50 text-red-600 flex items-center space-x-2">
                                    <TrashIcon className="w-4 h-4" />
                                    <span>Delete Current Board</span>
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            
             {activeBoard && (
                <button
                    onClick={() => onToggleBoardStatus(activeBoard.id)}
                    title={activeBoard.status === 'active' ? 'Deactivate Board' : 'Activate Board'}
                    className={`p-2 rounded-full transition-colors ${
                        activeBoard.status === 'active' ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-500 hover:bg-red-200'
                    }`}
                >
                    <PowerIcon className="w-6 h-6" />
                </button>
            )}

            <div className="relative" ref={actionsMenuRef}>
                <button
                    onClick={() => setIsActionsMenuOpen(p => !p)}
                    className="flex items-center space-x-2 bg-white text-gray-700 font-bold py-2 px-4 rounded-xl border-2 border-gray-200 hover:bg-gray-100 transition-all duration-300"
                >
                    <ZapIcon className="w-5 h-5 text-gray-600" />
                    <span>Actions</span>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isActionsMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isActionsMenuOpen && (
                    <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-xl border z-20 p-2">
                        <button onClick={() => { onAddGoal(); setIsActionsMenuOpen(false); }} className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700 flex items-center space-x-2">
                            <PlusCircleIcon className="w-5 h-5 text-purple-600" />
                            <span>Add Goal</span>
                        </button>
                        <button onClick={() => { onAddSource(); setIsActionsMenuOpen(false); }} className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700 flex items-center space-x-2">
                            <PlusCircleIcon className="w-5 h-5 text-purple-600" />
                            <span>Add Source</span>
                        </button>
                        <button onClick={() => { onAddMilestone(); setIsActionsMenuOpen(false); }} className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700 flex items-center space-x-2">
                            <PlusCircleIcon className="w-5 h-5 text-blue-600" />
                            <span>Add Milestone</span>
                        </button>
                         <div className="border-t my-2"></div>
                        <button onClick={() => { onAddAutomationAction('deposit_to_brokerage'); setIsActionsMenuOpen(false); }} className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700 flex items-center space-x-2">
                            <PlusCircleIcon className="w-5 h-5 text-green-600" />
                            <span>Add Brokerage Deposit</span>
                        </button>
                        <button onClick={() => { onAddAutomationAction('activate_ai_trader'); setIsActionsMenuOpen(false); }} className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700 flex items-center space-x-2">
                            <PlusCircleIcon className="w-5 h-5 text-green-600" />
                            <span>Add AI Trader Action</span>
                        </button>
                        <button onClick={() => { onAddAutoInvestRule(); setIsActionsMenuOpen(false); }} className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700 flex items-center space-x-2">
                            <PlusCircleIcon className="w-5 h-5 text-cyan-600" />
                            <span>Add Auto-Invest Rule</span>
                        </button>
                        <div className="border-t my-2"></div>
                        <button onClick={() => { onOpenTemplateLibrary(); setIsActionsMenuOpen(false); }} className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700 flex items-center space-x-2">
                            <ClipboardIcon className="w-5 h-5" />
                            <span>Add From Template</span>
                        </button>
                        <button onClick={() => { handleSaveFlowAsTemplate(); setIsActionsMenuOpen(false); }} className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700 flex items-center space-x-2">
                            <ExportIcon className="w-5 h-5 text-green-600" />
                            <span>Save Flow as Template</span>
                        </button>
                    </div>
                )}
            </div>
        </header>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      <AutomationEditorPanel
        selectedNodeId={selectedNodeId}
        incomeSources={incomeSources}
        rules={rules}
        automationMilestones={automationMilestones}
        automationActions={automationActions}
        autoInvestRules={autoInvestRules}
        onSaveRule={onSaveRule}
        onSaveAutomationAction={onSaveAutomationAction}
        onSaveAutoInvestRule={onSaveAutoInvestRule}
        onEditSource={onEditSource}
        onClose={() => setSelectedNodeId(null)}
        onAddChainedGoal={onOpenTemplateLibrary}
        onDeleteRule={onDeleteRule}
        onDeleteAutomationAction={onDeleteAutomationAction}
        onDeleteAutoInvestRule={onDeleteAutoInvestRule}
        onSaveMilestone={onSaveMilestone}
        onDeleteMilestone={onDeleteMilestone}
        accounts={accounts}
      />
    </div>
  );
};

export default AutomationWorkflowPage;
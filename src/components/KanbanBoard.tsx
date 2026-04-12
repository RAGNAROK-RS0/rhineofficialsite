import { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Clock, Flag } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  column: string;
  assignee?: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
}

const columns: Column[] = [
  { id: 'todo', title: 'To Do', color: '#6b7280' },
  { id: 'inprogress', title: 'In Progress', color: '#0082D8' },
  { id: 'review', title: 'Review', color: '#f59e0b' },
  { id: 'done', title: 'Done', color: '#10b981' },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem('kanban_tasks');
    return stored ? JSON.parse(stored) : [
      { id: '1', title: 'Design new landing page', description: 'Create mockups for the new homepage', priority: 'high', column: 'todo' },
      { id: '2', title: 'Fix authentication bug', description: 'Users cannot login with OAuth', priority: 'high', column: 'inprogress' },
      { id: '3', title: 'Update documentation', description: 'Add API reference docs', priority: 'low', column: 'done' },
    ];
  });
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeColumn, setActiveColumn] = useState('todo');

  useEffect(() => {
    localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (columnId: string) => {
    if (!newTaskTitle.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: '',
      priority: 'medium',
      column: columnId,
    };
    setTasks([...tasks, task]);
    setNewTaskTitle('');
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-4 min-w-max p-4">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.column === col.id);
          return (
            <div key={col.id} className="w-72 flex-shrink-0">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color }}></div>
                  <h3 className="text-white font-medium">{col.title}</h3>
                  <span className="text-white/40 text-sm">({colTasks.length})</span>
                </div>
                <button className="text-white/40 hover:text-white">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-white/20 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white text-sm font-medium">{task.title}</h4>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white/60 transition-opacity"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    {task.description && (
                      <p className="text-white/50 text-xs mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.assignee && (
                        <div className="w-6 h-6 rounded-full bg-[#0082D8]/20 flex items-center justify-center text-xs text-[#0082D8]">
                          {task.assignee[0]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="px-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={activeColumn === col.id ? newTaskTitle : ''}
                      onChange={(e) => { setNewTaskTitle(e.target.value); setActiveColumn(col.id); }}
                      onKeyDown={(e) => e.key === 'Enter' && addTask(col.id)}
                      placeholder="Add task..."
                      className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                    />
                    <button
                      onClick={() => addTask(col.id)}
                      className="p-1 rounded hover:bg-white/10"
                    >
                      <Plus className="w-4 h-4 text-white/40" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
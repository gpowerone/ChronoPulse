'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee_id: ''
  });
  const projectId = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('projectsid');
  const statuses = ['todo', 'in_progress', 'in_review', 'done'];
  const statusLabels = {
    todo: 'project-todo',
    in_progress: 'project-in-progress',
    in_review: 'project-in-review',
    done: 'project-done'
  };
  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projectsget?id=${projectId}`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setProject(data.data);
      }
    } catch (err) {
      console.error('Error fetching project:', err);
    }
  };
  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/taskslist?project_id=${projectId}`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };
  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/projectmemberslist?project_id=${projectId}`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setMembers(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };
  const fetchComments = async taskId => {
    try {
      const response = await fetch(`/api/taskcommentslist?task_id=${taskId}`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };
  useEffect(() => {
    if (projectId) {
      Promise.all([fetchProject(), fetchTasks(), fetchMembers()]).then(() => setIsLoading(false));
    }
  }, [projectId]);
  const handleTaskClick = async task => {
    setSelectedTask(task);
    await fetchComments(task.id);
  };
  const handleCreateTask = async () => {
    if (!taskFormData.title.trim()) return;
    try {
      const response = await fetch('/api/taskscreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project_id: projectId,
          ...taskFormData
        })
      });
      if (response.ok) {
        setShowTaskForm(false);
        setTaskFormData({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          assignee_id: ''
        });
        fetchTasks();
        fetchProject();
      }
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch('/api/tasksupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: taskId,
          status: newStatus
        })
      });
      if (response.ok) {
        fetchTasks();
        fetchProject();
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };
  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedTask) return;
    try {
      const response = await fetch('/api/taskcommentscreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task_id: selectedTask.id,
          content: newComment
        })
      });
      if (response.ok) {
        setNewComment('');
        fetchComments(selectedTask.id);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };
  const getPriorityColor = p => ({
    low: 'border-gray-300',
    medium: 'border-blue-400',
    high: 'border-orange-400',
    urgent: 'border-red-500'
  })[p] || 'border-gray-300';
  if (isLoading) {
    return <div className='p-2 sm:p-3 md:p-4 lg:p-6 flex justify-center items-center min-h-[400px]'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600' /></div>;
  }
  if (!project) {
    return <div className='p-2 sm:p-3 md:p-4 lg:p-6 text-center'>Project not found</div>;
  }
  const TaskCard = ({
    task
  }) => <div className={`bg-white rounded-lg border-l-4 ${getPriorityColor(task.priority)} shadow-sm p-3 cursor-pointer hover:shadow-md transition`} onClick={() => handleTaskClick(task)}><h4 className='font-medium text-sm text-gray-900 mb-2'>{task.title}</h4><div className='flex items-center justify-between'>{task.assignee && <div className='flex items-center gap-1'><div className='w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700'>{task.assignee.name?.charAt(0) || '?'}</div></div>}<div className='flex items-center gap-2 text-xs text-gray-500'>{task.comment_count > 0 && <span>{`💬 ${task.comment_count}`}</span>}{task.due_date && <span>{`📅 ${task.due_date}`}</span>}</div></div></div>;
  const TaskModal = () => {
    if (!selectedTask) return null;
    return <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'><div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'><div className='p-2 sm:p-3 md:p-4 lg:p-6 border-b flex justify-between items-start'><div><h2 className='text-xl font-bold text-gray-900'>{selectedTask.title}</h2><div className='flex gap-2 mt-2'><span className={`px-2 py-1 rounded text-xs ${selectedTask.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{selectedTask.status}</span><span className='px-2 py-1 rounded text-xs bg-gray-100 text-gray-800'>{selectedTask.priority}</span></div></div><button onClick={() => setSelectedTask(null)} className='p-2 !bg-transparent border border-current rounded-lg text-2xl'>×</button></div><div className='p-2 sm:p-3 md:p-4 lg:p-6'>{selectedTask.description && <p className='text-gray-600 mb-4'>{selectedTask.description}</p>}<div className='grid grid-cols-2 gap-4 mb-6'><div><label className='text-sm text-gray-500'>Status</label><select value={selectedTask.status} onChange={e => {
                handleUpdateTaskStatus(selectedTask.id, e.target.value);
                setSelectedTask({
                  ...selectedTask,
                  status: e.target.value
                });
              }} className='w-full mt-1 px-3 py-2 border rounded-lg'>{statuses.map(s => <option key={s} value={s}>{window.processText(statusLabels[s])}</option>)}</select></div>{selectedTask.assignee && <div><label className='text-sm text-gray-500'>Assignee</label><p className='mt-1 font-medium text-gray-900'>{selectedTask.assignee.name}</p></div>}</div><div className='border-t pt-4'><h3 className='font-semibold text-gray-900 mb-3'>Comments</h3><div className='space-y-3 mb-4 max-h-60 overflow-y-auto'>{comments.map(c => <div key={c.id} className='bg-gray-50 rounded-lg p-3'><div className='flex items-center gap-2 mb-1'><div className='w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs'>{c.author?.name?.charAt(0) || '?'}</div><span className='font-medium text-sm text-gray-900'>{c.author?.name}</span><span className='text-xs text-gray-500'>{new Date(c.created_at).toLocaleString()}</span></div><p className='text-sm text-gray-700'>{c.content}</p></div>)}</div><div className='flex gap-2'><input type='text' value={newComment} onChange={e => setNewComment(e.target.value)} placeholder='Add a comment...' className='flex-1 px-3 py-2 border rounded-lg' onKeyPress={e => e.key === 'Enter' && handleAddComment()} /><button onClick={handleAddComment} className='px-4 py-2 rounded-lg'>Send</button></div></div></div></div></div>;
  };
  const TaskForm = () => {
    if (!showTaskForm) return null;
    return <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'><div className='bg-white rounded-xl max-w-lg w-full'><div><div className='p-2 sm:p-3 md:p-4 lg:p-6 border-b'><h2 className='text-xl font-bold text-gray-900'>Add Task</h2></div><div className='p-2 sm:p-3 md:p-4 lg:p-6 space-y-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Task Title</label><input type='text' value={taskFormData.title} onChange={e => setTaskFormData({
                ...taskFormData,
                title: e.target.value
              })} className='w-full px-3 py-2 border rounded-lg' required={true} /></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Description</label><textarea value={taskFormData.description} onChange={e => setTaskFormData({
                ...taskFormData,
                description: e.target.value
              })} className='w-full px-3 py-2 border rounded-lg' rows={3} /></div><div className='grid grid-cols-2 gap-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Priority</label><select value={taskFormData.priority} onChange={e => setTaskFormData({
                  ...taskFormData,
                  priority: e.target.value
                })} className='w-full px-3 py-2 border rounded-lg'><option value='low'>Low</option><option value='medium'>Medium</option><option value='high'>High</option><option value='urgent'>Urgent</option></select></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Assignee</label><select value={taskFormData.assignee_id} onChange={e => setTaskFormData({
                  ...taskFormData,
                  assignee_id: e.target.value
                })} className='w-full px-3 py-2 border rounded-lg'><option value=''>Unassigned</option>{members.map(m => <option key={m.employee_id} value={m.employee_id}>{m.employee?.name}</option>)}</select></div></div></div><div className='p-2 sm:p-3 md:p-4 lg:p-6 border-t flex justify-end gap-3'><button type='button' onClick={() => setShowTaskForm(false)} className='px-4 py-2 !bg-transparent border border-current rounded-lg'>Cancel</button><button type='button' onClick={handleCreateTask} className='px-4 py-2 rounded-lg'>Create Task</button></div></div></div></div>;
  };
  return <div className='project-detail p-2 sm:p-3 md:p-4 lg:p-6'>{TaskModal()}{TaskForm()}<div className='mb-6'><button onClick={() => router.push('/my_projects')} className='px-3 py-1.5 rounded-lg text-sm mb-4 inline-block'>← Back to Projects</button><div className='flex items-center gap-4 mb-2'><div className='w-4 h-4 rounded' style={{
          backgroundColor: project.color
        }} /><h1 className='text-2xl font-bold'>{project.name}</h1></div>{project.description && <p className='mt-2'>{project.description}</p>}<div className='flex items-center gap-4 mt-4'><div className='flex-1 max-w-xs'><div className='flex justify-between text-sm text-gray-600 mb-1'><span>Progress</span><span>{`${project.progress || 0}%`}</span></div><div className='w-full bg-gray-200 rounded-full h-2'><div className='bg-blue-600 h-2 rounded-full' style={{
              width: `${project.progress || 0}%`
            }} /></div></div><span className='text-sm text-gray-500'>{`${project.completed_task_count || 0}/${project.task_count || 0} tasks`}</span></div></div><div className='flex justify-between items-center mb-4'><h2 className='text-lg font-semibold'>Tasks</h2><button onClick={() => setShowTaskForm(true)} className='px-3 py-1 rounded-lg text-sm'>+ Add Task</button></div><div className='grid grid-cols-1 md:grid-cols-4 gap-4'>{statuses.map(status => <div key={status} className='bg-gray-100 rounded-xl p-4 min-h-[300px]'><h3 className='font-semibold mb-3 text-sm uppercase tracking-wide text-gray-700'>{window.processText(statusLabels[status])}<span className='ml-2 bg-gray-300 text-gray-700 rounded-full px-2 py-0.5 text-xs'>{tasks.filter(t => t.status === status).length}</span></h3><div className='space-y-2'>{tasks.filter(t => t.status === status).map(task => <TaskCard key={task.id} task={task} />)}</div></div>)}</div>{members.length > 0 && <div className='mt-8'><h2 className='text-lg font-semibold mb-4'>Team Members</h2><div className='flex flex-wrap gap-3'>{members.map(m => <div key={m.id} className='flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2'><div className='w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm'>{m.employee?.name?.charAt(0) || '?'}</div><div><p className='text-sm font-medium text-gray-900'>{m.employee?.name}</p><p className='text-xs text-gray-500'>{m.role}</p></div></div>)}</div></div>}</div>;
}
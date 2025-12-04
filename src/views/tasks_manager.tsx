'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetail, setTaskDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [movingTask, setMovingTask] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTask, setEditTask] = useState({});
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    status: 'todo'
  });
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const projectId = urlParams.get('projectsid') || '';
  const statuses = [{
    id: 'todo',
    label: 'To Do',
    color: 'bg-gray-500'
  }, {
    id: 'in_progress',
    label: 'In Progress',
    color: 'bg-blue-500'
  }, {
    id: 'in_review',
    label: 'In Review',
    color: 'bg-purple-500'
  }, {
    id: 'done',
    label: 'Done',
    color: 'bg-green-500'
  }];
  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('project_id', projectId);
      if (searchTerm) params.append('search', searchTerm);
      if (filterPriority) params.append('priority', filterPriority);
      if (filterAssignee) params.append('assignee_id', filterAssignee);
      const response = await fetch('/api/taskslist?' + params.toString());
      if (response.status === 401) {
        setError('Unauthorized access');
        setLoading(false);
        return;
      }
      const result = await response.json();
      setTasks(result.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load tasks');
      setLoading(false);
    }
  }, [projectId, searchTerm, filterPriority, filterAssignee]);
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  const fetchTaskDetail = async taskId => {
    try {
      const response = await fetch('/api/tasksget?id=' + taskId);
      if (response.status === 401) {
        setError('Unauthorized');
        return;
      }
      const result = await response.json();
      setTaskDetail(result.data);
      setEditTask(result.data || {});
      const commentsResponse = await fetch('/api/taskcommentslist?task_id=' + taskId);
      if (commentsResponse.ok) {
        const commentsResult = await commentsResponse.json();
        setComments(commentsResult.data || []);
      }
    } catch (err) {
      setError('Failed to fetch task details');
    }
  };
  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !projectId) return;
    try {
      const body = {
        project_id: projectId,
        title: newTask.title,
        description: newTask.description || undefined,
        priority: newTask.priority,
        status: newTask.status
      };
      if (newTask.due_date) body.due_date = newTask.due_date;
      const response = await fetch('/api/taskscreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (response.status === 401) {
        setError('Unauthorized');
        return;
      }
      if (response.ok) {
        setShowCreateModal(false);
        setNewTask({
          title: '',
          description: '',
          priority: 'medium',
          due_date: '',
          status: 'todo'
        });
        fetchTasks();
      }
    } catch (err) {
      setError('Failed to create task');
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
      if (response.status === 401) {
        setError('Unauthorized');
        return;
      }
      if (response.ok) {
        setTasks(tasks.map(function (t) {
          return t.id === taskId ? Object.assign({}, t, {
            status: newStatus
          }) : t;
        }));
        setMovingTask(null);
      }
    } catch (err) {
      setError('Failed to update task');
    }
  };
  const handleUpdateTask = async () => {
    try {
      const response = await fetch('/api/tasksupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: editTask.id,
          title: editTask.title,
          description: editTask.description,
          priority: editTask.priority,
          status: editTask.status,
          due_date: editTask.due_date
        })
      });
      if (response.status === 401) {
        setError('Unauthorized');
        return;
      }
      if (response.ok) {
        setEditMode(false);
        fetchTasks();
        fetchTaskDetail(editTask.id);
      }
    } catch (err) {
      setError('Failed to update task');
    }
  };
  const handleDeleteTask = async taskId => {
    try {
      const response = await fetch('/api/tasksdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: taskId
        })
      });
      if (response.status === 401) {
        setError('Unauthorized');
        return;
      }
      if (response.ok) {
        setTasks(tasks.filter(function (t) {
          return t.id !== taskId;
        }));
        setShowDetailModal(false);
        setTaskDetail(null);
      }
    } catch (err) {
      setError('Failed to delete task');
    }
  };
  const handleAddComment = async () => {
    if (!newComment.trim() || !taskDetail) return;
    try {
      const response = await fetch('/api/taskcommentscreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task_id: taskDetail.id,
          content: newComment
        })
      });
      if (response.status === 401) {
        setError('Unauthorized');
        return;
      }
      if (response.ok) {
        const result = await response.json();
        setComments(comments.concat([{
          id: result.id,
          content: result.content,
          created_at: new Date().toISOString()
        }]));
        setNewComment('');
      }
    } catch (err) {
      setError('Failed to add comment');
    }
  };
  const openTaskDetail = function (task) {
    setSelectedTask(task);
    setEditMode(false);
    fetchTaskDetail(task.id);
    setShowDetailModal(true);
  };
  const getPriorityColor = function (priority) {
    if (priority === 'high') return 'bg-red-500';
    if (priority === 'medium') return 'bg-yellow-500';
    if (priority === 'low') return 'bg-green-500';
    return 'bg-gray-500';
  };
  const getPriorityBadgeClass = function (priority) {
    if (priority === 'high') return 'bg-red-100 text-red-700';
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-700';
    if (priority === 'low') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };
  const getTasksByStatus = function (status) {
    return tasks.filter(function (task) {
      return task.status === status;
    });
  };
  const formatDate = function (dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  };
  if (!projectId) {
    return <div className='w-full p-4 sm:p-6 md:p-8'><div className='bg-white/10 border border-white/20 p-6 sm:p-8 text-center'><p className='text-white text-lg'>Please select a project to view tasks</p><button className='mt-4 bg-blue-600 text-white p-2 sm:p-3' onClick={function () {
          router.push('/my_projects');
        }}>Go to Projects</button></div></div>;
  }
  if (loading) {
    return <div className='w-full p-4 sm:p-6 md:p-8'><div className='text-white text-center py-12'>Loading tasks...</div></div>;
  }
  var taskCards = function (statusId) {
    var statusTasks = getTasksByStatus(statusId);
    return statusTasks.map(function (task) {
      var isMoving = movingTask && movingTask.id === task.id;
      return <div key={task.id} className={'bg-white/10 border border-white/20 p-3 sm:p-4 mb-3 cursor-pointer ' + (isMoving ? 'ring-2 ring-blue-400' : '')}><div onClick={function () {
          if (!movingTask) openTaskDetail(task);
        }}><div className='flex items-start justify-between mb-2'><h4 className='text-white font-medium text-sm flex-1 pr-2'>{task.title}</h4><div className={'w-3 h-3 rounded-full flex-shrink-0 ' + getPriorityColor(task.priority)} /></div>{task.due_date ? <div className='flex items-center gap-1 text-gray-400 text-xs mb-2'><svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' /></svg><span>{formatDate(task.due_date)}</span></div> : null}<div className='flex items-center justify-between'>{task.assignee_name ? <div className='w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs'>{task.assignee_name.charAt(0).toUpperCase()}</div> : <div />}<div className='flex items-center gap-1 text-gray-400 text-xs'><svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' /></svg><span>{task.comment_count || 0}</span></div></div></div><button className='mt-2 text-xs text-blue-400 w-full text-left' onClick={function (e) {
          e.stopPropagation();
          if (movingTask && movingTask.id === task.id) {
            setMovingTask(null);
          } else {
            setMovingTask(task);
          }
        }}>{movingTask && movingTask.id === task.id ? "Cancel" : "Move"}</button></div>;
    });
  };
  var columns = statuses.map(function (status) {
    var statusTasks = getTasksByStatus(status.id);
    var cards = taskCards(status.id);
    return <div key={status.id} className='flex-1 min-w-[280px] bg-white/5 p-3 sm:p-4 rounded'><div className='flex items-center justify-between mb-4'><div className='flex items-center gap-2'><div className={'w-3 h-3 rounded-full ' + status.color} /><h3 className='text-white font-semibold text-sm'>{status.label}</h3></div><span className='bg-white/20 text-white text-xs px-2 py-1 rounded-full'>{statusTasks.length}</span></div>{movingTask && movingTask.status !== status.id ? <button className='w-full p-3 mb-3 border-2 border-dashed border-blue-400 text-blue-400 text-sm rounded' onClick={function () {
        handleUpdateTaskStatus(movingTask.id, status.id);
      }}>Move here</button> : null}{cards.length > 0 ? cards : <p className='text-gray-500 text-sm text-center py-4'>No tasks</p>}</div>;
  });
  var createModal = showCreateModal ? <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={function () {
      setShowCreateModal(false);
    }} /><div className='relative bg-white p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto text-gray-900 rounded'><button onClick={function () {
        setShowCreateModal(false);
      }} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><h2 className='text-xl font-bold mb-4'>Create New Task</h2><div className='m-3 sm:m-4'><label className='text-gray-700 block mb-1'>Title</label><input type='text' className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' value={newTask.title} onChange={function (e) {
          setNewTask(Object.assign({}, newTask, {
            title: e.target.value
          }));
        }} placeholder='Enter task title' /></div><div className='m-3 sm:m-4'><label className='text-gray-700 block mb-1'>Description</label><textarea className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded w-full' rows={3} value={newTask.description} onChange={function (e) {
          setNewTask(Object.assign({}, newTask, {
            description: e.target.value
          }));
        }} placeholder='Enter description' /></div><div className='flex flex-col sm:flex-row gap-3 m-3 sm:m-4'><div className='flex-1'><label className='text-gray-700 block mb-1'>Priority</label><select className='bg-white text-gray-900 border border-gray-300 p-2 sm:p-3 rounded w-full' value={newTask.priority} onChange={function (e) {
            setNewTask(Object.assign({}, newTask, {
              priority: e.target.value
            }));
          }}><option value='low'>Low</option><option value='medium'>Medium</option><option value='high'>High</option></select></div><div className='flex-1'><label className='text-gray-700 block mb-1'>Status</label><select className='bg-white text-gray-900 border border-gray-300 p-2 sm:p-3 rounded w-full' value={newTask.status} onChange={function (e) {
            setNewTask(Object.assign({}, newTask, {
              status: e.target.value
            }));
          }}><option value='todo'>To Do</option><option value='in_progress'>In Progress</option><option value='in_review'>In Review</option><option value='done'>Done</option></select></div></div><div className='m-3 sm:m-4'><label className='text-gray-700 block mb-1'>Due Date</label><input type='date' className='bg-white text-gray-900 border border-gray-300 p-2 sm:p-3 rounded w-full' value={newTask.due_date} onChange={function (e) {
          setNewTask(Object.assign({}, newTask, {
            due_date: e.target.value
          }));
        }} /></div><div className='flex gap-3 mt-6 m-3 sm:m-4'><button className='flex-1 bg-blue-600 text-white p-2 sm:p-3 rounded' onClick={handleCreateTask}>Create Task</button><button className='flex-1 bg-gray-200 text-gray-700 p-2 sm:p-3 rounded' onClick={function () {
          setShowCreateModal(false);
        }}>Cancel</button></div></div></div> : null;
  var detailModal = showDetailModal && taskDetail ? <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={function () {
      setShowDetailModal(false);
      setEditMode(false);
    }} /><div className='relative bg-white p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-gray-900 rounded'><button onClick={function () {
        setShowDetailModal(false);
        setEditMode(false);
      }} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button>{editMode ? <div><h2 className='text-xl font-bold mb-4'>Edit Task</h2><div className='mb-4'><label className='text-gray-700 block mb-1'>Title</label><input type='text' className='bg-white text-gray-900 border border-gray-300 p-2 sm:p-3 rounded w-full' value={editTask.title || ''} onChange={function (e) {
            setEditTask(Object.assign({}, editTask, {
              title: e.target.value
            }));
          }} /></div><div className='mb-4'><label className='text-gray-700 block mb-1'>Description</label><textarea className='bg-white text-gray-900 border border-gray-300 p-2 sm:p-3 rounded w-full' rows={4} value={editTask.description || ''} onChange={function (e) {
            setEditTask(Object.assign({}, editTask, {
              description: e.target.value
            }));
          }} /></div><div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'><div><label className='text-gray-700 block mb-1'>Priority</label><select className='bg-white text-gray-900 border border-gray-300 p-2 sm:p-3 rounded w-full' value={editTask.priority || 'medium'} onChange={function (e) {
              setEditTask(Object.assign({}, editTask, {
                priority: e.target.value
              }));
            }}><option value='low'>Low</option><option value='medium'>Medium</option><option value='high'>High</option></select></div><div><label className='text-gray-700 block mb-1'>Status</label><select className='bg-white text-gray-900 border border-gray-300 p-2 sm:p-3 rounded w-full' value={editTask.status || 'todo'} onChange={function (e) {
              setEditTask(Object.assign({}, editTask, {
                status: e.target.value
              }));
            }}><option value='todo'>To Do</option><option value='in_progress'>In Progress</option><option value='in_review'>In Review</option><option value='done'>Done</option></select></div></div><div className='mb-4'><label className='text-gray-700 block mb-1'>Due Date</label><input type='date' className='bg-white text-gray-900 border border-gray-300 p-2 sm:p-3 rounded w-full' value={editTask.due_date ? editTask.due_date.split('T')[0] : ''} onChange={function (e) {
            setEditTask(Object.assign({}, editTask, {
              due_date: e.target.value
            }));
          }} /></div><div className='flex gap-3'><button className='flex-1 bg-blue-600 text-white p-2 sm:p-3 rounded' onClick={handleUpdateTask}>Save Changes</button><button className='flex-1 bg-gray-200 text-gray-700 p-2 sm:p-3 rounded' onClick={function () {
            setEditMode(false);
            setEditTask(taskDetail);
          }}>Cancel</button></div></div> : <div><div className='flex items-start gap-3 mb-4'><h2 className='text-xl font-bold flex-1'>{taskDetail.title}</h2><span className={'text-xs px-3 py-1 rounded-full ' + getPriorityBadgeClass(taskDetail.priority)}>{taskDetail.priority}</span></div>{taskDetail.description ? <p className='text-gray-600 mb-6'>{taskDetail.description}</p> : null}<div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded'><div><span className='text-gray-500 text-xs block'>Status</span><p className='font-medium text-sm'>{statuses.find(function (s) {
                return s.id === taskDetail.status;
              })?.label || taskDetail.status}</p></div>{taskDetail.due_date ? <div><span className='text-gray-500 text-xs block'>Due Date</span><p className='font-medium text-sm'>{formatDate(taskDetail.due_date)}</p></div> : null}{taskDetail.assignee_name ? <div><span className='text-gray-500 text-xs block'>Assignee</span><p className='font-medium text-sm'>{taskDetail.assignee_name}</p></div> : null}{taskDetail.estimated_hours ? <div><span className='text-gray-500 text-xs block'>Est. Hours</span><p className='font-medium text-sm'>{taskDetail.estimated_hours}</p></div> : null}</div><div className='border-t pt-4 mb-4'><h3 className='font-semibold mb-3'>Comments</h3>{comments.length === 0 ? <p className='text-gray-500 text-sm py-4'>No comments yet</p> : comments.map(function (comment) {
            return <div key={comment.id} className='bg-gray-100 p-3 mb-2 rounded'><p className='text-sm'>{comment.content}</p>{comment.author_name ? <p className='text-xs text-gray-500 mt-1'>{comment.author_name}</p> : null}</div>;
          })}</div><div className='flex gap-2 mb-6'><input type='text' className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded flex-1' value={newComment} onChange={function (e) {
            setNewComment(e.target.value);
          }} placeholder='Add a comment...' /><button className='bg-blue-600 text-white px-4 p-2 sm:p-3 rounded' onClick={handleAddComment}>Post</button></div><div className='flex gap-3 border-t pt-4'><button className='bg-blue-600 text-white p-2 sm:p-3 rounded' onClick={function () {
            setEditMode(true);
          }}>Edit Task</button><button className='!bg-red-700 !text-white p-2 sm:p-3 md:p-4 rounded' onClick={function () {
            handleDeleteTask(taskDetail.id);
          }}>Delete</button></div></div>}</div></div> : null;
  var errorModal = error ? <div className='fixed inset-0 z-50 flex items-center justify-center p-4'><div className='absolute inset-0 bg-black bg-opacity-50' onClick={function () {
      setError(null);
    }} /><div className='relative bg-white p-6 w-full max-w-sm text-gray-900 rounded'><button onClick={function () {
        setError(null);
      }} className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold'>×</button><p className='text-center py-4'>{error}</p></div></div> : null;
  return <div className='w-full p-2 sm:p-4 md:p-6'><div className='mb-4 sm:mb-6'><div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4'><h1 className='text-white text-xl sm:text-2xl font-bold'>Task Board</h1></div><div className='mt-4 mb-6'><button className='bg-blue-600 text-white p-2 sm:p-3 md:p-4 rounded' onClick={function () {
          setShowCreateModal(true);
        }}>Add Task</button></div><div className='flex flex-col sm:flex-row gap-3 mb-4'><input type='text' className='bg-white text-gray-900 border border-gray-300 placeholder-gray-500 p-2 sm:p-3 rounded flex-1' placeholder='Search tasks...' value={searchTerm} onChange={function (e) {
          setSearchTerm(e.target.value);
        }} /><select className='bg-white text-gray-900 border border-gray-300 p-2 sm:p-3 rounded' value={filterPriority} onChange={function (e) {
          setFilterPriority(e.target.value);
        }}><option value=''>All Priorities</option><option value='low'>Low</option><option value='medium'>Medium</option><option value='high'>High</option></select></div>{movingTask ? <div className='bg-blue-600/20 border border-blue-500 p-3 rounded text-blue-300 text-sm flex items-center justify-between'><span>{"Moving: " + movingTask.title}</span><button className='text-blue-400 text-sm' onClick={function () {
          setMovingTask(null);
        }}>Cancel</button></div> : null}</div><div className='flex flex-col lg:flex-row gap-4 overflow-x-auto pb-4'>{columns}</div>{createModal}{detailModal}{errorModal}</div>;
}
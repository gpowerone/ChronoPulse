'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    color: '#3B82F6',
    due_date: ''
  });
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      const response = await fetch(`/api/projectslist?${params}`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, [searchTerm, statusFilter]);
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingProject ? '/api/projectsupdate' : '/api/projectscreate';
      const method = editingProject ? 'PUT' : 'POST';
      const body = editingProject ? {
        id: editingProject.id,
        ...formData
      } : formData;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        setShowForm(false);
        setEditingProject(null);
        setFormData({
          name: '',
          description: '',
          status: 'planning',
          priority: 'medium',
          color: '#3B82F6',
          due_date: ''
        });
        fetchProjects();
      }
    } catch (err) {
      console.error('Error saving project:', err);
    } finally {
      setIsSaving(false);
    }
  };
  const handleEdit = project => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      status: project.status,
      priority: project.priority,
      color: project.color || '#3B82F6',
      due_date: project.due_date || ''
    });
    setShowForm(true);
  };
  const handleDelete = async project => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const response = await fetch(`/api/projectsdelete?id=${project.id}`, {
        method: 'DELETE'
      });
      if (response.ok) fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };
  const getStatusColor = status => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-purple-100 text-purple-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  const getPriorityColor = priority => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };
  if (isLoading) {
    return <div className='p-6 flex justify-center items-center min-h-[400px]'><div className='text-center'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4' /><p>Loading projects...</p></div></div>;
  }
  const FormModal = () => {
    if (!showForm) return null;
    return <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'><div className='bg-white rounded-xl max-w-lg w-full shadow-2xl'><form onSubmit={handleSubmit}><div className='p-6 border-b'><h2 className='text-xl font-bold text-gray-900'>{editingProject ? "Edit" : "New Project"}</h2></div><div className='p-6 space-y-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Project Name</label><input type='text' value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500' required={true} /></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Description</label><textarea value={formData.description} onChange={e => setFormData({
                ...formData,
                description: e.target.value
              })} className='w-full px-3 py-2 border rounded-lg' rows={3} /></div><div className='grid grid-cols-2 gap-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Status</label><select value={formData.status} onChange={e => setFormData({
                  ...formData,
                  status: e.target.value
                })} className='w-full px-3 py-2 border rounded-lg'><option value='planning'>Planning</option><option value='active'>Active</option><option value='on_hold'>On Hold</option><option value='completed'>Completed</option></select></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Priority</label><select value={formData.priority} onChange={e => setFormData({
                  ...formData,
                  priority: e.target.value
                })} className='w-full px-3 py-2 border rounded-lg'><option value='low'>Low</option><option value='medium'>Medium</option><option value='high'>High</option><option value='urgent'>Urgent</option></select></div></div><div className='grid grid-cols-2 gap-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Color</label><input type='color' value={formData.color} onChange={e => setFormData({
                  ...formData,
                  color: e.target.value
                })} className='w-full h-10 border rounded-lg cursor-pointer' /></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Due Date</label><input type='date' value={formData.due_date} onChange={e => setFormData({
                  ...formData,
                  due_date: e.target.value
                })} className='w-full px-3 py-2 border rounded-lg' /></div></div></div><div className='p-6 border-t flex justify-end gap-3'><button type='button' onClick={() => {
              setShowForm(false);
              setEditingProject(null);
            }} className='px-4 py-2 !bg-transparent border border-current rounded-lg'>Cancel</button><button type='submit' disabled={isSaving} className='px-4 py-2 rounded-lg'>Save</button></div></form></div></div>;
  };
  return <div className='projects-container p-6'>{FormModal()}<div className='mb-6 flex justify-between items-start flex-wrap gap-4'><div><h1 className='text-2xl font-bold mb-2'>Projects</h1><p>Manage your projects and tasks</p></div><button onClick={() => {
        setShowForm(true);
        setEditingProject(null);
        setFormData({
          name: '',
          description: '',
          status: 'planning',
          priority: 'medium',
          color: '#3B82F6',
          due_date: ''
        });
      }} className='px-4 py-2 rounded-lg flex items-center gap-2'>+ New Project</button></div><div className='mb-6 flex flex-wrap gap-4'><input type='text' placeholder='Search projects...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='flex-1 min-w-[200px] px-4 py-2 border rounded-lg' /><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className='px-4 py-2 border rounded-lg'><option value=''>All Status</option><option value='planning'>Planning</option><option value='active'>Active</option><option value='on_hold'>On Hold</option><option value='completed'>Completed</option><option value='archived'>Archived</option></select></div>{projects.length === 0 ? <div className='bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center'><div className='text-gray-400 text-6xl mb-4'>📁</div><h3 className='text-lg font-semibold text-gray-800 mb-2'>No projects yet</h3><p className='text-gray-600 mb-4'>Create your first project to get started</p><button onClick={() => setShowForm(true)} className='px-4 py-2 rounded-lg'>New Project</button></div> : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>{projects.map(project => <div key={project.id} className='bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer group'><div className='h-2' style={{
          backgroundColor: project.color
        }} /><div className='p-4'><div className='flex justify-between items-start mb-3'><h3 className='font-semibold text-lg truncate flex-1 text-gray-900'>{project.name}</h3><div className='flex gap-1 opacity-0 group-hover:opacity-100 transition'><button onClick={e => {
                e.stopPropagation();
                handleEdit(project);
              }} className='p-1 !bg-transparent border border-current rounded-lg'>✏️</button><button onClick={e => {
                e.stopPropagation();
                handleDelete(project);
              }} className='p-1 !bg-transparent border border-current rounded-lg'>🗑️</button></div></div>{project.description && <p className='text-sm text-gray-600 mb-3 line-clamp-2'>{project.description}</p>}<div className='flex flex-wrap gap-2 mb-3'><span className={`px-2 py-1 rounded text-xs ${getStatusColor(project.status)}`}>{project.status}</span><span className={`px-2 py-1 rounded text-xs ${getPriorityColor(project.priority)}`}>{project.priority}</span></div><div className='mb-3'><div className='flex justify-between text-sm text-gray-600 mb-1'><span>Progress</span><span>{`${project.progress || 0}%`}</span></div><div className='w-full bg-gray-200 rounded-full h-2'><div className='bg-blue-600 h-2 rounded-full transition-all' style={{
                width: `${project.progress || 0}%`
              }} /></div></div><div className='flex justify-between text-sm text-gray-600'><span>{`${project.completed_task_count || 0}/${project.task_count || 0} ${"Tasks"}`}</span>{project.due_date && <span>{project.due_date}</span>}</div></div><div className='px-4 py-3 bg-gray-50 border-t'><button onClick={() => router.push(`/project_workspace?projectsid=${project.id}`)} className='px-3 py-1.5 rounded-lg text-sm font-medium'>View Project →</button></div></div>)}</div>}</div>;
}
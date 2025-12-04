'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [entries, setEntries] = useState([]);
  const [runningEntry, setRunningEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeTab, setActiveTab] = useState('timer');
  const [dateRange, setDateRange] = useState('week');
  const [editingEntry, setEditingEntry] = useState(null);
  const formatDuration = minutes => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hrs}h ${mins}m`;
  };
  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const getDateRange = () => {
    const now = new Date();
    let start, end;
    if (dateRange === 'today') {
      start = end = now.toISOString().split('T')[0];
    } else if (dateRange === 'week') {
      const dayOfWeek = now.getDay();
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - dayOfWeek);
      start = startDate.toISOString().split('T')[0];
      end = now.toISOString().split('T')[0];
    } else {
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      start = startDate.toISOString().split('T')[0];
      end = now.toISOString().split('T')[0];
    }
    return {
      start,
      end
    };
  };
  const fetchEntries = async () => {
    try {
      const {
        start,
        end
      } = getDateRange();
      const response = await fetch(`/api/timeentrieslist?start_date=${start}&end_date=${end}`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data.data || []);
        const running = data.data?.find(e => e.is_running);
        setRunningEntry(running || null);
      }
    } catch (err) {
      console.error('Error fetching entries:', err);
    }
  };
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projectslist', {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };
  const fetchTasks = async projectId => {
    if (!projectId) {
      setTasks([]);
      return;
    }
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
  const fetchSummary = async () => {
    try {
      const {
        start,
        end
      } = getDateRange();
      const response = await fetch(`/api/timeentriessummary?start_date=${start}&end_date=${end}&group_by=project`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };
  useEffect(() => {
    Promise.all([fetchEntries(), fetchProjects(), fetchSummary()]).then(() => setIsLoading(false));
  }, [dateRange]);
  useEffect(() => {
    if (selectedProject) fetchTasks(selectedProject);
  }, [selectedProject]);
  useEffect(() => {
    let interval;
    if (runningEntry) {
      const startTime = new Date(runningEntry.start_time).getTime();
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [runningEntry]);
  const handleStartTimer = async () => {
    try {
      const response = await fetch('/api/timeentriescreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: description || null,
          project_id: selectedProject || null,
          task_id: selectedTask || null,
          start_time: new Date().toISOString(),
          is_running: true
        })
      });
      if (response.ok) {
        setDescription('');
        fetchEntries();
        fetchSummary();
      }
    } catch (err) {
      console.error('Error starting timer:', err);
    }
  };
  const handleStopTimer = async () => {
    if (!runningEntry) return;
    try {
      const response = await fetch('/api/timeentriesupdate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: runningEntry.id,
          is_running: false
        })
      });
      if (response.ok) {
        setRunningEntry(null);
        setElapsedTime(0);
        fetchEntries();
        fetchSummary();
      }
    } catch (err) {
      console.error('Error stopping timer:', err);
    }
  };
  const handleDeleteEntry = async id => {
    if (!confirm('Delete this time entry?')) return;
    try {
      const response = await fetch(`/api/timeentriesdelete?id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchEntries();
        fetchSummary();
      }
    } catch (err) {
      console.error('Error deleting entry:', err);
    }
  };
  const handleSaveManualEntry = async e => {
    e.preventDefault();
    const form = e.target;
    const entryData = {
      description: form.description.value,
      project_id: form.project_id.value || null,
      task_id: form.task_id.value || null,
      start_time: `${form.date.value}T${form.start_time.value}:00`,
      end_time: `${form.date.value}T${form.end_time.value}:00`,
      is_billable: form.is_billable.checked
    };
    try {
      const response = await fetch('/api/timeentriescreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entryData)
      });
      if (response.ok) {
        setShowForm(false);
        fetchEntries();
        fetchSummary();
      }
    } catch (err) {
      console.error('Error creating entry:', err);
    }
  };
  if (isLoading) {
    return <div className='p-6 flex justify-center items-center min-h-[400px]'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600' /></div>;
  }
  const TimerSection = () => <div className='bg-white rounded-2xl shadow-lg p-6 mb-6'><div className='flex flex-col md:flex-row gap-4 items-center'><input type='text' value={description} onChange={e => setDescription(e.target.value)} placeholder='What are you working on?' className='flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none' disabled={!!runningEntry} /><select value={selectedProject} onChange={e => {
        setSelectedProject(e.target.value);
        setSelectedTask('');
      }} className='px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none' disabled={!!runningEntry}><option value=''>No Project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>{tasks.length > 0 && <select value={selectedTask} onChange={e => setSelectedTask(e.target.value)} className='px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none' disabled={!!runningEntry}><option value=''>No Task</option>{tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select>}<div className='flex items-center gap-4'><span className='text-3xl font-mono font-bold text-gray-800'>{formatTime(elapsedTime)}</span>{runningEntry ? <button onClick={handleStopTimer} className='px-6 py-3 rounded-xl font-semibold flex items-center gap-2'>⏹ Stop Timer</button> : <button onClick={handleStartTimer} className='px-6 py-3 rounded-xl font-semibold flex items-center gap-2'>▶ Start Timer</button>}</div></div></div>;
  const SummaryCards = () => <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'><div className='bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white'><p className='text-indigo-100 text-sm'>Total Hours</p><p className='text-3xl font-bold mt-1'>{formatDuration((summary?.total_hours || 0) * 60)}</p></div><div className='bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white'><p className='text-emerald-100 text-sm'>Billable</p><p className='text-3xl font-bold mt-1'>{formatDuration((summary?.billable_hours || 0) * 60)}</p></div><div className='bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white'><p className='text-amber-100 text-sm'>Entries</p><p className='text-3xl font-bold mt-1'>{entries.length || 0}</p></div><div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white'><p className='text-purple-100 text-sm'>Earnings</p><p className='text-3xl font-bold mt-1'>${(summary?.total_earnings || 0).toFixed(2)}</p></div></div>;
  const EntryRow = ({
    entry
  }) => <div className={`flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition ${entry.is_running ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''}`}><div className='flex-1'><p className='font-medium text-gray-900'>{entry.description || 'No description'}</p><div className='flex items-center gap-2 mt-1'>{entry.project && <span className='px-2 py-0.5 rounded-full text-xs font-medium' style={{
          backgroundColor: entry.project.color + '20',
          color: entry.project.color
        }}>{entry.project.name}</span>}{entry.task && <span className='text-xs text-gray-600'>→ {entry.task.title}</span>}</div></div><div className='text-right'><p className='font-mono font-semibold text-gray-900'>{entry.is_running ? formatTime(elapsedTime) : formatDuration(entry.duration_minutes || 0)}</p><p className='text-xs text-gray-500'>{new Date(entry.start_time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}{entry.end_time && ` - ${new Date(entry.end_time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}`}</p></div><div className='flex items-center gap-2'>{entry.is_billable && <span className='text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full'>$</span>}{!entry.is_running && <button onClick={() => handleDeleteEntry(entry.id)} className='p-2 !bg-transparent border border-current rounded-lg'>🗑</button>}</div></div>;
  const ManualEntryForm = () => {
    if (!showForm) return null;
    const today = new Date().toISOString().split('T')[0];
    return <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'><div className='bg-white rounded-2xl max-w-lg w-full'><form onSubmit={handleSaveManualEntry}><div className='p-6 border-b'><h2 className='text-xl font-bold text-gray-900'>Add Time Entry</h2></div><div className='p-6 space-y-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Description</label><input name='description' type='text' className='w-full px-3 py-2 border rounded-lg' /></div><div className='grid grid-cols-2 gap-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Project</label><select name='project_id' className='w-full px-3 py-2 border rounded-lg'><option value=''>None</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Task</label><select name='task_id' className='w-full px-3 py-2 border rounded-lg'><option value=''>None</option>{tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</select></div></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Date</label><input name='date' type='date' defaultValue={today} className='w-full px-3 py-2 border rounded-lg' required={true} /></div><div className='grid grid-cols-2 gap-4'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Start Time</label><input name='start_time' type='time' defaultValue='09:00' className='w-full px-3 py-2 border rounded-lg' required={true} /></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>End Time</label><input name='end_time' type='time' defaultValue='17:00' className='w-full px-3 py-2 border rounded-lg' required={true} /></div></div><label className='flex items-center gap-2'><input name='is_billable' type='checkbox' defaultChecked={true} className='rounded' /><span className='text-sm text-gray-700'>Billable</span></label></div><div className='p-6 border-t flex justify-end gap-3'><button type='button' onClick={() => setShowForm(false)} className='px-4 py-2 !bg-transparent border border-current rounded-lg'>Cancel</button><button type='submit' className='px-4 py-2 rounded-lg'>Save Entry</button></div></form></div></div>;
  };
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.start_time).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});
  return <div className='time-tracking p-6 max-w-5xl mx-auto'>{ManualEntryForm()}<div className='flex justify-between items-center mb-6'><h1 className='text-2xl font-bold'>Time Tracking</h1><div className='flex gap-2'><select value={dateRange} onChange={e => setDateRange(e.target.value)} className='px-4 py-2 border rounded-lg'><option value='today'>Today</option><option value='week'>This Week</option><option value='month'>This Month</option></select><button onClick={() => setShowForm(true)} className='px-4 py-2 rounded-lg'>+ Add Time Entry</button></div></div>{TimerSection()}{SummaryCards()}<div className='bg-white rounded-2xl shadow-lg overflow-hidden'><div className='p-4 border-b'><h2 className='font-semibold text-gray-900'>Time Entries</h2></div>{entries.length === 0 ? <div className='p-8 text-center text-gray-600'>No time entries yet</div> : <div className='divide-y'>{Object.entries(groupedEntries).map(([date, dayEntries]) => <div key={date} className='p-4'><h3 className='text-sm font-medium text-gray-500 mb-3'>{date}</h3><div className='space-y-2'>{dayEntries.map(entry => <EntryRow key={entry.id} entry={entry} />)}</div></div>)}</div>}</div>{summary?.breakdown?.length > 0 && <div className='mt-6 bg-white rounded-2xl shadow-lg p-6'><h2 className='font-semibold text-gray-900 mb-4'>Time by Project</h2><div className='space-y-3'>{summary.breakdown.map((item, idx) => <div key={idx} className='flex items-center gap-3'><div className='w-3 h-3 rounded-full' style={{
            backgroundColor: item.project_color || '#94a3b8'
          }} /><span className='flex-1 font-medium text-gray-900'>{item.project_name || 'No Project'}</span><span className='font-mono text-gray-700'>{formatDuration((item.total_hours || 0) * 60)}</span><div className='w-32 bg-gray-200 rounded-full h-2'><div className='bg-indigo-500 h-2 rounded-full' style={{
              width: `${item.total_hours / summary.total_hours * 100 || 0}%`
            }} /></div></div>)}</div></div>}</div>;
}
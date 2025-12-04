'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [members, setMembers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');
  const projectId = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('projectsid');
  const canManage = window.canManage || false;
  const roles = [{
    value: 'owner',
    label: "Owner"
  }, {
    value: 'admin',
    label: "Admin"
  }, {
    value: 'member',
    label: "Member"
  }, {
    value: 'viewer',
    label: "Viewer"
  }];
  const fetchMembers = async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/projectmemberslist?project_id=${projectId}`, {
        method: 'GET'
      });
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees/list', {
        method: 'GET'
      });
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
  useEffect(() => {
    fetchMembers();
    if (canManage) {
      fetchEmployees();
    }
  }, [projectId, canManage]);
  const handleAddMember = async e => {
    e.preventDefault();
    if (!selectedEmployeeId || !projectId) return;
    try {
      const response = await fetch('/api/projectmembersadd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project_id: projectId,
          employee_id: selectedEmployeeId,
          role: selectedRole
        })
      });
      if (response.ok) {
        setShowAddForm(false);
        setSelectedEmployeeId('');
        setSelectedRole('member');
        fetchMembers();
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };
  const handleRemoveMember = async memberId => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      const response = await fetch('/api/projectmembersremove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: memberId
        })
      });
      if (response.ok) {
        fetchMembers();
      }
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };
  const getRoleBadgeColor = role => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const availableEmployees = employees.filter(emp => !members.some(m => m.employee_id === emp.id));
  if (!projectId) {
    return <div className='bg-white rounded-lg shadow p-6 text-center text-gray-500'>No project selected. Navigate here from a project detail page.</div>;
  }
  if (loading) {
    return <div className='animate-pulse'><div className='h-4 bg-gray-200 rounded w-1/3 mb-4' /><div className='space-y-2'>{[1, 2, 3].map(i => <div key={i} className='h-12 bg-gray-200 rounded' />)}</div></div>;
  }
  const renderAddForm = () => {
    if (!showAddForm) return null;
    return <div className='mb-4 p-4 bg-gray-50 rounded-lg'><form onSubmit={handleAddMember} className='space-y-3'><div><label className='block text-sm font-medium text-gray-700 mb-1'>Select Employee</label><select value={selectedEmployeeId} onChange={e => setSelectedEmployeeId(e.target.value)} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' required={true}><option value=''>-- Select --</option>{availableEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.first_name + ' ' + emp.last_name + ' (' + emp.email + ')'}</option>)}</select></div><div><label className='block text-sm font-medium text-gray-700 mb-1'>Role</label><select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'><option value='admin'>Admin</option><option value='member'>Member</option><option value='viewer'>Viewer</option></select></div><div className='flex gap-2'><button type='submit' className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>Add Member</button><button type='button' onClick={() => {
            setShowAddForm(false);
            setSelectedEmployeeId('');
          }} className='px-4 py-2 !bg-transparent border border-current rounded-lg hover:bg-gray-50'>Cancel</button></div></form></div>;
  };
  const renderMemberRow = member => {
    return <div key={member.id} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'><div className='flex items-center gap-3'><div className='w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden'>{member.employee && member.employee.avatar_url ? <img src={member.employee.avatar_url} alt='' className='w-full h-full object-cover' /> : <span className='text-gray-700 font-medium'>{(member.employee && member.employee.first_name ? member.employee.first_name[0] : '') + (member.employee && member.employee.last_name ? member.employee.last_name[0] : '')}</span>}</div><div><div className='font-medium text-gray-900'>{member.employee ? member.employee.first_name + ' ' + member.employee.last_name : ''}</div><div className='text-sm text-gray-700'>{member.employee ? member.employee.job_title || member.employee.email : ''}</div></div></div><div className='flex items-center gap-3'><span className={'px-2 py-1 text-xs font-medium rounded-full ' + getRoleBadgeColor(member.role)}>{(roles.find(r => r.value === member.role) || {}).label || member.role}</span>{canManage && member.role !== 'owner' && <button onClick={() => handleRemoveMember(member.id)} className='text-red-600 hover:text-red-800 text-sm'>Remove</button>}</div></div>;
  };
  return <div className='bg-white rounded-lg shadow p-4'><div className='flex justify-between items-center mb-4'><h3 className='text-lg font-semibold text-gray-900'>Team Members</h3>{canManage && <button onClick={() => setShowAddForm(true)} className='px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>Add Member</button>}</div>{renderAddForm()}{members.length === 0 ? <div className='text-center py-8 text-gray-700'>No team members assigned</div> : <div className='space-y-2'>{members.map(member => renderMemberRow(member))}</div>}</div>;
}
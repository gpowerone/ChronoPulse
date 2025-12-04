'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
export default function () {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const limit = 20;
  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      if (searchTerm) params.append('search', searchTerm);
      if (departmentFilter) params.append('department', departmentFilter);
      if (statusFilter) params.append('status', statusFilter);
      const response = await fetch(`/api/employeeslist?${params}`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('fetch-error');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, [page, searchTerm, departmentFilter, statusFilter]);
  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];
  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleView = async employee => {
    try {
      const response = await fetch(`/api/employeesget?id=${employee.id}`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedEmployee(data.data || employee);
      } else {
        setSelectedEmployee(employee);
      }
    } catch (err) {
      setSelectedEmployee(employee);
    }
  };
  if (isLoading) {
    return <div className='employees-container p-6'><div className='flex justify-center items-center min-h-[400px]'><div className='text-center'><div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4' /><p>Loading employees...</p></div></div></div>;
  }
  const DetailModal = () => {
    if (!selectedEmployee) return null;
    return <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'><div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'><div className='p-6 border-b flex justify-between items-center'><h2 className='text-xl font-bold text-gray-900'>{selectedEmployee.full_name}</h2><button onClick={() => setSelectedEmployee(null)} className='p-2 !bg-transparent border border-current rounded-lg text-2xl'>×</button></div><div className='p-6'><div className='flex items-start gap-6 mb-6'><div className='w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-700'>{selectedEmployee.avatar_url ? <img src={selectedEmployee.avatar_url} alt='' className='w-full h-full rounded-full object-cover' /> : (selectedEmployee.first_name?.[0] || '') + (selectedEmployee.last_name?.[0] || '')}</div><div><h3 className='text-lg font-semibold text-gray-900'>{selectedEmployee.job_title || 'No title'}</h3><p className='text-gray-700'>{selectedEmployee.department || 'No department'}</p><span className={`inline-block px-2 py-1 rounded text-sm mt-2 ${getStatusColor(selectedEmployee.status)}`}>{selectedEmployee.status}</span></div></div><div className='grid grid-cols-2 gap-4'><div><label className='text-sm text-gray-500'>Email</label><p className='font-medium text-gray-900'>{selectedEmployee.email}</p></div><div><label className='text-sm text-gray-500'>Phone</label><p className='font-medium text-gray-900'>{selectedEmployee.phone || '-'}</p></div><div><label className='text-sm text-gray-500'>Location</label><p className='font-medium text-gray-900'>{selectedEmployee.location || '-'}</p></div><div><label className='text-sm text-gray-500'>Employee #</label><p className='font-medium text-gray-900'>{selectedEmployee.employee_number || '-'}</p></div><div><label className='text-sm text-gray-500'>Hire Date</label><p className='font-medium text-gray-900'>{selectedEmployee.hire_date || '-'}</p></div><div><label className='text-sm text-gray-500'>Employment Type</label><p className='font-medium text-gray-900 capitalize'>{(selectedEmployee.employment_type || 'full_time').replace('_', ' ')}</p></div></div>{selectedEmployee.bio && <div className='mt-4'><label className='text-sm text-gray-500'>Bio</label><p className='mt-1 text-gray-900'>{selectedEmployee.bio}</p></div>}{selectedEmployee.skills && selectedEmployee.skills.length > 0 && <div className='mt-4'><label className='text-sm text-gray-500'>Skills</label><div className='flex flex-wrap gap-2 mt-1'>{selectedEmployee.skills.map((skill, i) => <span key={i} className='px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm'>{skill}</span>)}</div></div>}</div><div className='p-6 border-t flex justify-end'><button onClick={() => setSelectedEmployee(null)} className='px-4 py-2 !bg-transparent border border-current rounded-lg'>Cancel</button></div></div></div>;
  };
  return <div className='employees-container p-6'>{DetailModal()}<div className='mb-6'><h1 className='text-2xl font-bold mb-2'>Employee Directory</h1><p>Manage team members and their profiles</p></div><div className='mb-6 flex flex-wrap gap-4'><input type='text' placeholder='Search employees...' value={searchTerm} onChange={e => {
        setSearchTerm(e.target.value);
        setPage(1);
      }} className='flex-1 min-w-[200px] px-4 py-2 border rounded-lg' /><select value={departmentFilter} onChange={e => {
        setDepartmentFilter(e.target.value);
        setPage(1);
      }} className='px-4 py-2 border rounded-lg'><option value=''>All Departments</option>{departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}</select><select value={statusFilter} onChange={e => {
        setStatusFilter(e.target.value);
        setPage(1);
      }} className='px-4 py-2 border rounded-lg'><option value=''>All Status</option><option value='active'>Active</option><option value='on_leave'>On Leave</option><option value='terminated'>Terminated</option></select></div>{employees.length === 0 ? <div className='bg-gray-50 border border-gray-200 rounded-lg p-12 text-center'><p>No employees found</p></div> : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>{employees.map(employee => <div key={employee.id} className='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition cursor-pointer' onClick={() => handleView(employee)}><div className='flex items-center gap-3'><div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-700'>{employee.avatar_url ? <img src={employee.avatar_url} alt='' className='w-full h-full rounded-full object-cover' /> : (employee.first_name?.[0] || '') + (employee.last_name?.[0] || '')}</div><div className='flex-1 min-w-0'><h3 className='font-semibold truncate text-gray-900'>{employee.full_name}</h3><p className='text-sm text-gray-600 truncate'>{employee.job_title || 'No title'}</p></div><span className={`px-2 py-1 rounded text-xs ${getStatusColor(employee.status)}`}>{employee.status}</span></div><div className='mt-3 text-sm text-gray-600'><p className='truncate'>{employee.email}</p>{employee.department && <p className='text-gray-600'>{employee.department}</p>}</div></div>)}</div>}{totalPages > 1 && <div className='mt-6 flex justify-center gap-4'><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className='px-4 py-2 border rounded-lg disabled:opacity-50'>Previous</button><span className='px-4 py-2'>{`${page} / ${totalPages}`}</span><button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className='px-4 py-2 border rounded-lg disabled:opacity-50'>Next</button></div>}</div>;
}
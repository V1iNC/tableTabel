import React, { useState, useEffect, useMemo } from 'react';
import { Employee } from '../types';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface DataGridProps {
  employees: Employee[];
  lastDayOfMonth: number;
  onCellChange: (employeeId: number, day: number, value: string) => void;
}

export const DataGrid: React.FC<DataGridProps> = ({ 
  employees, 
  lastDayOfMonth,
  onCellChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [focusedCell, setFocusedCell] = useState<{ empId: number; day: number } | null>(null);

  const getCellColor = (value: string) => {
    switch (value) {
      case 'Я':
        return 'bg-green-100';
      case 'ОВ':
        return 'bg-yellow-100';
      case 'В':
        return 'bg-gray-100';
      case 'РВ':
        return 'bg-blue-100';
      default:
        return '';
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const validInputs = ['Я', 'ОВ', 'В', 'РВ'];

  const handleCellKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    empId: number,
    day: number
  ) => {
    // Navigate with arrow keys
    if (e.key === 'ArrowRight' && day < lastDayOfMonth) {
      setFocusedCell({ empId, day: day + 1 });
    } else if (e.key === 'ArrowLeft' && day > 1) {
      setFocusedCell({ empId, day: day - 1 });
    } else if (e.key === 'ArrowUp') {
      const currentIndex = employees.findIndex(emp => emp.id === empId);
      if (currentIndex > 0) {
        setFocusedCell({ empId: employees[currentIndex - 1].id, day });
      }
    } else if (e.key === 'ArrowDown') {
      const currentIndex = employees.findIndex(emp => emp.id === empId);
      if (currentIndex < employees.length - 1) {
        setFocusedCell({ empId: employees[currentIndex + 1].id, day });
      }
    } else if (['Я', 'В', 'О'].includes(e.key.toUpperCase())) {
      e.preventDefault();
      
      if (e.key.toUpperCase() === 'О') {
        onCellChange(empId, day, 'ОВ');
      } else {
        onCellChange(empId, day, e.key.toUpperCase());
      }
      
      // Move to the next cell after input
      if (day < lastDayOfMonth) {
        setFocusedCell({ empId, day: day + 1 });
      } else {
        const currentIndex = employees.findIndex(emp => emp.id === empId);
        if (currentIndex < employees.length - 1) {
          setFocusedCell({ empId: employees[currentIndex + 1].id, day: 1 });
        }
      }
    } else if (e.key === 'R' || e.key === 'r') {
      e.preventDefault();
      onCellChange(empId, day, 'РВ');
      
      // Move to the next cell after input
      if (day < lastDayOfMonth) {
        setFocusedCell({ empId, day: day + 1 });
      }
    }
  };

  const filteredEmployees = useMemo(() => {
    let filtered = [...employees];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortColumn === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortColumn === 'position') {
        comparison = a.position.localeCompare(b.position);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [employees, searchTerm, sortColumn, sortDirection]);

  useEffect(() => {
    // Focus the cell when focusedCell changes
    if (focusedCell) {
      const cellEl = document.getElementById(`cell-${focusedCell.empId}-${focusedCell.day}`);
      cellEl?.focus();
    }
  }, [focusedCell]);

  return (
    <div className="overflow-x-auto">
      <div className="flex mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск сотрудника..."
            className="pl-10 p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Сотрудник
                  {sortColumn === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('position')}
              >
                <div className="flex items-center">
                  Должность
                  {sortColumn === 'position' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              </th>
              {Array.from({ length: lastDayOfMonth }, (_, i) => i + 1).map((day) => (
                <th
                  key={day}
                  scope="col"
                  className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {day}
                </th>
              ))}
              {employees[0]?.summary && (
                <>
                  <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">Раб. дни</th>
                  <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">Вых. дни</th>
                  <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">Раб. вых.</th>
                  <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">Отгулы</th>
                  <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">Всего часов</th>
                  <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">Сверхуроч.</th>
                  <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">Часы вых.</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{employee.position}</div>
                </td>
                {Array.from({ length: lastDayOfMonth }, (_, i) => i + 1).map((day) => (
                  <td key={day} className="px-1 py-2 whitespace-nowrap text-center">
                    <input
                      id={`cell-${employee.id}-${day}`}
                      type="text"
                      value={employee.attendance[day] || ''}
                      onChange={(e) => onCellChange(employee.id, day, e.target.value)}
                      onKeyDown={(e) => handleCellKeyDown(e, employee.id, day)}
                      onFocus={() => setFocusedCell({ empId: employee.id, day })}
                      maxLength={2}
                      className={`w-10 h-10 text-center border ${getCellColor(employee.attendance[day] || '')} rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </td>
                ))}
                {employee.summary && (
                  <>
                    <td className="px-2 py-4 whitespace-nowrap text-center bg-gray-50 font-medium">
                      {employee.summary.totalWorkDays}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-center bg-gray-50 font-medium">
                      {employee.summary.totalWeekends}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-center bg-gray-50 font-medium">
                      {employee.summary.totalWorkedWeekends}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-center bg-gray-50 font-medium">
                      {employee.summary.totalDayOffs}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-center bg-gray-50 font-medium">
                      {employee.summary.totalHours}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-center bg-gray-50 font-medium">
                      {employee.summary.overtimeHours}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-center bg-gray-50 font-medium">
                      {employee.summary.weekendHours}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 bg-blue-50 p-4 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">Обозначения:</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-100 rounded mr-2"></div>
            <span className="text-sm">Я - явка (обычный рабочий день)</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-100 rounded mr-2"></div>
            <span className="text-sm">ОВ - день отдыха за ранее отработанное время</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-100 rounded mr-2"></div>
            <span className="text-sm">В - выходной</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-100 rounded mr-2"></div>
            <span className="text-sm">РВ - работа в выходной день</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-blue-800">Навигация: используйте стрелки для перемещения между ячейками. Быстрый ввод: нажмите клавиши Я, В, О, Р.</p>
      </div>
    </div>
  );
};
import React, { useMemo } from 'react';
import { Employee } from '../types';
import { BarChart, ClipboardList, Clock } from 'lucide-react';

interface SummaryProps {
  employees: Employee[];
  lastDayOfMonth: number;
  isCalculated: boolean;
}

export const Summary: React.FC<SummaryProps> = ({ 
  employees, 
  lastDayOfMonth,
  isCalculated
}) => {
  const summaryData = useMemo(() => {
    if (!employees.length || !isCalculated) return null;

    // Calculate totals
    let totalWorkDays = 0;
    let totalWeekends = 0;
    let totalWorkedWeekends = 0;
    let totalDayOffs = 0;
    let totalHours = 0;
    let totalOvertimeHours = 0;
    let totalWeekendHours = 0;

    employees.forEach(employee => {
      if (employee.summary) {
        totalWorkDays += employee.summary.totalWorkDays;
        totalWeekends += employee.summary.totalWeekends;
        totalWorkedWeekends += employee.summary.totalWorkedWeekends;
        totalDayOffs += employee.summary.totalDayOffs;
        totalHours += employee.summary.totalHours;
        totalOvertimeHours += employee.summary.overtimeHours;
        totalWeekendHours += employee.summary.weekendHours;
      }
    });

    return {
      totalWorkDays,
      totalWeekends,
      totalWorkedWeekends,
      totalDayOffs,
      totalHours,
      totalOvertimeHours,
      totalWeekendHours,
      employeeCount: employees.length
    };
  }, [employees, isCalculated]);

  if (!summaryData) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <BarChart size={24} className="mr-2 text-blue-600" />
        Сводная информация
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
            <ClipboardList size={16} className="mr-1" />
            Учтено сотрудников
          </h3>
          <p className="text-3xl font-bold text-blue-700">{summaryData.employeeCount}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800 mb-2 flex items-center">
            <Clock size={16} className="mr-1" />
            В целом за месяц
          </h3>
          <p className="text-3xl font-bold text-green-700">
            {summaryData.totalWorkDays}
            <span className="text-sm font-normal ml-1">дней</span>
          </p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">В выходные и нерабочие праздничные дни</h3>
          <p className="text-3xl font-bold text-yellow-700">
            {summaryData.totalWeekends}
            <span className="text-sm font-normal ml-1">дней</span>
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-800 mb-2">Сверх установленной продолжительности рабочего времени</h3>
          <p className="text-3xl font-bold text-purple-700">
            {summaryData.totalOvertimeHours}
            <span className="text-sm font-normal ml-1">ч</span>
          </p>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Продолжительность отдыха, превышающая продолжительность смены</h3>
          <p className="text-2xl font-bold text-gray-900">
            {summaryData.totalDayOffs}
            <span className="text-sm font-normal ml-1">дней</span>
          </p>
        </div>
      </div>
    </div>
  );
};
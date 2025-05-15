import React, { useState, useEffect } from 'react';
import { FileUploader } from './components/FileUploader';
import { DataGrid } from './components/DataGrid';
import { MonthSelector } from './components/MonthSelector';
import { Summary } from './components/Summary';
import { CalculateButton } from './components/CalculateButton';
import { FileDownloader } from './components/FileDownloader';
import { AppHeader } from './components/AppHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { parseExcelFile, exportToExcel } from './utils/excelUtils';
import { calculateSummaries } from './utils/calculationUtils';
import { Employee, AttendanceRecord } from './types';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hasChanges, setHasChanges] = useState(false);
  const [lastDayOfMonth, setLastDayOfMonth] = useState<number>(0);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    setLastDayOfMonth(lastDay);
  }, [selectedMonth, selectedYear]);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const data = await parseExcelFile(file);
      setEmployees(data);
      toast.success('Файл успешно загружен');
      setHasChanges(true);
      setIsCalculated(false);
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при чтении файла');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCellChange = (
    employeeId: number,
    day: number,
    value: string
  ) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) => {
        if (employee.id === employeeId) {
          const updatedAttendance = { ...employee.attendance };
          updatedAttendance[day] = value.toUpperCase();
          return { ...employee, attendance: updatedAttendance };
        }
        return employee;
      })
    );
    setHasChanges(true);
    setIsCalculated(false);
  };

  const handleCalculate = () => {
    if (employees.length === 0) {
      toast.warn('Нет данных для расчета');
      return;
    }

    setIsLoading(true);
    try {
      const employeesWithSummaries = calculateSummaries(
        employees,
        lastDayOfMonth
      );
      setEmployees(employeesWithSummaries);
      toast.success('Расчеты успешно выполнены');
      setIsCalculated(true);
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при расчете');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (employees.length === 0) {
      toast.warn('Нет данных для экспорта');
      return;
    }

    if (!isCalculated) {
      toast.warn('Сначала выполните расчет');
      return;
    }

    try {
      exportToExcel(employees, selectedMonth, selectedYear);
      toast.success('Файл успешно экспортирован');
    } catch (error) {
      console.error(error);
      toast.error('Ошибка при экспорте файла');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Загрузка данных</h2>
            <FileUploader onFileUpload={handleFileUpload} isLoading={isLoading} />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Период</h2>
            <MonthSelector 
              selectedMonth={selectedMonth} 
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Действия</h2>
            <div className="flex flex-col space-y-4">
              <CalculateButton 
                onClick={handleCalculate} 
                isLoading={isLoading}
                disabled={employees.length === 0}
              />
              <FileDownloader 
                onClick={handleExport} 
                disabled={!isCalculated || employees.length === 0} 
              />
            </div>
          </div>
        </div>

        {employees.length > 0 && (
          <>
            <Summary 
              employees={employees} 
              lastDayOfMonth={lastDayOfMonth}
              isCalculated={isCalculated}
            />
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-8 overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">Данные сотрудников</h2>
              <DataGrid 
                employees={employees} 
                lastDayOfMonth={lastDayOfMonth}
                onCellChange={handleCellChange}
              />
            </div>
          </>
        )}
      </main>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
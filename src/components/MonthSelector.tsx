import React from 'react';

interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}) => {
  const months = [
    { name: 'Январь', value: 0 },
    { name: 'Февраль', value: 1 },
    { name: 'Март', value: 2 },
    { name: 'Апрель', value: 3 },
    { name: 'Май', value: 4 },
    { name: 'Июнь', value: 5 },
    { name: 'Июль', value: 6 },
    { name: 'Август', value: 7 },
    { name: 'Сентябрь', value: 8 },
    { name: 'Октябрь', value: 9 },
    { name: 'Ноябрь', value: 10 },
    { name: 'Декабрь', value: 11 },
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">
          Месяц
        </label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-1">
          Год
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 py-2 px-3 bg-blue-50 border border-blue-100 rounded-md">
        <p className="text-sm text-blue-800">
          Выбрано: <strong>{months[selectedMonth].name} {selectedYear}</strong>
          <br />
          Количество дней: <strong>{new Date(selectedYear, selectedMonth + 1, 0).getDate()}</strong>
        </p>
      </div>
    </div>
  );
};
import { Employee, SummaryData, AttendanceRecord } from '../types';

const STANDARD_WORK_HOURS = 8; // Standard work day hours
const OVERTIME_MULTIPLIER = 1.5; // Overtime pay multiplier
const WEEKEND_MULTIPLIER = 2.0; // Weekend pay multiplier

// Function to calculate if a given day is a weekend
const isWeekend = (year: number, month: number, day: number): boolean => {
  const date = new Date(year, month, day);
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday
};

export const calculateSummaries = (
  employees: Employee[],
  lastDayOfMonth: number,
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth()
): Employee[] => {
  // Create a copy of employees to avoid mutating the original
  return employees.map(employee => {
    const summary = calculateEmployeeSummary(employee.attendance, lastDayOfMonth, year, month);
    return {
      ...employee,
      summary
    };
  });
};

export const calculateEmployeeSummary = (
  attendance: AttendanceRecord,
  lastDayOfMonth: number,
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth()
): SummaryData => {
  let totalWorkDays = 0;
  let totalWeekends = 0;
  let totalWorkedWeekends = 0;
  let totalDayOffs = 0;
  let totalHours = 0;
  let overtimeHours = 0;
  let weekendHours = 0;

  // Process each day in the month
  for (let day = 1; day <= lastDayOfMonth; day++) {
    const code = attendance[day] || '';
    const dayIsWeekend = isWeekend(year, month, day);

    if (dayIsWeekend) {
      totalWeekends++;
    }

    switch (code) {
      case 'Я': // Regular work day
        totalWorkDays++;
        totalHours += STANDARD_WORK_HOURS;
        break;
      case 'ОВ': // Day off for previously worked time
        totalDayOffs++;
        break;
      case 'В': // Weekend
        // No additional calculation needed, already counted in totalWeekends
        break;
      case 'РВ': // Work on a weekend/day off
        if (dayIsWeekend) {
          totalWorkedWeekends++;
          weekendHours += STANDARD_WORK_HOURS;
        } else {
          // If РВ on a workday, it's overtime
          overtimeHours += STANDARD_WORK_HOURS;
        }
        totalHours += STANDARD_WORK_HOURS;
        break;
      default:
        // Handle empty or invalid codes
        if (dayIsWeekend) {
          // If no code on a weekend, assume it's a regular weekend (В)
        } else {
          // If no code on a workday, don't count it
        }
    }
  }

  return {
    totalWorkDays,
    totalWeekends,
    totalWorkedWeekends,
    totalDayOffs,
    totalHours,
    overtimeHours,
    weekendHours
  };
};
export interface AttendanceRecord {
  [day: number]: string;
}

export interface SummaryData {
  totalWorkDays: number;
  totalWeekends: number;
  totalWorkedWeekends: number;
  totalDayOffs: number;
  totalHours: number;
  overtimeHours: number;
  weekendHours: number;
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  attendance: AttendanceRecord;
  summary?: SummaryData;
}

export type AttendanceCode = 'Я' | 'ОВ' | 'В' | 'РВ' | string;

export interface MonthData {
  name: string;
  value: number;
}
import { read, utils, writeFile } from 'xlsx';
import { Employee, AttendanceRecord } from '../types';

interface ExcelRow {
  [key: string]: string | number;
}

// Parse Excel file and convert to our application data structure
export const parseExcelFile = async (file: File): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = read(data, { type: 'binary' });
        
        // Assuming the first sheet contains our data
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = utils.sheet_to_json<ExcelRow>(worksheet, { 
          header: 'A',
          blankrows: false,
          range: 10 // Start from row 10 to skip headers
        });
        
        // Transform data to our format
        const employees: Employee[] = [];
        let currentEmployee: Employee | null = null;
        
        // Process each row in the Excel file
        jsonData.forEach((row) => {
          // Check if this is an employee row by looking for employee number in column A
          if (row['A'] && typeof row['A'] === 'number') {
            if (currentEmployee) {
              employees.push(currentEmployee);
            }
            
            currentEmployee = {
              id: row['A'] as number,
              name: String(row['B'] || '').trim(),
              position: String(row['B'] || '').split(',').slice(1).join(',').trim(),
              attendance: {}
            };
          }
        });
        
        // Add the last employee
        if (currentEmployee) {
          employees.push(currentEmployee);
        }
        
        // Process attendance data for each employee
        employees.forEach((employee) => {
          // Find corresponding rows in Excel
          const employeeRows = jsonData.filter(row => 
            row['A'] === employee.id || 
            (row['A'] === undefined && row['C'] !== undefined)
          );
          
          employeeRows.forEach(row => {
            // Process each day column (starting from column D)
            for (let i = 1; i <= 31; i++) {
              const colIndex = String.fromCharCode(67 + i); // Start from column D
              if (row[colIndex]) {
                employee.attendance[i] = String(row[colIndex]).toUpperCase();
              }
            }
          });
        });
        
        resolve(employees);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
};

// Export data to Excel file
export const exportToExcel = (
  employees: Employee[],
  month: number,
  year: number
) => {
  // Prepare headers
  const headers = [
    ['№ п/п', 'Ф.И.О., звание, должность', '', ''],
    ['', '', 'время', ''],
    ['', '', 'часы', ''],
    ['', '', 'из них ночные', '']
  ];
  
  // Add day numbers
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  headers[0].push(...days.map(String));
  
  // Add summary columns
  headers[0].push(
    'В целом за месяц',
    'В выходные и нерабочие праздничные дни',
    'Сверх установленной продолжительности рабочего времени',
    'Продолжительность отдыха, превышающая продолжительность смены'
  );
  
  // Prepare data rows
  const rows: any[][] = [];
  employees.forEach((employee) => {
    // Add employee rows
    rows.push(
      [employee.id, employee.name, 'время', ''],
      ['', '', 'часы', ''],
      ['', '', 'из них ночные', '']
    );
    
    // Add attendance data
    const attendanceRow = days.map(day => employee.attendance[day] || '');
    rows[rows.length - 3].push(...attendanceRow);
    
    // Add summary data if available
    if (employee.summary) {
      rows[rows.length - 3].push(
        employee.summary.totalWorkDays,
        employee.summary.totalWeekends,
        employee.summary.overtimeHours,
        employee.summary.totalDayOffs
      );
    }
  });
  
  // Create worksheet
  const worksheet = utils.aoa_to_sheet([...headers, ...rows]);
  
  // Create workbook and add the worksheet
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Учет рабочего времени');
  
  // Generate Excel file
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  
  writeFile(workbook, `Учет_рабочего_времени_${monthNames[month]}_${year}.xlsx`);
};

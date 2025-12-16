import { DayData, MarkedDates } from "./types";

const formatDateString = (year: number, month: number, day: number): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const getDateId = (year: number, month: number, day: number) => `date-${year}-${month}-${day}`;

const getStableDots = (day: number, month: number, year: number, colors: string[]): string[] => {
  if (!colors || colors.length === 0) return [];

  const seed = Math.sin(year * 10000 + month * 100 + day) * 10000;
  const rand = seed - Math.floor(seed);
  
  if (rand > 0.4) return [];
  
  const numDots = Math.floor((rand * 10) % 3) + 1;
  const dots: string[] = [];
  
  for (let i = 0; i < numDots; i++) {
    const colorIndex = Math.floor((rand * 100 * (i + 1))) % colors.length;
    dots.push(colors[colorIndex]);
  }
  return dots;
};

// --- CONFIG INTERFACE ---
interface GenerationConfig {
  firstDayOfWeek?: 0 | 1;
  markedDates?: MarkedDates;
  showRandomDots?: boolean;
  themeColors?: string[];
  disabledDates?: string[];
  shouldDisableDate?: (date: string) => boolean;
  minDate?: string;
  maxDate?: string;
}

// --- UPDATED FUNCTION SIGNATURE ---
const generateMonthData = (
  month: number, 
  year: number, 
  config: GenerationConfig = {} 
): DayData[] => {
  
  // Destructure config with defaults
  const {
    firstDayOfWeek = 0,
    markedDates,
    showRandomDots,
    themeColors,
    disabledDates,
    shouldDisableDate,
    minDate,
    maxDate
  } = config;

  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayObj = new Date(year, month, 1);
  const startDay = firstDayObj.getDay(); // 0=Sun, 1=Mon...
  
  let padding = startDay - firstDayOfWeek;
  if (padding < 0) padding += 7;

  const daysArray: DayData[] = [];
  const prevMonthDays = new Date(year, month, 0).getDate();

  // 1. Previous Month Padding
  for (let i = 0; i < padding; i++) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    daysArray.unshift({
      day: d,
      currentMonth: false,
      id: getDateId(y, m, d),
      year: y,
      month: m,
      dots: [],
      isDisabled: true
    });
  }

  // 2. Current Month Days
  for (let i = 1; i <= totalDays; i++) {
    const dateStr = formatDateString(year, month, i);
    
    // Check constraints
    let isDisabled = false;
    
    if (disabledDates?.includes(dateStr)) isDisabled = true;
    
    if (!isDisabled) {
        if (minDate && dateStr < minDate) isDisabled = true; 
        if (maxDate && dateStr > maxDate) isDisabled = true;
    }

    if (!isDisabled && shouldDisableDate) {
        if (shouldDisableDate(dateStr)) isDisabled = true;
    }

    // Dots Logic
    let dots: string[] = [];
    if (markedDates && markedDates[dateStr]) {
        dots = markedDates[dateStr].dots;
    } else if (showRandomDots && themeColors && !isDisabled) {
        dots = getStableDots(i, month, year, themeColors);
    }

    daysArray.push({
      day: i,
      currentMonth: true,
      id: getDateId(year, month, i),
      year,
      month,
      dots,
      isDisabled
    });
  }

  // 3. Next Month Padding
  const remainingSlots = 42 - daysArray.length;
  for (let i = 1; i <= remainingSlots; i++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    daysArray.push({
      day: i,
      currentMonth: false,
      id: getDateId(y, m, i),
      year: y,
      month: m,
      dots: [],
      isDisabled: true
    });
  }
  return daysArray;
};

export { formatDateString, getDateId, generateMonthData, getStableDots };
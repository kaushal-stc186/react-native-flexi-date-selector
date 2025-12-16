import { ImageSourcePropType, TextStyle, ViewStyle } from "react-native";

export interface DayData {
  day: number;
  currentMonth: boolean;
  id: string;
  year: number;
  month: number;
  dots: string[];
  isDisabled?: boolean;
}

export interface MonthData {
  monthIndex: number;
  year: number;
  key: string;
}

export interface DateState {
  day: number;
  month: number;
  year: number;
}

// Map of date string (YYYY-MM-DD) to dot colors
export interface MarkedDates {
  [date: string]: {
    dots: string[];
  };
}

export interface DatePickerPreset {
  label: string;
  date: string; // YYYY-MM-DD
}

export interface DatePickerTheme {
  primary?: string;
  primarySoft?: string;
  bg?: string;
  bgSoft?: string;
  red?: string;
  textMain?: string;
  textSec?: string;
  border?: string;
  white?: string;
  disabled?: string;
  dots?: string[];
}

export interface DatePickerLabels {
  title?: string;        // Replaces "Selected Date"
  selectYear?: string;   // "Select Year"
  selectMonth?: string;  // "Select Month"
  confirm?: string;      // "Confirm"
  cancel?: string;       // "Close"
  btnEdit?: string;      // "Edit"
  btnCancelEdit?: string;// "Cancel"
  noDate?: string;       // "No date selected"
}

export interface DatePickerLocale {
  monthNames: string[];      
  monthNamesShort: string[]; 
  dayNamesShort: string[];   
}

export interface DatePickerStyles {
  modalContainer?: ViewStyle;
  pickerContainer?: ViewStyle;
  footerContainer?: ViewStyle;
  
  topHeaderContainer?: ViewStyle;
  navHeaderContainer?: ViewStyle;
  weekHeaderContainer?: ViewStyle;
  headerLabel?: TextStyle;
  selectedDateText?: TextStyle;

  dayContainer?: ViewStyle;
  selectedDayContainer?: ViewStyle;
  dayText?: TextStyle;
  selectedDayText?: TextStyle;
  
  yearItem?: ViewStyle;
  monthItem?: ViewStyle;
  
  confirmButton?: ViewStyle;
  cancelButton?: ViewStyle;
  applyButton?: ViewStyle;
  presetContainer?: ViewStyle;
  presetButton?: ViewStyle;
  presetButtonActive?: ViewStyle;
  presetText?: TextStyle;
  presetTextActive?: TextStyle;
}

export interface DatePickerProps {
  isVisible?: boolean;
  onClose?: () => void;
  onChange?: (date: string) => void;
  onConfirm?: (date: string) => void;
  
  // Logic
  initialDate?: string; // YYYY-MM-DD
  minDate?: string;
  maxDate?: string;
  disabledDates?: string[];
  shouldDisableDate?: (date: string) => boolean; 
  firstDayOfWeek?: 0 | 1; // 0 = Sunday, 1 = Monday
  
  // Dots / Markers
  markedDates?: MarkedDates;
  showRandomDots?: boolean;

  // Text & Localization
  title?: string;
  labels?: DatePickerLabels;
  locale?: DatePickerLocale;

  // Styling
  theme?: DatePickerTheme;
  customStyles?: DatePickerStyles;
  customIcons?: {
    next?: ImageSourcePropType;
    prev?: ImageSourcePropType;
  };
  showPresets?: boolean;
  presets?: DatePickerPreset[];
}
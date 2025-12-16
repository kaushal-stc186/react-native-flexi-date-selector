import { Dimensions } from "react-native";
import { s } from "react-native-size-matters";

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const DEFAULT_THEME = {
  primary: '#6236FF',
  primarySoft: '#E0E7FF',
  bg: '#FFFFFF',
  bgSoft: '#F3F4F6',
  red: "red",
  textMain: '#1F2937',
  textSec: '#9CA3AF',
  border: '#F3F4F6',
  white: '#FFFFFF',
  disabled: '#D1D5DB',
  dots: ['#FF4D4D', '#70A1FF', '#2ED573', '#FFA502'],
};

const LAYOUT_CONFIG = {
  modalOpacity: 0.4,
  startYear: 1950,
  endYear: 2050,
  containerWidthPct: 0.95,
  paddingRaw: 12, // We will process this below
};

const SCREEN_WIDTH = Dimensions.get('window').width;

// 1. Force integer container width
const CONTAINER_WIDTH = Math.round(SCREEN_WIDTH * LAYOUT_CONFIG.containerWidthPct);

// 2. Force integer padding
const PADDING_X = Math.round(s(LAYOUT_CONFIG.paddingRaw));

// 3. Calculate exact content width (Integer - Integer - Integer)
const ACTUAL_CONTENT_WIDTH = CONTAINER_WIDTH - (PADDING_X * 2);

// 4. Calculate item width
const ITEM_WIDTH = Math.floor(ACTUAL_CONTENT_WIDTH / 7);

const YEAR_ITEM_CONTENT_SIZE = 80;
const YEAR_ITEM_GAP = 10; 
const YEAR_ITEM_TOTAL_WIDTH = s(YEAR_ITEM_CONTENT_SIZE + YEAR_ITEM_GAP);

export {
  DEFAULT_THEME, 
  LAYOUT_CONFIG, 
  SCREEN_WIDTH, 
  CONTAINER_WIDTH, 
  ACTUAL_CONTENT_WIDTH, 
  PADDING_X,
  ITEM_WIDTH, 
  YEAR_ITEM_CONTENT_SIZE, 
  YEAR_ITEM_GAP, 
  YEAR_ITEM_TOTAL_WIDTH, 
  WEEKDAYS, 
  MONTHS_FULL, 
  MONTHS_SHORT
};
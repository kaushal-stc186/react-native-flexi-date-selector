import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ListRenderItem,
  Image,
  Platform,
  UIManager,
  LayoutAnimation,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Modal from 'react-native-modal';
import { images } from './images';
import { DatePickerProps, DatePickerStyles, DateState, DayData, MonthData } from './types';
import { 
  ACTUAL_CONTENT_WIDTH, 
  DEFAULT_THEME, 
  LAYOUT_CONFIG, 
  MONTHS_FULL, 
  MONTHS_SHORT, 
  WEEKDAYS, 
  YEAR_ITEM_TOTAL_WIDTH 
} from './constants';
import { styles } from './styles';
import { formatDateString, generateMonthData, getDateId } from './helpers';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- DAY CELL COMPONENT ---
const DayCell = React.memo(({ 
  item, 
  isSelected, 
  onPress, 
  colors,
  customStyles 
}: { 
  item: DayData; 
  isSelected: boolean; 
  onPress: (item: DayData) => void;
  colors: typeof DEFAULT_THEME;
  customStyles?: DatePickerStyles;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item)}
      disabled={!item.currentMonth || item.isDisabled}
      style={[
        styles.dayContainer,
        { backgroundColor: colors.bg },
        customStyles?.dayContainer,
        isSelected && { backgroundColor: colors.primary },
        isSelected && customStyles?.selectedDayContainer,
        item.isDisabled && styles.disabledDayContainer
      ]}
    >
      <Text style={[
        styles.dayText,
        { color: item.currentMonth ? colors.textMain : colors.bgSoft },
        customStyles?.dayText,
        item.isDisabled && { color: colors.disabled },
        isSelected && { color: colors.white, fontWeight: 'bold' },
        isSelected && customStyles?.selectedDayText
      ]}>
        {item.day}
      </Text>
      
      {/* DOTS INDICATOR */}
      <View style={styles.dotsContainer}>
        {item.currentMonth && !item.isDisabled && item.dots.length > 0 && (
          <>
             {item.dots.map((color, index) => (
                <View 
                  key={index} 
                  style={[styles.dot, { backgroundColor: isSelected ? colors.white : color }]} 
                />
             ))}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
});

// --- MAIN COMPONENT ---
const DatePicker = ({ 
  isVisible = true, 
  onClose, 
  onChange, 
  onConfirm, 
  
  // Logic
  initialDate,
  disabledDates,
  shouldDisableDate,
  minDate,
  maxDate,
  markedDates,
  showRandomDots = false,
  firstDayOfWeek = 1, 

  // Features
  showPresets = false,
  presets = [],

  // Text / I18n
  title = "Selected Date",
  labels,
  locale,

  // Styling
  theme,
  customStyles,
  customIcons
}: DatePickerProps) => {
  
  const colors = useMemo(() => ({ ...DEFAULT_THEME, ...theme }), [theme]);

  const monthNames = locale?.monthNames || MONTHS_FULL;
  const monthNamesShort = locale?.monthNamesShort || MONTHS_SHORT;
  const daysShort = locale?.dayNamesShort || WEEKDAYS; 
  
  const uiLabels = {
    selectYear: "Select Year",
    selectMonth: "Select Month",
    confirm: "Confirm",
    cancel: "Close",
    edit: "Edit",
    cancelEdit: "Cancel",
    noDate: "No date selected",
    ...labels
  };

  const weekHeaderData = useMemo(() => {
    if (firstDayOfWeek === 1) return daysShort; 
    const last = daysShort[daysShort.length - 1];
    const rest = daysShort.slice(0, daysShort.length - 1);
    return [last, ...rest];
  }, [daysShort, firstDayOfWeek]);

  // State
  const [selectedDate, setSelectedDate] = useState<DateState | null>(null);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSelection, setPickerSelection] = useState({ month: 0, year: new Date().getFullYear() });
  
  const flatListRef = useRef<FlatList>(null);
  const yearListRef = useRef<FlatList>(null);
  const isProgrammaticScroll = useRef(false);

  // --- LIMITS ---
  const { effectiveStartYear, effectiveEndYear } = useMemo(() => {
    const start = minDate ? parseInt(minDate.split('-')[0], 10) : LAYOUT_CONFIG.startYear;
    const end = maxDate ? parseInt(maxDate.split('-')[0], 10) : LAYOUT_CONFIG.endYear;
    return { effectiveStartYear: start, effectiveEndYear: end };
  }, [minDate, maxDate]);

  // --- DATA GENERATION ---
  const monthsData = useMemo<MonthData[]>(() => {
    const data: MonthData[] = [];
    const minMonthIndex = minDate ? parseInt(minDate.split('-')[1], 10) - 1 : 0;
    const maxMonthIndex = maxDate ? parseInt(maxDate.split('-')[1], 10) - 1 : 11;

    for (let y = effectiveStartYear; y <= effectiveEndYear; y++) {
      const startM = (y === effectiveStartYear) ? minMonthIndex : 0;
      const endM = (y === effectiveEndYear) ? maxMonthIndex : 11;
      for (let m = startM; m <= endM; m++) {
        data.push({ monthIndex: m, year: y, key: `${y}-${m}` });
      }
    }
    return data;
  }, [effectiveStartYear, effectiveEndYear, minDate, maxDate]);

  const yearsData = useMemo(() => {
    const years = [];
    for (let y = effectiveStartYear; y <= effectiveEndYear; y++) {
      years.push(y);
    }
    return years;
  }, [effectiveStartYear, effectiveEndYear]);

  // --- INIT ---
  useEffect(() => {
    if (!isVisible) return;

    let targetDate = new Date(); 
    
    if (initialDate) {
      const [y, m, d] = initialDate.split('-').map(Number);
      targetDate = new Date(y, m - 1, d);
      setSelectedDate({ year: y, month: m - 1, day: d });
    } else if (!selectedDate && minDate) {
         const [y, m, d] = minDate.split('-').map(Number);
         targetDate = new Date(y, m - 1, d);
    }

    let targetYear = targetDate.getFullYear();
    let targetMonth = targetDate.getMonth();

    if (minDate) {
        const [y, m] = minDate.split('-').map(Number);
        if (targetYear < y || (targetYear === y && targetMonth < m - 1)) {
            targetYear = y; targetMonth = m - 1;
        }
    }
    if (maxDate) {
        const [y, m] = maxDate.split('-').map(Number);
        if (targetYear > y || (targetYear === y && targetMonth > m - 1)) {
            targetYear = y; targetMonth = m - 1;
        }
    }

    const index = monthsData.findIndex(d => d.year === targetYear && d.monthIndex === targetMonth);
    const finalIndex = index !== -1 ? index : 0;
    
    setDisplayedIndex(finalIndex);
    
    setTimeout(() => {
        isProgrammaticScroll.current = true;
        flatListRef.current?.scrollToIndex({ index: finalIndex, animated: false });
        setTimeout(() => { isProgrammaticScroll.current = false; }, 200);
    }, 100);
  }, [isVisible, initialDate, monthsData, minDate, maxDate]);

  // Sync Picker
  useEffect(() => {
    if (isPickerOpen) {
      const currentData = monthsData[displayedIndex];
      const safeData = currentData || monthsData[0];
      
      const targetYear = safeData ? safeData.year : new Date().getFullYear();
      const targetMonth = safeData ? safeData.monthIndex : new Date().getMonth();

      setPickerSelection({ month: targetMonth, year: targetYear });
      
      setTimeout(() => {
        const yearIndex = yearsData.indexOf(targetYear);
        if (yearIndex !== -1) {
          yearListRef.current?.scrollToIndex({ index: yearIndex, animated: false, viewPosition: 0.5 });
        }
      }, 50);
    }
  }, [isPickerOpen, displayedIndex, monthsData, yearsData]);

  // --- HANDLERS ---
  const handleDayPress = useCallback((item: DayData) => {
    if (!item.currentMonth || item.isDisabled) return;
    
    // Deselect if same
    const isSameDate = selectedDate && 
      selectedDate.day === item.day && 
      selectedDate.month === item.month && 
      selectedDate.year === item.year;

    if (isSameDate) {
      setSelectedDate(null);
      if (onChange) onChange(""); 
    } else {
      setSelectedDate({ day: item.day, month: item.month, year: item.year });
      const dateStr = formatDateString(item.year, item.month, item.day);
      if (onChange) onChange(dateStr);
    }
  }, [selectedDate, onChange]);

  const handlePresetPress = (presetDate: string) => {
    const [y, m, d] = presetDate.split('-').map(Number);
    // Month in JS is 0-indexed, but input string YYYY-MM-DD usually has 1-indexed months
    // Assuming presetDate follows YYYY-MM-DD standard format
    
    setSelectedDate({ year: y, month: m - 1, day: d });
    
    // Find index
    const targetIndex = monthsData.findIndex(data => data.year === y && data.monthIndex === m - 1);
    if (targetIndex !== -1) {
        setDisplayedIndex(targetIndex);
        setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: targetIndex, animated: true });
        }, 50);
    }

    if (onChange) onChange(presetDate);
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isProgrammaticScroll.current) return;

    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ACTUAL_CONTENT_WIDTH);
    if (index !== displayedIndex && index >= 0 && index < monthsData.length) {
      setDisplayedIndex(index);
    }
  };

  const handleNextMonth = () => {
    if (displayedIndex < monthsData.length - 1) {
      isProgrammaticScroll.current = true; 
      const nextIndex = displayedIndex + 1;
      setDisplayedIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setTimeout(() => { isProgrammaticScroll.current = false; }, 500); 
    }
  };

  const handlePrevMonth = () => {
    if (displayedIndex > 0) {
      isProgrammaticScroll.current = true; 
      const prevIndex = displayedIndex - 1;
      setDisplayedIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
      setTimeout(() => { isProgrammaticScroll.current = false; }, 500); 
    }
  };

  const togglePicker = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsPickerOpen(!isPickerOpen);
  };

  const handleApplyPicker = () => {
    const indexToScroll = monthsData.findIndex(
        d => d.year === pickerSelection.year && d.monthIndex === pickerSelection.month
    );
    if (indexToScroll !== -1) {
      isProgrammaticScroll.current = true;
      setDisplayedIndex(indexToScroll);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsPickerOpen(false);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: indexToScroll, animated: false });
        setTimeout(() => { isProgrammaticScroll.current = false; }, 200);
      }, 50);
    } else {
        setIsPickerOpen(false);
    }
  };

  const handleConfirmDate = () => {
    if (selectedDate && onConfirm) {
      const dateStr = formatDateString(selectedDate.year, selectedDate.month, selectedDate.day);
      onConfirm(dateStr);
    }
  };

  // --- RENDER ---
  const renderMonthItem = useCallback(({ item }: { item: MonthData }) => {
    const days = generateMonthData(
      item.monthIndex, 
      item.year,
      {
        firstDayOfWeek,
        markedDates,
        showRandomDots,
        themeColors: colors.dots, 
        disabledDates,
        shouldDisableDate,
        minDate,
        maxDate
      }
    );
    const selectedId = selectedDate ? getDateId(selectedDate.year, selectedDate.month, selectedDate.day) : null;

    return (
      <View key={item.key} style={styles.monthSlideContainer}>
        <View style={styles.daysGrid}>
          {days.map((dayItem) => {
            const isSelected = selectedId === dayItem.id && dayItem.currentMonth;
            return (
              <View key={dayItem.id} style={styles.gridItemWrapper}>
                <DayCell 
                  item={dayItem} 
                  isSelected={isSelected} 
                  onPress={handleDayPress} 
                  colors={colors}
                  customStyles={customStyles}
                />
              </View>
            );
          })}
        </View>
      </View>
    );
  }, [
    firstDayOfWeek, markedDates, showRandomDots, colors.dots, 
    disabledDates, shouldDisableDate, minDate, maxDate, 
    selectedDate, colors, customStyles, handleDayPress
  ]);

  const currentViewData = monthsData[displayedIndex] || { monthIndex: 0, year: 2024 };
  const isPrevDisabled = displayedIndex <= 0;
  const isNextDisabled = displayedIndex >= monthsData.length - 1;

  return (
    <Modal 
      isVisible={isVisible} 
      style={styles.modal} 
      backdropOpacity={LAYOUT_CONFIG.modalOpacity}
      onBackdropPress={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.bg, borderColor: colors.border }, customStyles?.modalContainer]}>

        {/* HEADER */}
        <View style={[styles.topHeader, { borderColor: colors.border }, customStyles?.topHeaderContainer]}>
          <View>
            <Text style={[styles.label, { color: colors.textSec }, customStyles?.headerLabel]}>
              {title}
            </Text>
            <Text style={[
              styles.selectedDateText, 
              { color: selectedDate ? colors.textMain : colors.textSec },
              customStyles?.selectedDateText
            ]}>
              {selectedDate
                ? `${monthNames[selectedDate.month]} ${selectedDate.day}, ${selectedDate.year}`
                : uiLabels.noDate
              }
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.editButton,
              { backgroundColor: isPickerOpen ? colors.primarySoft : colors.bgSoft }
            ]}
            onPress={togglePicker}
          >
            <Text style={[
              styles.editButtonText,
              { color: isPickerOpen ? colors.primary : colors.textMain }
            ]}>
              {isPickerOpen ? uiLabels.cancelEdit : uiLabels.edit}
            </Text>
          </TouchableOpacity>
        </View>

        {/* PRESETS (Visible only when calendar grid is active, not during edit year/month) */}
        {showPresets && presets.length > 0 && !isPickerOpen && (
           <View style={[styles.presetsWrapper, { borderColor: colors.border }, customStyles?.presetContainer]}>
             <FlatList
               horizontal
               data={presets}
               keyExtractor={(item) => item.label}
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={styles.presetsScrollContent}
               renderItem={({ item }) => {
                 const isSelected = selectedDate && 
                    formatDateString(selectedDate.year, selectedDate.month, selectedDate.day) === item.date;

                 return (
                   <TouchableOpacity
                     style={[
                       styles.presetButton,
                       { 
                         backgroundColor: isSelected ? colors.primarySoft : colors.bg,
                         borderColor: isSelected ? colors.primary : colors.border 
                       },
                       customStyles?.presetButton,
                       isSelected && customStyles?.presetButtonActive
                     ]}
                     onPress={() => handlePresetPress(item.date)}
                   >
                     <Text style={[
                       styles.presetText,
                       { color: isSelected ? colors.primary : colors.textMain },
                       customStyles?.presetText,
                       isSelected && customStyles?.presetTextActive
                     ]}>
                       {item.label}
                     </Text>
                   </TouchableOpacity>
                 );
               }}
             />
           </View>
        )}

        {isPickerOpen ? (
          // --- YEAR / MONTH PICKER ---
          <View style={[styles.pickerContainer, customStyles?.pickerContainer]}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.textSec }]}>{uiLabels.selectYear}</Text>
              <FlatList
                ref={yearListRef}
                data={yearsData}
                horizontal
                keyExtractor={(item) => item.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.yearListContent}
                getItemLayout={(_, index) => ({ 
                    length: YEAR_ITEM_TOTAL_WIDTH, 
                    offset: YEAR_ITEM_TOTAL_WIDTH * index, 
                    index 
                })}
                renderItem={({ item }) => {
                  const isSelected = pickerSelection.year === item;
                  return (
                    <View style={styles.yearCarouselItemWrapper}>
                        <TouchableOpacity
                        style={[
                            styles.yearCarouselItemInner,
                            { 
                                backgroundColor: isSelected ? colors.primarySoft : colors.bg,
                                borderColor: isSelected ? colors.primary : colors.border
                            },
                            customStyles?.yearItem
                        ]}
                        onPress={() => setPickerSelection(prev => ({ ...prev, year: item }))}
                        >
                        <Text style={[
                            styles.yearCarouselText,
                            { color: isSelected ? colors.primary : colors.textSec }
                        ]}>{item}</Text>
                        </TouchableOpacity>
                    </View>
                  )
                }}
              />
            </View>

            <View>
              <Text style={[styles.sectionTitle, { color: colors.textSec }]}>{uiLabels.selectMonth}</Text>
              <View style={styles.monthsGrid}>
                {monthNamesShort.map((m, index) => {
                  const isSelected = pickerSelection.month === index;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.monthGridItem,
                        {
                          backgroundColor: isSelected ? colors.primarySoft : colors.bg,
                          borderColor: isSelected ? colors.primary : colors.border
                        },
                        customStyles?.monthItem
                      ]}
                      onPress={() => setPickerSelection(prev => ({ ...prev, month: index }))}
                    >
                      <Text style={[
                        styles.monthGridText,
                        { color: isSelected ? colors.primary : colors.textSec }
                      ]}>{m}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <TouchableOpacity 
              style={[
                styles.applyButton, 
                { backgroundColor: colors.primary },
                customStyles?.applyButton
              ]} 
              onPress={handleApplyPicker}
            >
              <Text style={[styles.applyButtonText, { color: colors.white }]}>{uiLabels.confirm}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // --- CALENDAR GRID ---
          <>
            <View style={[styles.navHeader, customStyles?.navHeaderContainer]}>
              <TouchableOpacity 
                onPress={handlePrevMonth} 
                style={[styles.arrowButton, isPrevDisabled && { opacity: 0.3 }]}
                disabled={isPrevDisabled}
              >
                <Image 
                  source={customIcons?.prev || images.previous} 
                  style={[styles.arrowIcon, { tintColor: colors.primary }]} 
                  resizeMode="contain" 
                />
              </TouchableOpacity>

              <Text style={[styles.navTitle, { color: colors.textMain }]}>
                {monthNames[currentViewData.monthIndex]} {currentViewData.year}
              </Text>

              <TouchableOpacity 
                onPress={handleNextMonth} 
                style={[styles.arrowButton, isNextDisabled && { opacity: 0.3 }]}
                disabled={isNextDisabled}
              >
                <Image 
                  source={customIcons?.next || images.next} 
                  style={[styles.arrowIcon, { tintColor: colors.primary }]} 
                  resizeMode="contain" 
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.weekHeader, customStyles?.weekHeaderContainer]}>
              {weekHeaderData.map((day, index) => (
                <Text key={index} style={[styles.weekDayText, { color: colors.textSec }]}>{day}</Text>
              ))}
            </View>

            <FlatList
              ref={flatListRef}
              data={monthsData}
              horizontal={true}
              scrollEnabled={true} 
              pagingEnabled 
              extraData={selectedDate}
              keyExtractor={(item) => item.key}
              renderItem={renderMonthItem}
              getItemLayout={(_, index) => ({ 
                  length: ACTUAL_CONTENT_WIDTH, 
                  offset: ACTUAL_CONTENT_WIDTH * index, 
                  index 
              })}
              onMomentumScrollEnd={handleScrollEnd}
              showsHorizontalScrollIndicator={false}
              style={styles.listStyle}
              initialNumToRender={1}
              maxToRenderPerBatch={2}
              windowSize={3}
              initialScrollIndex={displayedIndex}
            />

            {/* FOOTER */}
            <View style={[styles.footerContainer, { borderColor: colors.border }, customStyles?.footerContainer]}>
              <TouchableOpacity 
                style={[
                    styles.closeButton, 
                    { backgroundColor: colors.bg, borderColor: colors.border },
                    customStyles?.cancelButton
                ]} 
                onPress={onClose}
              >
                <Text style={[styles.closeButtonText, { color: colors.textMain }]}>{uiLabels.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  { 
                      backgroundColor: selectedDate ? colors.primary : colors.disabled,
                  },
                  customStyles?.confirmButton
                ]}
                onPress={handleConfirmDate}
                disabled={!selectedDate}
              >
                <Text style={[styles.applyButtonText, { color: colors.white }]}>{uiLabels.confirm}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

export default DatePicker;
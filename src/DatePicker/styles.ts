import { ScaledSheet } from "react-native-size-matters";
import { 
  ACTUAL_CONTENT_WIDTH, 
  CONTAINER_WIDTH, 
  ITEM_WIDTH, 
  PADDING_X, 
  YEAR_ITEM_CONTENT_SIZE, 
  YEAR_ITEM_TOTAL_WIDTH 
} from "./constants";

export const styles = ScaledSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0, // Functional requirement for Modal to cover screen
  },
  container: {
    width: CONTAINER_WIDTH,
    borderRadius: '20@s',
    padding: PADDING_X,
    paddingBottom: '20@s',
    gap: '12@s', // Controls vertical spacing between Header, Presets, Grid, Footer
    borderWidth: 1,
  },
  
  // --- HEADER ---
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12@s',
    borderBottomWidth: 1,
  },
  label: { fontSize: '11@s', paddingBottom: '2@s' },
  selectedDateText: { fontSize: '15@s', fontWeight: 'bold' },

  editButton: { 
    paddingHorizontal: '12@s', 
    paddingVertical: '6@s', 
    borderRadius: '20@s' 
  },
  editButtonText: { fontWeight: '600', fontSize: '11@s' },

  // --- PRESETS ---
  presetsWrapper: {
    paddingBottom: '12@s',
    borderBottomWidth: 1,
    // Removed margin, relying on container gap
  },
  presetsScrollContent: {
    paddingHorizontal: '4@s',
    gap: '8@s', // Spacing between preset buttons
  },
  presetButton: {
    paddingHorizontal: '12@s',
    paddingVertical: '6@s',
    borderRadius: '16@s',
    borderWidth: 1,
  },
  presetText: {
    fontSize: '12@s',
    fontWeight: '600',
  },

  // --- NAVIGATION HEADER (Month/Year Arrows) ---
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5@s',
  },
  navTitle: { fontSize: '17@s', fontWeight: 'bold' },
  arrowButton: { padding: '8@s' },
  arrowIcon: { width: '22@s', height: '22@s' },

  // --- DAYS HEADER (S M T W...) ---
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  weekDayText: {
    fontWeight: '600',
    fontSize: '12@s',
    width: ITEM_WIDTH,
    textAlign: 'center',
  },

  // --- CALENDAR GRID ---
  listStyle: { 
    flexGrow: 0,
    width: ACTUAL_CONTENT_WIDTH, 
    alignSelf: 'center',
  },
  monthSlideContainer: { width: ACTUAL_CONTENT_WIDTH },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  
  gridItemWrapper: { 
    width: ITEM_WIDTH, 
    aspectRatio: 1, 
    padding: '3@s',
    justifyContent: 'center',
    alignItems: 'center'
  },

  dayContainer: {
    width: '100%',
    height: '100%',
    borderRadius: '8@s',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledDayContainer: { opacity: 0.3 },
  dayText: { fontSize: '14@s', fontWeight: '500' },
  
  dotsContainer: { flexDirection: 'row', paddingTop: '3@s', height: '8@s', gap: '1.5@s' },
  dot: { width: '3@s', height: '3@s', borderRadius: '1.5@s' },

  // --- YEAR/MONTH PICKER VIEW ---
  pickerContainer: { 
    paddingTop: '5@s', 
    gap: '18@s' 
  },
  sectionTitle: {
    fontSize: '12@s',
    fontWeight: '700',
    paddingBottom: '10@s',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },

  yearListContent: { paddingHorizontal: '4@s' },
  yearCarouselItemWrapper: {
      width: YEAR_ITEM_TOTAL_WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
  },
  yearCarouselItemInner: {
    width: `${YEAR_ITEM_CONTENT_SIZE}@s`,
    height: '38@s',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10@s',
    borderWidth: 1,
  },
  yearCarouselText: { fontSize: '13@s', fontWeight: '500' },

  monthsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    rowGap: '8@s' 
  },
  monthGridItem: {
    width: '31%',
    height: '38@s',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10@s',
    borderWidth: 1,
  },
  monthGridText: { fontSize: '13@s', fontWeight: '500' },

  // --- FOOTER ---
  footerContainer: {
    paddingTop: '5@s',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: '10@s'
  },
  applyButton: {
    paddingVertical: '14@s',
    borderRadius: '12@s',
    alignItems: 'center',
    width: '100%'
  },
  applyButtonText: { fontSize: '14@s', fontWeight: 'bold' },

  closeButton: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: '14@s',
    borderRadius: '12@s',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: '14@s',
    fontWeight: '600'
  },
  confirmButton: {
    flex: 1,
    paddingVertical: '14@s',
    borderRadius: '12@s',
    alignItems: 'center',
  }
});
A flexible, highly customizable Date Picker for React Native. Supports grid view, presets, custom styling, and complex date logic.

## Installation

Install the package via npm or yarn.

```bash
# npm
npm install react-native-flexi-date-selector

# yarn
yarn add react-native-flexi-date-selector
```

## Peer Dependencies

Ensure you have these installed in your project:

- react-native-modal  
- react-native-size-matters  

## Date Format

All date inputs and outputs are strings in the `YYYY-MM-DD` format (e.g., `"2025-01-30"`).

## Usage Examples

Below are common use cases extracted from the official showcase.

### Basic Usage

Simple calendar grid. Returns a `YYYY-MM-DD` string on confirm.

```tsx
import React, { useState } from 'react';
import { Button, View } from 'react-native';
import DatePicker from 'react-native-flexi-date-selector';

const BasicExample = () => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handleConfirm = (date: string) => {
    // date is "YYYY-MM-DD"
    console.log('Selected date:', date);
    setPickerVisible(false);
  };

  return (
    <View>
      <Button title="Pick a Date" onPress={() => setPickerVisible(true)} />
      {isPickerVisible && (
      <DatePicker
        isVisible={isPickerVisible}
        onConfirm={handleConfirm}
        onClose={() => setPickerVisible(false)}
      />)}
    </View>
  );
};

export default BasicExample;
```

### With Presets (New)

Quick-select buttons. Pass an array of `{ label, date }` with `date` in `YYYY-MM-DD`.

```tsx
import React, { useState } from 'react';
import { Button, View } from 'react-native';
import DatePicker, { DatePickerPreset } from 'react-native-flexi-date-selector';

const PresetsExample = () => {
  const [visible, setVisible] = useState(false);

  const presets: DatePickerPreset[] = [
    { label: 'Today',     date: '2025-12-25' },
    { label: 'Tomorrow',  date: '2025-12-26' },
    { label: 'Next Week', date: '2026-01-01' },
  ];

  const onConfirm = (date: string) => {
    console.log('Preset date:', date);
    setVisible(false);
  };

  return (
    <View>
      <Button title="Pick with Presets" onPress={() => setVisible(true)} />
      {visible && (
      <DatePicker
        isVisible={visible}
        showPresets
        presets={presets}
        onConfirm={onConfirm}
        onClose={() => setVisible(false)}
      />)}
    </View>
  );
};

export default PresetsExample;
```

### Blocking Specific Days

Disable weekends using the `shouldDisableDate` prop.

```tsx
import React, { useState } from 'react';
import { Button, View } from 'react-native';
import DatePicker from 'react-native-flexi-date-selector';

const BlockWeekends = () => {
  const [visible, setVisible] = useState(false);

  const disableWeekends = (dateStr: string) => {
    const day = new Date(dateStr).getDay();
    return day === 0 || day === 6; // disable Sunday (0) and Saturday (6)
  };

  return (
    <View>
      <Button title="Pick Workday" onPress={() => setVisible(true)} />
      {visible && (
      <DatePicker
        isVisible={visible}
        shouldDisableDate={disableWeekends}
        onConfirm={(d) => { console.log(d); setVisible(false); }}
        onClose={() => setVisible(false)}
      />)}
    </View>
  );
};

export default BlockWeekends;
```

### Marked Dates (Events)

Show colored dots under dates via the `markedDates` prop.

```tsx
import React, { useState } from 'react';
import { Button, View } from 'react-native';
import DatePicker from 'react-native-flexi-date-selector';

const MarkedDatesExample = () => {
  const [visible, setVisible] = useState(false);

  const events = {
    '2025-01-10': { dots: ['#EF4444'] },
    '2025-01-15': { dots: ['#3B82F6', '#10B981'] },
    '2025-01-20': { dots: ['#F59E0B'] },
  };

  return (
    <View>
      <Button title="Show Events" onPress={() => setVisible(true)} />
      {visible && (
      <DatePicker
        isVisible={visible}
        markedDates={events}
        onConfirm={(date) => { console.log(date); setVisible(false); }}
        onClose={() => setVisible(false)}
      />)}
    </View>
  );
};

export default MarkedDatesExample;
```

### Heavy Customization

Customize theme colors and override styles via `theme` and `customStyles`.

```tsx
import React, { useState } from 'react';
import { Button, View } from 'react-native';
import DatePicker from 'react-native-flexi-date-selector';

const HeavyCustomization = () => {
  const [visible, setVisible] = useState(false);

  const theme = {
    primary:     '#0D9488', // Teal
    primarySoft: '#CCFBF1',
    bg:          '#F0FDFA',
    border:      '#99F6E4',
    textMain:    '#134E4A',
  };

  const customStyles = {
    modalContainer:   { borderRadius: 30, padding: 10, borderWidth: 2, borderColor: '#14B8A6' },
    dayContainer:     { borderRadius: 50, margin: 2 },
    selectedDayContainer: { borderRadius: 50, backgroundColor: '#0F766E' },
    confirmButton:    { borderRadius: 50, backgroundColor: '#0D9488' },
    cancelButton:     { borderRadius: 50, borderWidth: 0 },
    presetButton:     { borderRadius: 20, paddingHorizontal: 20 },
    presetButtonActive: { backgroundColor: '#14B8A6', borderWidth: 0 },
    presetTextActive:   { color: 'white', fontWeight: 'bold' },
  };

  return (
    <View>
      <Button title="Custom Styles" onPress={() => setVisible(true)} />
      {visible && (
      <DatePicker
        isVisible={visible}
        showPresets
        presets={[{ label: 'Today', date: '2025-12-25' }]}
        theme={theme}
        customStyles={customStyles}
        onConfirm={(d) => { console.log(d); setVisible(false); }}
        onClose={() => setVisible(false)}
      />)
    </View>
  );
};

export default HeavyCustomization;
```

## Props Reference

| Prop                   | Type                                                                                                           | Default            | Description                                                                       |
|------------------------|----------------------------------------------------------------------------------------------------------------|--------------------|-----------------------------------------------------------------------------------|
| isVisible              | boolean                                                                                                        | `true`             | Controls picker visibility.                                                       |
| onClose                | () => void                                                                                                     | —                  | Callback when the picker is closed.                                              |
| onConfirm              | (date: string) => void                                                                                         | —                  | Returns selected date as `YYYY-MM-DD`.                                            |
| onChange               | (date: string) => void                                                                                         | —                  | Fires on every date selection.                                                    |
| initialDate            | string (`YYYY-MM-DD`)                                                                                          | —                  | Preselect a date when picker opens.                                               |
| minDate                | string (`YYYY-MM-DD`)                                                                                          | —                  | Earliest selectable date.                                                         |
| maxDate                | string (`YYYY-MM-DD`)                                                                                          | —                  | Latest selectable date.                                                           |
| disabledDates          | string[] (`YYYY-MM-DD`)                                                                                        | —                  | List of specific dates to disable.                                                |
| shouldDisableDate      | (date: string) => boolean                                                                                      | —                  | Custom logic to disable dates.                                                    |
| firstDayOfWeek         | 0 \| 1                                                                                                         | `1` (Monday)       | Set week start day. 0=Sunday, 1=Monday.                                           |
| showPresets            | boolean                                                                                                        | `false`            | Enables preset buttons.                                                           |
| presets                | { label: string; date: string (`YYYY-MM-DD`) }[]                                                               | `[]`               | Array of quick-select options.                                                    |
| markedDates            | { [date: string]: { dots: string[] } }                                                                         | —                  | Highlight dates with colored dots.                                                |
| showRandomDots         | boolean                                                                                                        | `false`            | Display stable random dots on dates.                                              |
| title                  | string                                                                                                         | `"Selected Date"`  | Main header title text.                                                           |
| labels                 | { selectYear?, selectMonth?, confirm?, cancel?, btnEdit?, btnCancelEdit?, noDate? }                           | Default English    | Override UI label strings.                                                        |
| locale                 | { monthNames: string[], monthNamesShort: string[], dayNamesShort: string[] }                                   | English names      | Localize month and weekday labels.                                                |
| theme                  | { primary?, primarySoft?, bg?, bgSoft?, textMain?, textSec?, border?, white?, disabled?, dots?: string[] }    | Library default    | Override theme colors.                                                            |
| customStyles           | Partial\<DatePickerStyles\>                                                                                     | —                  | Fine-tune component styles via React Native `ViewStyle`/`TextStyle`.              |
| customIcons            | { next?: ImageSourcePropType; prev?: ImageSourcePropType }                                                      | Default arrows     | Replace navigation icons.                                                         |

Happy picking! 🎉
import React from 'react';
import {View} from 'react-native';

import Calendar from './components/Calendar';

const App: React.FC = () => {
  return (
    <View style={{flex: 1, padding: 16, backgroundColor: '#ccc'}}>
      <Calendar
        disableDays={{
          weekDays: [0, 6],
          days: [new Date(2020, 11, 8)],
        }}
      />
    </View>
  );
};

export default App;

import React from 'react';
import {View} from 'react-native';

import Calendar from './components/Calendar';

const App: React.FC = () => {
  return (
    <View style={{flex: 1, padding: 16, backgroundColor: '#ccc'}}>
      <Calendar
        showPastDate={false}
        disableDays={{
          weekDays: [0],
          days: [new Date(2020, 11, 8), new Date(2020, 11, 25)],
        }}
        weekNames={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']}
        monthNames={[
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro',
        ]}
        onSelectDate={(date) => console.log(date.toString())}
      />
    </View>
  );
};

export default App;

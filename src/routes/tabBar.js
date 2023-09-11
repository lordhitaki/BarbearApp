import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Face from '../../assets/img/face';
import Icon from 'react-native-vector-icons/FontAwesome5';

import MySchedule from '../pages/home/mySchedule';
import Scheduler from '../pages/home/scheduler';
import Profile from '../pages/home/profile';
import News from '../pages/home/news';

const Tab = createBottomTabNavigator();

export default function TabRoute() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveBackgroundColor: 'black',
        tabBarActiveBackgroundColor: 'black',
        tabBarActiveTintColor: 'red',
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 14,
        },
      }}>
      <Tab.Screen
        name="Minha Agenda"
        component={MySchedule}
        options={{
          tabBarIcon: ({color, size, focused}) => {
            if (focused) {
              return <Icon name="calendar-check" color="red" size={28} />;
            }
            return <Icon name="calendar-check" color="white" size={28} />;
          },
        }}
      />
      <Tab.Screen
        name="Agendar"
        component={Scheduler}
        options={{
          tabBarIcon: ({color, size, focused}) => {
            if (focused) {
              return <Icon name="calendar" color="red" size={28} />;
            }
            return <Icon name="calendar" color="white" size={28} />;
          },
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Noticias"
        component={News}
        options={{
          headerShown: true,
          tabBarIcon: ({color, size, focused}) => {
            if (focused) {
              return <Icon name="newspaper" color="red" size={28} />;
            }
            return <Icon name="newspaper" color="white" size={28} />;
          },
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Profile}
        options={{
          tabBarIcon: ({color, size, focused}) => {
            if (focused) {
              return <Icon name="user" color="red" size={28} />;
            }
            return <Icon name="user" color="white" size={28} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

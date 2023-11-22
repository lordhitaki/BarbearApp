import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

import MySchedule from '../pages/home/mySchedule/';
import Scheduler from '../pages/home/scheduler';
import Profile from '../pages/home/profile';
import News from '../pages/home/news';

const Tab = createBottomTabNavigator();

export default function TabRoute() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveBackgroundColor: '#DCDCDC',
        tabBarActiveBackgroundColor: '#DCDCDC',
        tabBarActiveTintColor: 'red',
        headerShown: false,
        tabBarStyle: {
          borderTopColor: 'black',
          borderTopWidth: 1,
          height: '7%',
        },
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
              return <Icon name="tasks" color="red" size={28} />;
            }
            return <Icon name="tasks" color="#000" size={28} />;
          },
        }}
      />
      <Tab.Screen
        name="Agendar"
        component={Scheduler}
        options={{
          tabBarIcon: ({color, size, focused}) => {
            if (focused) {
              return <Icon name="calendar-day" color="red" size={28} />;
            }
            return <Icon name="calendar-day" color="#000" size={28} />;
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
          tabBarIcon: ({color, size, focused}) => {
            if (focused) {
              return <Icon name="newspaper" color="red" size={28} />;
            }
            return <Icon name="newspaper" color="#000" size={28} />;
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
              return <Icon name="user-alt" color="red" size={28} />;
            }
            return <Icon name="user-alt" color="#000" size={28} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

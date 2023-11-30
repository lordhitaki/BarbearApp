import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

import MySchedule from '../pages/home/mySchedule/';
import Scheduler from '../pages/home/scheduler';
import Profile from '../pages/home/profile';
import News from '../pages/home/news';
import SvgScheduleOn from '../../assets/img/scheduleOn';
import SvgScheduleOff from '../../assets/img/scheduleOff';
import SvgProfileOff from '../../assets/img/profile';
import SvgProfileOn from '../../assets/img/profileOn';
import {Keyboard} from 'react-native';

const Tab = createBottomTabNavigator();

export default function TabRoute() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setOpen(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
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
          display: open ? 'none' : 'flex',
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
              return <Icon name="tasks" color="#FC0137" size={28} />;
            }
            return <Icon name="tasks" color="#555555" size={28} />;
          },
        }}
      />
      <Tab.Screen
        name="Agendar"
        component={Scheduler}
        options={{
          tabBarIcon: ({color, size, focused}) => {
            if (focused) {
              return <SvgScheduleOn />;
            }
            return <SvgScheduleOff />;
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
              return <Icon name="newspaper" color="#FC0137" size={28} />;
            }
            return <Icon name="newspaper" color="#555555" size={28} />;
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
              return <SvgProfileOn />;
            }
            return <SvgProfileOff />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from '../pages/splashScreen';
import Index from '../pages/index/index';
import Login from '../pages/account/login';
import Register from '../pages/account/register';
import CompleteRegistration from '../pages/account/register/registerSuccess';
import LoginAdm from '../pages/account/login/loginADM';

import Home from '../pages/home';

import MyScheduleAdminP from '../pages/home/profile/admin';
import ExpandableCalendarScreen from '../pages/home/mySchedule/admin';

import Financial from '../pages/home/profile/financial';
import Finish from '../pages/home/profile/financial/finish';
import Balance from '../pages/home/profile/financial/balance';
import TabRoute from './tabBar';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Index"
        component={Index}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Financial"
        component={Financial}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginAdm"
        component={LoginAdm}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CompleteRegistration"
        component={CompleteRegistration}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyScheduleAdmin"
        component={MyScheduleAdminP}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Balance"
        component={Balance}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ExpandableCalendarScreen"
        component={ExpandableCalendarScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Finish"
        component={Finish}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TabRoute"
        component={TabRoute}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import profileStack from './routes';
import ProfileScreen from './screens';
import SkillScreen from './containers/screens/SkillScreen';
import DetailSkillScreen from './containers/screens/DetailSkillScreen';
import EducationScreen from './containers/screens/EducationScreen';
import CVScreen from './containers/screens/CVScreen';

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={profileStack.index} component={ProfileScreen} />
      {/* <Stack.Screen name={profileStack.SkillScreen} component={SkillScreen} />
      <Stack.Screen
        name={profileStack.DetailSkillScreen}
        component={DetailSkillScreen}
      />
      <Stack.Screen
        name={profileStack.educationScreen}
        component={EducationScreen}
      />
      <Stack.Screen
        name={profileStack.detailEducationScreen}
        component={EducationScreen}
      /> */}
      <Stack.Screen
        name={profileStack.CVScreen}
        component={CVScreen}
      />
    </Stack.Navigator>
  );
}

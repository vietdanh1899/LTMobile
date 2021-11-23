import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import detailJobTopTab from '../routes';
import InformationScreen from './InformationScreen';
import CompanyScreen from './CompanyScreen';
import RelatedJobScreen from './RelatedJobScreen';
import CompanyIntroduction from './CompanyIntroductionScreen';
import RecruimentScreen from './RecruitmentScreen';

const TopTab = createMaterialTopTabNavigator();

export default function CompanyTobTabs() {
  return (
    <TopTab.Navigator
      tabBarOptions={{
        labelStyle: { fontSize: 12, width: 100 },
        indicatorStyle: {
          backgroundColor: '#6e5ce6',
        },
      }}
      backBehavior="none"
    >
      <TopTab.Screen
        options={{ tabBarLabel: 'Introduction' }}
        name={detailJobTopTab.companyIntroduction}
        component={CompanyIntroduction}
      />
      <TopTab.Screen
        options={{ tabBarLabel: 'Recruitment' }}
        name={detailJobTopTab.recruitment}
        component={RecruimentScreen}
      />
      <TopTab.Screen
        options={{ tabBarLabel: 'Related Job' }}
        name={detailJobTopTab.relatedJobScreens}
        component={RelatedJobScreen}
      />
    </TopTab.Navigator>
  );
}

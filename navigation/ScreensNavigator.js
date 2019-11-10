import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import Home from '../Screens/Home';
import Settings from '../Screens/Settings';
import ARContent from '../Screens/ARContent';

export default createStackNavigator({
  Home: Home,
  Settings: Settings,
  ARContent: ARContent,
});

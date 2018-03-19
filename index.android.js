/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


import {
  AppRegistry,
} from 'react-native';
require('react-native')
require('ErrorUtils').setGlobalHandler((err)=> {
    console.log('Just ignore');
});
import App from './src/App'

AppRegistry.registerComponent('IM', App);
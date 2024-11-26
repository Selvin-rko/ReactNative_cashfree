import { AppRegistry } from 'react-native';
import App1 from './App1'; // Import App1 from the new file
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App1); // Register App1
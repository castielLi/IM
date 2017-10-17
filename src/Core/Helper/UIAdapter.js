import {Platform,Dimensions} from 'react-native';

let checkDeviceHeight = (n)=>{
	return Platform.OS === 'ios'?n/2:(Dimensions.get('window').height/1334*n);
}
let checkDeviceWidth = (n)=>{
	return Platform.OS === 'ios'?n/2:(Dimensions.get('window').width/750*n);
}
export {checkDeviceHeight,checkDeviceWidth};

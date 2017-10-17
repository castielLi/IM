/**
 * Created by apple on 2017/6/29.
 */

import React, { Component } from 'react';
import {
    StyleSheet
} from 'react-native';
import {checkDeviceHeight,checkDeviceWidth} from '../Helper/UIAdapter';

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: checkDeviceHeight(36),
        marginLeft: checkDeviceWidth(20),
        textAlignVertical:'center',
        marginTop:10
    },
    RightLogo: {
        marginRight:checkDeviceWidth(40),
        flexDirection: 'row',
        alignItems:'center',
    },
    headerLogo: {
        height: checkDeviceWidth(40),
        width: checkDeviceHeight(40),
        resizeMode: 'stretch',
    },

});

export default style;
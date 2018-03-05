/**
 * Created by apple on 2018/3/5.
 */
import React, {
    Component
} from 'react';
import {
    Image,
    View,
    Text,
    ListView,
    TouchableHighlight,
    TouchableOpacity,
    Platform,
    StyleSheet,
    Alert,
    AsyncStorage,
    InteractionManager
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import {
    connect
} from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import UserController from '../../../TSController/UserController'

class ScanCode extends AppComponent {
    constructor(props) {
        super(props);

        this.state = {
            torchMode: 'off',
            cameraType: 'back',
        };
    }

    barcodeReceived(e) {
        console.log('Barcode: ' + e.data);
        console.log('Type: ' + e.type);
    }

    render() {
        return (
            <View style = {styles.container}>
                <MyNavigationBar
                    left = {{func:()=>{
                        this.route.pop(this.props)
                    }}}
                    heading={'二维码/条码'}
                />

            </View>
        );
    }
}
let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    }
});

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ScanCode);

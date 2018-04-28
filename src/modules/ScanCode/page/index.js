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
import AppManagement from '../../../App/AppManagement';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import {
    connect
} from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import { QRScannerView } from 'ac-qrcode';
import ScanController from '../../../TSController/ScanController'

let scanController = undefined;
class ScanCode extends AppComponent {
    constructor(props) {
        super(props);

        this.render = this.render.bind(this);
        scanController = new ScanController();
        scanController.init(this.appManagement.requestPageManagement)
        this.scanSuccess = false;
    }

    _renderMenu() {
        return null;

    }

    _renderTitleBar(){
        return null;
    }

    barcodeReceived(e) {
        if(!this.scanSuccess) {
            scanController.scanCode(e.data);
            this.scanSuccess = true;
        }
    }


    render() {
        return (
            <View style = {styles.container}>
                <MyNavigationBar
                    left = {{func:()=>{
                        this.route.pop(this.props)
                    }}}
                    heading={this.Localization.ScanCode.Title}
                />
                < QRScannerView
                    onScanResultReceived={this.barcodeReceived.bind(this)}
                    renderTopBarView={() => this._renderTitleBar()}
                    renderBottomMenuView={() => this._renderMenu()}
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

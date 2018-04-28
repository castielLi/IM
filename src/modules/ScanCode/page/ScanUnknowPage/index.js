/**
 * Created by apple on 2018/3/8.
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
import AppComponent from '../../../../Core/Component/AppComponent';
import AppManagement from '../../../../App/AppManagement';
import MyNavigationBar from '../../../Common/NavigationBar/NavigationBar';
import {
    connect
} from 'react-redux';
import {
    bindActionCreators
} from 'redux';


class ScanUnknow extends AppComponent {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
    }

    render() {
        return (
            <View style = {styles.container}>
                <MyNavigationBar
                    left = {{func:()=>{
                        this.route.pop(this.props)
                    }}}
                    heading={this.Localization.ScanUnKnowPage.Title}
                />
                <Text>{this.props.data}</Text>
            </View>
        );
    }
}
let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    }
});

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ScanUnknow);

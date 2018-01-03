/**
 * Created by Hsu. on 2017/10/25.
 */
/**
 * Created by apple on 2017/10/24.
 */
import React, {
    Component
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';

class GroupNotice extends AppComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)}}}
                    heading={'群公告'}
                    right={{func:()=>{this.route.pop(this.props)},text:'编辑'}}
                />
                <View>

                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

})

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch) => {
    return{

    }};

export default connect(mapStateToProps, mapDispatchToProps)(GroupNotice);
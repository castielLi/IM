/**
 * Created by apple on 2018/2/9.
 */
/**
 * Created by apple on 2017/6/6.
 */

import React, {Component} from 'react';
import {StyleSheet, Image,AsyncStorage,Platform,Alert} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';



class ForwardChoose extends AppComponent {
    constructor(props){
        super(props)
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }


    componentDidMount(){

    }

    render() {

        return (
            <View></View>
        )
    }
}

const styles = StyleSheet.create({

});


const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch) => {

};

export default connect(mapStateToProps, mapDispatchToProps)(ForwardChoose);
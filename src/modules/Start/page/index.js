/**
 * Created by apple on 2017/6/6.
 */

import React, {Component} from 'react';
import {StyleSheet, Image,AsyncStorage,Platform,Alert} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
let currentObj = undefined;

class Start extends AppComponent {
    constructor(props){
        super(props)
        this.render = this.render.bind(this);
        this.state = {
            selectedTab: 'home',
            isLogged: false
        }
        currentObj = this;

    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }


    componentDidMount(){
    }

    render() {

        return (
            <Image source={require('../resource/earth.jpg')} style={styles.img}>
            </Image>

        )
    }
}

const styles = StyleSheet.create({
    img:{
    flex:1,
    width:null,
    height:null,
    resizeMode:'stretch',
    }
});


const mapStateToProps = state => ({
    
});

const mapDispatchToProps = (dispatch) => {
  return{


  }};

 export default connect(mapStateToProps, mapDispatchToProps)(Start);
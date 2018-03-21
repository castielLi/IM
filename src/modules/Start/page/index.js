/**
 * Created by apple on 2017/6/6.
 */

import React, {Component} from 'react';
import {StyleSheet, Image,AsyncStorage,Platform,Alert,View,Dimensions} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
let {width,height} = Dimensions.get('window');
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
        this.loading.show();
    }

    render() {
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <Image source={require('../resource/earth.jpg')} style={styles.img}/>
                <Loading ref = { loading => this.loading = loading}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#ffffff',
    },
    img:{
        flex:1,
        width:width,
        height:height,
    }
});


const mapStateToProps = state => ({
    
});

const mapDispatchToProps = (dispatch) => {
  return{


  }};

 export default connect(mapStateToProps, mapDispatchToProps)(Start);
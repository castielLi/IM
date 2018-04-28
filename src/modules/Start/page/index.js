/**
 * Created by apple on 2017/6/6.
 */

import React, {Component} from 'react';
import {StyleSheet, Image,AsyncStorage,NativeModules,Alert,View,Dimensions} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import AppTokenStateEnum from '../../../App/Enum/AppTokenStateEnum'
import {connect} from 'react-redux';
let Contacts =  require('react-native-contacts');
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


         // alert('Start')
        currentObj = this;

    }

    componentWillMount(){
    }

    componentWillUnmount(){
        super.componentWillUnmount();
    }


    componentDidMount(){
        this.loading.show();
        Contacts.getAll((err,contacts)=>{
            if(err === 'denied'){
                //error
            }else{
                let contactsArray = [];
                let len = contacts.length;
                for(let i = 0; i < len; i++) {
                    let Name = (contacts[i].familyName ? contacts[i].familyName:'') + (contacts[i].middleName ? contacts[i].middleName:'') + contacts[i].givenName;
                    for(let j =0;j<contacts[i].phoneNumbers.length;j++){
                        if(contacts[i].phoneNumbers[j].number != null){
                            // phoneArray.push(contacts[i].phoneNumbers[j].number.replace(/\s*/g,''));
                            let phone = contacts[i].phoneNumbers[j].number.replace(/\s*/g,'');
                            let pattern=/^(\+?[0-9]*)+((1[35789]{1}[0-9]{1}))+(\d{8})$/;
                            if(pattern.test(phone)){
                                let PhoneNumber = phone.slice(-11);
                                contactsArray.push({PhoneNumber,Name})
                            }
                        }
                    }
                }
                this.appManagement.ContactsList = contactsArray;
            }
        });
        this.appManagement.Init()
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
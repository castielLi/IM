/**
 * Created by apple on 2018/2/8.
 */
import React, {
    Component
} from 'react';
import {
    AppRegistry,
    View,
    Text,
    SectionList,
    StyleSheet,
    Image,
    TouchableHighlight,
    TouchableWithoutFeedback,
    TextInput,
    Dimensions,
    FlatList,
    TouchableOpacity
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
var {height, width} = Dimensions.get('window');
let currentObj = undefined;
let title = null;
let currentAccount = undefined;

import UserController from '../../../TSController/UserController';
let userController = undefined;

class ForwardChoose extends AppComponent {

    constructor(props) {
        super(props);

        userController =  UserController.getSingleInstance();
        currentAccount = userController.getCurrentAccount()
    }

    render() {

        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'取消'}}
                    heading={title}
                    right={{func:()=>{this._rightButton()},text:'完成',
                        // disabled:chooseArr.length>0?false:true
                    }}
                />
                <View style={styles.listHeaderBox}>
                    <TextInput
                        style={styles.search}
                        underlineColorAndroid = 'transparent'
                        placeholder = '搜索'
                        autoFocus = {false}
                        defaultValue = {this.state.text}
                        onChangeText={(v)=>{
                            // this.setState({text:v,isShowFlatList:v?true:false})
                        }}
                    >
                    </TextInput>
                </View>


                <Popup ref={ popup => this.popup = popup}/>
                <Loading ref = { loading => this.loading = loading}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"white"
    },
    sectionHeader:{
        height: 30,
        textAlign: 'left',
        textAlignVertical: 'center',
        backgroundColor: '#eee',
        color: '#aaa',
        fontSize: 16,
        paddingLeft:10
    },
    itemBox:{
        flex:1,
        height: 60,
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:10
    },
    circle:{
        width:20,
        height:20,
        borderWidth:1,
        borderColor:'#aaa',
        backgroundColor:'green',
        borderRadius:15
    },
    pic:{
        width:40,
        height:40,
        resizeMode:'stretch',
        marginLeft:10
    },
    itemText:{
        textAlignVertical: 'center',
        color: '#5C5C5C',
        fontSize: 15
    },
    ItemSeparator:{
        // height:1,
        borderBottomColor : '#eee',
        borderBottomWidth:1
        // backgroundColor: '#eee',
    },
    listHeaderBox:{
        backgroundColor: '#ddd',
        alignItems: 'center',
        height:50,
        padding:10
    },
    search:{
        flex:1,
        width:width-20,
        backgroundColor:'#fff',
        borderRadius:5,
        color:'#000',
        padding:0,
        paddingHorizontal:10
    },
    moreUse:{
        color:'#fff',
        fontSize:30,
        textAlignVertical:'center',
        marginRight:20
    },
    listFooterBox:{
        borderTopWidth:1,
        borderColor:'#eee',
        backgroundColor: "#ffffff",
        alignItems: 'center',
        height: 50
    },
    listFooter:{
        height: 50,
        textAlignVertical: 'center',
        fontSize: 15,
        color: '#aaa'
    },
    rightSection:{
        position:'absolute',
        right:0,
        top:120,

    },
    rightSectionView:{

    },
    rightSectionItem:{
        fontSize:12,
        color:'#000',
        paddingVertical:5,
        paddingHorizontal:10
    },
    rightSectionItemModal:{
        position:'absolute',
        top:-15,
        right:50,
        width:50,
        height:50,
        backgroundColor:'#ddd',
        borderRadius:10,
        color:'#fff',
        fontSize:20,
        textAlign: 'center',
        textAlignVertical: 'center',
    }
})

const mapStateToProps = state => ({

});

const mapDispatchToProps = (dispatch) => {
    return{


    }};

export default connect(mapStateToProps, mapDispatchToProps)(ForwardChoose);
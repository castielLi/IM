/**
 * Created by apple on 2017/10/24.
 */

import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableHighlight,
    Dimensions,
    Switch,
    FlatList,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';


let {height,width} = Dimensions.get('window');
let currentObj;



class MoreGroupList extends ContainerComponent {
    constructor(){
        super();
        this.state = {

            searchResult:true,

        }
        this.render = this.render.bind(this);

        currentObj = this;
    }

    searchUser = (keyword)=>{

        currentObj.showLoading()
        this.fetchData("POST","Member/SearchUser",function(result){
            currentObj.hideLoading()
            if(!result.success){
                alert(result.errorMessage);
                return;
            }


            if(result.data.Data){


                let relations = currentObj.props.relations;
                let needRelation = null;
                let hasRelation = false;
                for(let item in relations){
                    if(relations[item].RelationId == result.data.Data.Account && relations[item].show === 'true'){
                        hasRelation = !hasRelation;
                        needRelation = relations[item];
                        break;
                    }
                }
                if(hasRelation===false){
                    needRelation = result.data.Data;
                }
                currentObj.route.push(currentObj.props,{key:'ClientInformation',routeId:'ClientInformation',params:{hasRelation,Relation:needRelation}});


            }else{
                that.setState({
                    searchResult:false
                })
            }
        },{"Keyword":keyword})
    }

    _renderItem = (item) => {

            return   <TouchableWithoutFeedback onPress={()=>{this.searchUser(item.item.Account)}}>
                        <View style={styles.itemBox}>
                            {item.item.HeadImageUrl ? <Image style={styles.itemImage} source={{uri:item.item.HeadImageUrl}}/> : <Image source={require('../resource/avator.jpg')} style={styles.itemImage} />}
                            <Text style={styles.itemText}>{item.item.Nickname}</Text>
                        </View>
                    </TouchableWithoutFeedback>

    }
    render() {
        
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return (
            <ScrollView style={styles.container}>
                <MyNavigationBar
                    heading={"群成员"}
                    left={{func:()=>{this.route.pop(this.props)},text:'返回'}}
                />
                <View style={styles.listHeaderBox}>
                    <TextInput
                        style={styles.search}
                        underlineColorAndroid = 'transparent'
                    >
                    </TextInput>
                </View>
                <View  style={{flex:1,backgroundColor:'#fff'}}>
                    <View  style={{flex:1,backgroundColor:'#fff'}}>
                        <FlatList
                            renderItem={this._renderItem}
                            //每行有3列。每列对应一个item
                            numColumns ={5}
                            //多列的行容器的样式
                            columnWrapperStyle={{marginTop:10}}
                            //要想numColumns有效必须设置horizontal={false}
                            horizontal={false}
                            keyExtractor={(item,index)=>(index)}
                            style={{backgroundColor:'#fff'}}
                            data={this.props.memberList}>
                        </FlatList>
                    </View>
                </View>
                <Popup ref={ popup => this.popup = popup}/>
                <Loading ref = { loading => this.loading = loading}/>
            </ScrollView>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    back:{
        flexDirection:'row',
        alignItems:'center',
        flex:1,
        marginLeft: 10,
    },
    rightButton:{
        color: '#ffffff',
        fontSize: 15,
        marginRight: 10,
        textAlignVertical:'center',
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
        color:'#000'
    },
    remarksBox:{
        height:50,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    remarks:{
        fontSize:18,
        color:'#000'
    },
    remarksText:{
        fontSize:16,
        color:'#aaa',
    },
    arrow:{
        fontSize:20,
        color:'#bbb'
    },
    arrowText:{
        fontSize:16,
        color:'#aaa',
        marginRight:10,
    },
    sendMessageBox:{
        height:55,
        borderRadius:5,
        marginTop:15,
        marginHorizontal:20,
        backgroundColor:'#dc0000',
        justifyContent:'center',
        alignItems:'center'
    },
    sendMessage:{
        textAlignVertical:'center',
        color:'#fff',
        fontSize:20,
    },
    itemBox:{
        width:width/5,
        height:70,
        alignItems:'center',
    },
    itemImage:{
        width:50,
        height:50,
        borderRadius:5
    },
    itemText:{
        fontSize:14,
        color:'#000'
    },
    lastItemBox:{
        width:49,
        height:49,
        borderWidth:1,
        borderColor:'#aaa',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
    },
    lastItemText:{
        fontSize:25,
        color:'#ccc'
    },
    listFooter:{
        height:50,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    listFooterText:{
        fontSize:16,
        color:'#aaa',
        marginRight:10
    }
});


const mapStateToProps = state => ({
    accountId:state.loginStore.accountMessage.Account,
    recentListStore:state.recentListStore,
    relations:state.relationStore
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(MoreGroupList);
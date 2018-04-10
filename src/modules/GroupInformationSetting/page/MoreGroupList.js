/**
 * Created by apple on 2017/10/24.
 */

import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    Image,
    Dimensions,
    FlatList,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';

let {height,width} = Dimensions.get('window');
let currentObj;



class MoreGroupList extends AppComponent {
    constructor(props){
        super(props);
        this.state = {
            memberList:[]
        };
        this.render = this.render.bind(this);

        currentObj = this;
        this.userController =  this.appManagement.getUserLogicInstance();
    }

    componentWillMount(){
        this.userController.getGroupMembersInfo(this.props.groupId,(result)=>{
            this.setState({
                memberList:result
            })
        },null,true)
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
    }

    _goToClientInfo = (keyword)=>{
        currentObj.route.push(currentObj.props,{key:'ClientInformation',routeId:'ClientInformation',params:{clientId:keyword}});
    };

    _renderItem = (item) => {
        let path = this.userController.getAccountHeadImagePath(item.item.Account);
        let name = item.item.Remark != "" ? item.item.Remark:item.item.Nickname;
            return (
                <TouchableWithoutFeedback onPress={()=>{this._goToClientInfo(item.item.Account)}}>
                    <View style={styles.itemBox}>
                        <ImagePlaceHolder style={styles.itemImage} imageUrl={path}/>
                        <Text style={styles.itemText} numberOfLines={1}>{name}</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
    };
    render() {
        
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return (
            <ScrollView style={styles.container}>
                <MyNavigationBar
                    heading={"群成员"}
                    left={{func:()=>{this.route.pop(this.props)},text:'返回'}}
                />
                {/*<View style={styles.listHeaderBox}>*/}
                    {/*<TextInput*/}
                        {/*style={styles.search}*/}
                        {/*underlineColorAndroid = 'transparent'*/}
                    {/*>*/}
                    {/*</TextInput>*/}
                {/*</View>*/}
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
                            data={this.state.memberList}>
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
        alignItems:'center',
    },
    itemImage:{
        width:50,
        height:50,
        borderRadius:25
    },
    itemText:{
        color:'#989898',
        fontSize:13,
        textAlignVertical:'center',
        includeFontPadding:false,
        maxWidth:50,
        marginTop:3,
    },
    lastItemBox:{
        justifyContent:'center',
        alignItems:'center',
        height:50,
        width:50,
        borderWidth:1,
        borderColor:'#d9d9d9',
        borderRadius:25
    },
    lastItemText:{
        color:'#989898',
        fontSize:30,
        textAlignVertical:'center',
        includeFontPadding:false,
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
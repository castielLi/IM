
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
    ListView
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../../Core/Component/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeout from 'react-native-swipeout';
import IM from '../../../Core/IM';
import {bindActionCreators} from 'redux';
import * as friendApplicationActions from '../reducer/action'

let {height,width} = Dimensions.get('window');

class NewFriend extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        })
        this.im = new IM();
        this.state = {
            dataSource: ds,
        };
        this.applyData = [];
    }
    goToAddFriends = ()=>{
        this.route.push(this.props,{key: 'AddFriends',routeId: 'AddFriends',params:{}});
    }

    componentWillMount(){
        // this.im.getAllApplyFriendMessage(function(result){
        //
        //     this.applyData = result;
        //     this.sqlData = result;
        //
        // })
    }

    componentWillReceiveProps(nextProps){
        //let reduxData = nextProps.friendApplicationStore;
        //this.applyData = sqlData.concat(reduxData)
        this.applyData = nextProps.friendApplicationStore;
    }

    agreeApply = (index,data)=>{
        alert('同意好友申请')
        let {key} = data;
        this.im.updateApplyFriendMessage('added',key)
        this.props.acceptFriendApplication(index)
    };
    deleteApply = (index)=>{
        alert('删除好友申请')
        this.props.deleteFriendApplication(index)
    };
    _renderRow = (rowData, sectionID, rowID)=>{
        return(
            <View>
                <Swipeout
                    right = {
                        [{
                            text:'删除',
                            type:'delete',
                            onPress:()=>{this.deleteApply(rowID)}
                        }]
                    }
                    rowID = {rowID}
                    sectionID = {sectionID}
                    close = {!(this.state.sectionID === sectionID && this.state.rowID === rowID)}
                    onOpen={(sectionID, rowID) => {
                        this.setState({
                            sectionID:sectionID,
                            rowID:rowID,
                        })
                    }}
                    autoClose={true}
                >

                    <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>alert('备注')}>
                        <View  style={styles.itemBox}>
                            <View style={styles.basicBox}>
                                <Image style={styles.headPic} source={require('../resource/other.jpg')}/>
                                <View style={styles.basicBoxRight}>
                                    <Text style={styles.name}>张彤</Text>
                                    <Text style={styles.description}>我是张彤</Text>
                                </View>
                            </View>
                            <Text style={styles.arrow}>{'已添加'}</Text>
                            <TouchableHighlight
                                underlayColor="#1FB579"
                                onPress={()=>{this.agreeApply(rowID,rowData)}}
                                style={styles.btnBox}>
                                <View style={styles.btnView}>
                                    <Text style={styles.btnText}>接受</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </TouchableHighlight>
                </Swipeout>
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'通讯录'}}
                    heading={"新的朋友"}
                    right={{func:()=>{this.goToAddFriends()},text:'添加朋友'}}
                />
                <View>
                    <View style={styles.listHeaderBox}>
                        <TextInput
                            style={styles.search}
                            underlineColorAndroid = 'transparent'
                        >
                        </TextInput>
                    </View>
                    <ListView
                        dataSource = {this.state.dataSource.cloneWithRows(this.applyData)}
                        renderRow = {this._renderRow}
                        enableEmptySections = {true}
                        removeClippedSubviews={false}
                    >
                    </ListView>

                </View>
            </View>
            )
            
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',

    },
    back:{
        flexDirection:'row',
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
    itemBox:{
        height:60,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    basicBox:{
        flexDirection:'row',
    },
    basicBoxRight:{
        marginLeft:15,
    },
    headPic:{
        height:40,
        width:40
    },
    name:{
        fontSize:15,
        color:'#000'
    },
    description:{
        fontSize:12,
        color:'#aaa'
    },
    arrow:{
        fontSize:15,
        color:'#aaa'
    },
    btnBox:{
        backgroundColor:'#1fd094',
        width:50,
        height:30,
        borderRadius:8,
    },
    btnView:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    btnText:{
        color:'#ffffff',
        fontSize:14,
    },
});


const mapStateToProps = state => ({
    friendApplicationStore : state.friendApplicationStore,
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(friendApplicationActions, dispatch),
});

 export default connect(mapStateToProps, mapDispatchToProps)(NewFriend);
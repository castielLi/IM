/**
 * Created by apple on 2017/10/24.
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
import {initFlatListData} from './formateData';
import UserController from '../../../TSController/UserController';
var {height, width} = Dimensions.get('window');

let userController = undefined;
let currentObj = undefined;

class GroupList extends AppComponent {

    constructor(props) {
        super(props);
        this.state={
            data:[
                {key:'',
                    data:[]}
            ],
            sections:[],
            totalItemLength:0,
            contacts:[]
        }
        this.relationStore = [];
        currentObj = this;
        userController = new UserController();
    }

    goToChat = (item)=>{
        this.route.push(this.props,{key:'ChatDetail',routeId:'ChatDetail',params:{client:item.RelationId,type:item.Type,HeadImageUrl:item.avator,Nick:item.Nick}});
    }

    _renderAvator= (Obj)=>{
        if(Obj){
            if((!Obj.LocalImage||Obj.LocalImage === '')&&!Obj.avator){
                return 	<Image style = {styles.pic} source = {require('../resource/avator.jpg')}></Image>

            }
            return 	<Image style = {styles.pic} source = {{uri:(Obj.LocalImage&&Obj.LocalImage!=='')?Obj.LocalImage:Obj.avator}}></Image>

        }else{
            return null
        }
    }
    _renderItem = (info) => {
        var txt = '  ' + info.item.Nick;
        return <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.goToChat.bind(this,info.item)}>
            <View  style={styles.itemBox} >
                {this._renderAvator(info.item)}
                <Text style={styles.itemText}>{txt}</Text>
            </View>
        </TouchableHighlight>
    }

    _renderHeader = () => {
        return  <View>
            <View style={styles.listHeaderBox}>
                <TextInput
                    style={styles.search}
                    underlineColorAndroid = 'transparent'
                >
                </TextInput>
            </View>
        </View>
    }
    _renderSeparator = () =>{
        return <View style={styles.ItemSeparator}/>
    }
    _renderFooter = () =>{
        return <View style={styles.listFooterBox}><Text style={styles.listFooter}>{this.relationStore.length+'个群聊'}</Text></View>
    }


    componentWillMount(){
        //通过回调改变页面显示
        userController.getContactList(true,false,(contacts)=>{
            currentObj.setState({
                contacts
            })
        });
    }
    render() {
        this.relationStore = initFlatListData(this.state.contacts);
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left={{func:()=>{this.route.pop(this.props)},text:'通讯录'}}
                    heading={'群聊'}
                />
                <FlatList
                    keyExtractor={(item,index)=>("index"+index+item)}
                    renderItem={this._renderItem}
                    data={this.relationStore}
                    ItemSeparatorComponent={this._renderSeparator}
                    ListHeaderComponent={this._renderHeader}
                    ListFooterComponent = {this._renderFooter}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
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
    pic:{
        width:40,
        height:40,
        resizeMode:'stretch'
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
        color:'#000'
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupList);
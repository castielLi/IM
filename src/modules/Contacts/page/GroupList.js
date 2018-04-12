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
    TouchableHighlight,
    TextInput,
    Dimensions,
    FlatList,
} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar';
import {initFlatListData} from './formateData';
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';
let {height, width} = Dimensions.get('window');

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
        this.userController = this.appManagement.getUserLogicInstance();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
    }

    componentWillMount(){
        //通过回调改变页面显示
        this.userController.getGroupContactList(false,(contacts)=>{
            currentObj.setState({
                contacts
            })
        });
    }

    goToChat = (item)=>{
        this.route.push(this.props,{key:'ChatDetail',routeId:'ChatDetail',params:{client:item.Id,type:'group',HeadImageUrl:item.HeadImageUrl,Nick:item.Name}});
    };

    _renderItem = (info) => {
        return (
            <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.goToChat.bind(this,info.item)}>
                <View  style={styles.itemBox} >
                    <ImagePlaceHolder style = {styles.pic} imageUrl = {require('../resource/groupAvator.png')}/>
                    <Text style={styles.itemText}>{info.item.Name}</Text>
                </View>
            </TouchableHighlight>
        )
    };

    _renderHeader = () => {
        return (
            <View>
                <View style={styles.listHeaderBox}>
                    <TextInput
                        style={styles.search}
                        underlineColorAndroid = 'transparent'
                    />
                </View>
            </View>
        )
    };
    _renderSeparator = () =>{
        return <View style={styles.ItemSeparator}/>
    };
    _renderFooter = () =>{
        return <View style={styles.listFooterBox}><Text style={styles.listFooter}>{this.relationStore.length+'个群聊'}</Text></View>
    };

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
        height: 54,
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:10
    },
    pic:{
        width:40,
        height:40,
        borderRadius:20
    },
    itemText:{
        textAlignVertical: 'center',
        color: '#000',
        fontSize: 15,
        marginLeft:10
    },
    ItemSeparator:{
        marginHorizontal:15,
        borderBottomColor : '#eee',
        borderBottomWidth:1,
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
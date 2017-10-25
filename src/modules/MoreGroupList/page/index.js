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
import MyNavigationBar from '../../../Core/Component/NavigationBar'
import Icon from 'react-native-vector-icons/FontAwesome';


let {height,width} = Dimensions.get('window');
let currentObj;



class MoreGroupList extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);

        currentObj = this;
    }

    _renderItem = (item) => {

            return   <TouchableWithoutFeedback onPress={()=>{alert('clientInformation')}}>
                        <View style={styles.itemBox}>
                            <Image style={styles.itemImage} source={{uri:item.item.avator}}></Image>
                            <Text style={styles.itemText}>{item.item.nick}</Text>
                        </View>
                    </TouchableWithoutFeedback>

    }
    render() {
        let data = [{nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},
            {nick:"111",avator:"https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3630050586,4001820935&fm=58"},


        ]
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
                <View>
                    <View>
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
                            data={data}>
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
        backgroundColor: '#eee',

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
    accountId:state.loginStore.accountMessage.accountId,
    recentListStore:state.recentListStore,
    relations:state.relationStore
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(MoreGroupList);
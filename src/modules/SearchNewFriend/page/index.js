
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
    Switch
} from 'react-native';
import ContainerComponent from '../../../Core/Component/ContainerComponent';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';


let {height,width} = Dimensions.get('window');
let currentObj;

class SearchNewFriend extends ContainerComponent {
    constructor(){
        super()
        this.render = this.render.bind(this);
        this.state = {
            text:'',
            searchResult:true
        }
        currentObj = this;
    }


    backToAddFriends = ()=>{
        this.route.pop(this.props);

    }

    viewUserInfo = (Relation,isFriend)=>{
        this.route.push(this.props,{key:'ClientInformation',routeId:'ClientInformation',params:{Relation,isFriend}});
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
                     if(relations[item].RelationId == result.data.Data.Account){
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

    render() {
        let Popup = this.PopContent;
        let Loading = this.Loading;
        return (
            <View style={styles.container}>
                <View>
                    {Platform.OS === 'ios'? <View style={{height:26,backgroundColor:'#ddd'}}></View>:null }
                    <View style={styles.listHeaderBox}>
                        <View style={styles.searchBox}>
                            <Icon name="search" size={20} color="#aaa" />
                            <TextInput
                                style={styles.search}
                                underlineColorAndroid = 'transparent'
                                autoFocus = {true}
                                placeholder = '微信号/手机号'
                                defaultValue = {this.state.text}
                                onChangeText={(v)=>{this.setState({text:v})}}
                            >
                            </TextInput>
                            {this.state.text === ''?null:<Icon name="times-circle" size={20} color="#aaa" onPress={()=>{this.setState({text:''})}}/>}


                        </View>
                        <View style={styles.cancelView}>
                            <Text style={styles.cancel} onPress={this.backToAddFriends}>取消</Text>
                        </View>
                    </View>
                    {this.state.text === ''?null:<TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={()=>this.searchUser(this.state.text)}>
                        <View  style={styles.itemBox}>
                            <View style={styles.greenBox}>
                                <Icon name="search" size={20} color="#fff" />
                            </View>
                            <Text style={{marginLeft:10}}>
                                <Text style={{fontSize:18,color:'#000'}}>搜索：</Text>
                                <Text style={{fontSize:16,color:'green'}}>{this.state.text}</Text>
                            </Text>
                        </View>
                    </TouchableHighlight>}


                    <Popup ref={ popup => this.popup = popup}/>
                    <Loading ref = { loading => this.loading = loading}/>
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
        color: '#ffffff',
        fontSize: 15,
        marginLeft: 10,
        textAlignVertical:'center',
    },
    rightButton:{
        color: '#ffffff',
        fontSize: 15,
        marginRight: 10,
        textAlignVertical:'center',
    },

    listHeaderBox:{
        backgroundColor: '#ddd',
        flexDirection:'row',
        height:50,
        padding:10
    },
    searchBox:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        width:width-80,
        backgroundColor:'#fff',
        borderRadius:5,
        paddingHorizontal:10
    },
    cancelView:{
        width:60,
        justifyContent: 'center'
    },
    cancel:{
        width:60,
        textAlignVertical:'center',
        textAlign:'center',
        fontSize:18,
        color:'green'
    },
    search:{
        flex:1,
        backgroundColor:'#fff',
        color:'#000',
        padding:0,
        fontSize:12
    },
    itemBox:{
        height:60,
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        borderColor:'#ccc',
        borderTopWidth:1,
        borderBottomWidth:1
    },
    basicBox:{
        flexDirection:'row',
    },
    basicBoxRight:{
        marginLeft:15,
    },
    greenBox:{
        height:40,
        width:40,
        backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5
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
});


const mapStateToProps = state => ({
    loginStore : state.loginStore.accountMessage,
    relations : state.relationStore
});

const mapDispatchToProps = dispatch => ({

});

 export default connect(mapStateToProps, mapDispatchToProps)(SearchNewFriend);
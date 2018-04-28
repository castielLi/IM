
import React, {Component} from 'react';
import {Text,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    Image,
    TouchableHighlight,
    Dimensions,
    AsyncStorage,
    StatusBar,
    SectionList

} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';
import {connect} from 'react-redux';
import * as featuresAction from '../../Common/menu/reducer/action';
import {bindActionCreators} from 'redux';
import Features from '../../Common/menu/features';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyNavigationBar from '../../Common/NavigationBar/NavigationBar'
import AppPageMarkEnum from '../../../App/Enum/AppPageMarkEnum'
import ImagePlaceHolder from '../../../Core/Component/PlaceHolder/ImagePlaceHolder';

let currentObj = undefined;


class Me extends AppComponent {
    constructor(props){
        super(props);
        this.userController = this.appManagement.getUserLogicInstance();
        this.currentAccount = this.userController.getCurrentAccount();
        this.headImagePath = this.userController.getAccountHeadImagePath(this.currentAccount.Account);
        this.state = {
            showFeatures:false,//显示功能块组件
            headImageUrl:this.headImagePath,
            name : this.currentAccount.Nickname,
            gender: this.currentAccount.Gender
        };

        currentObj = this;

        this.originData = [
            {
                'key':'1',
                'data': [{
                    'name': this.Localization.Me.nick,
                },{'name':this.Localization.Me.gender}
                    ,{
                        'name': this.Localization.Me.QRcode,
                    }]
            },
            {
                'key':'2',
                'data': [{
                    'name': this.Localization.Me.setting,
                }]
            },

        ];

        this._genderType = this._genderType.bind(this);
        this._fillingValue = this._fillingValue.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
    }

    _refreshUI(type,param){
        switch (type){
            case AppPageMarkEnum.ChangeHeadImage:
                currentObj.setState({
                    headImageUrl:param,
                });
                break;
            case AppPageMarkEnum.ChangeNickname:
                currentObj.setState({
                    name:param
                });
                break;
            break;
        }
    }

    onChangGender=(gender)=>{
        this.setState({
            gender
        })
    };

    loginOut = ()=>{
        // this.route.ToLogin(this.props);
    };

    toDoSome = (name)=>{
        let {name:nickname,headImageUrl} = this.state;
        switch (name){
            case this.Localization.Me.nick:
                this.route.push(this.props,{key: 'Profile',routeId: 'NickName',params:{}});
                break;
            case this.Localization.Me.gender:
                this.route.push(this.props,{key: 'Profile',routeId: 'GenderChange',params:{"gender":this.state.gender,"onChangeGender":this.onChangGender}});
                break;
            case this.Localization.Me.QRcode:
                this.route.push(this.props,{key: 'Profile',routeId: 'QRCode',params:{nickname,headImageUrl}});
                break;
            case this.Localization.Me.setting:
                this.route.push(this.props,{key: 'Me',routeId: 'Setting',params:{}});
                break;
            default:
                break;
        }
    };

    chooseImage = (name)=>{
        switch (name){
            // case '设置':
            //     return <Image source={require('../resource/set.png')} style={styles.pic} />;
            // // case '钱包':
            //     return <Image source={require('../resource/package.png')} style={styles.pic} />;
            // case '卡包':
            //     return <Image source={require('../resource/pack.png')} style={styles.pic} />;
            // case '收藏':
            //     return <Image source={require('../resource/souc.png')} style={styles.pic} />;
            // case '相册':
            //     return <Image source={require('../resource/photo.png')} style={styles.pic} />;
            // case '表情':
            //     return <Image source={require('../resource/smile.png')} style={styles.pic} />;
            default:
                break;
        }
    };

    _goToHeadImage = ()=>{
        this.route.push(this.props,{key: 'Profile',routeId: 'HeadImage'});
    };

    _genderType = ()=>{
        switch (this.state.gender){
            case 1:
                return this.Localization.Me.male;
            case 2:
                return this.Localization.Me.female;
            default:
                return this.Localization.Me.unsetting;
        }
    };

    _fillingValue=(info)=>{
        switch (info.item.name){
            case this.Localization.Me.QRcode:
                return(
                    <View style={styles.itemRightBox}>
                        <Icon name="qrcode" size={35} color="#fff" style={styles.arrow}/>
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                );
            case this.Localization.Me.gender:
                return (
                    <View style={styles.itemRightBox}>
                        <Text style={styles.itemContent}>{this._genderType()}</Text>
                    </View>
                );
            default:
                return(
                    <View style={styles.itemRightBox}>
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                )
        }
    };

    _renderItem = (info)=>{
        return (
            <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this.toDoSome.bind(this,info.item.name)}>
                <View style={styles.itemBox}>
                    <View  style={styles.itemLeftBox} >
                        {/*{this.chooseImage(info.item.name)}*/}
                        <Text style={styles.itemText}>{info.item.name}</Text>
                    </View>
                    {this._fillingValue(info)}
                </View>
            </TouchableHighlight>
        )
    };
    _renderSection = ()=>{
        return <View style={styles.sction}/>
    };
    _renderSeparator = () =>{
        return <View style={styles.ItemSeparator}/>
    };
    _renderHeader =()=>{
        return (
            <TouchableHighlight underlayColor={'#bbb'} activeOpacity={0.5} onPress={this._goToHeadImage}>
                <View style={styles.topBox}>
                    <View  style={styles.topLeftBox} >
                        <ImagePlaceHolder style={styles.topPic} imageUrl ={this.state.headImageUrl}/>
                        <View style={styles.topInfo}>
                            <Text style={styles.headerText}>{this.state.name}</Text>
                            <Text style={styles.itemSmallText}>{this.Localization.Me.cloudId +this.currentAccount.Account}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Icon name="angle-right" size={35} color="#fff" style={styles.arrow}/>
                    </View>
                </View>
            </TouchableHighlight>
        )
    };

    render() {
        return (
            <View style={styles.container}>
                <MyNavigationBar
                    left = {this.Localization.Common.AppName}
                    right={[
                        {func:()=>{
                            this.route.push(this.props,{key: 'Search',routeId: 'Search'});
                        },icon:'search'},
                        {func:()=>{this.props.showFeatures()},icon:'list-ul'}
                        ]}
                />
                <SectionList
                    keyExtractor={(item,index)=>("index"+index+item)}
                    ListHeaderComponent={this._renderHeader}
                    renderSectionHeader={this._renderSection}
                    renderItem={this._renderItem}
                    sections={this.originData}
                    ItemSeparatorComponent={this._renderSeparator}
                    stickySectionHeadersEnabled={false}
                />
                <Features ref={e => this.features = e} navigator={this.props.navigator}/>
            </View>
            )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ebebeb"
    },
    topBox:{
        height:80,
        flexDirection:'row',
        paddingHorizontal:15,
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    topLeftBox:{
        height:70,
        flexDirection:'row',
        alignItems:'center',

    },
    topPic:{
        width:60,
        height:60,
        marginRight:15,
        borderRadius:30
    },
    topInfo:{
        height:60,
        justifyContent:'center',
    },
    headerText:{
        fontSize:16,
        color:'#000',
        textAlignVertical:'center',
        includeFontPadding:false
    },
    itemSmallText:{
        fontSize:14,
        color:'#989898',
        textAlignVertical:'center',
        includeFontPadding:false,
        marginTop:2
    },
    sction:{
        height:20
    },
    itemBox:{
        height:40,
        flexDirection:'row',
        paddingHorizontal:15,
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff'
    },
    itemLeftBox:{
        height:30,
        flexDirection:'row',
        alignItems:'center',

    },
    itemRightBox:{
        flexDirection:'row',
        alignItems:'center'
    },
    pic:{
        width:25,
        height:25,
        resizeMode:'contain',
        marginRight:15
    },
    itemText:{
        fontSize:15,
        color:'#000',

    },
    ItemSeparator:{
        height:1,
        backgroundColor: '#eee',
    },
    arrow:{
        fontSize:20,
        color:'#989898',
        marginLeft:15
    },
});

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(featuresAction, dispatch)
});

 export default connect(mapStateToProps, mapDispatchToProps)(Me);
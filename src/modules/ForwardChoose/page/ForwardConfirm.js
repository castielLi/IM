import React, {Component} from 'react';
import {StyleSheet,Image,Modal,Platform,Alert,FlatList,TouchableHighlight,View,Text,Dimensions} from 'react-native';
import AppComponent from '../../../Core/Component/AppComponent';


let {width,height} = Dimensions.get('window');
export default class ForwardConfirm extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible:props.visible,//是否显示
        };

        this.userController = this.appManagement.getUserLogicInstance();
        this.imLogicController = this.appManagement.getIMLogicInstance();
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        this.userController = undefined;
        this.imLogicController = undefined;
    }

    static defaultProps = {
        visible: false
    };
    static propTypes={
        visible: React.PropTypes.bool,
        onPress: React.PropTypes.func
    };

    // componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         visible: nextProps.visible
    //     });
    // }

    render(){
        let TargetNames = this._buildTargetName(this.props.targetInfo);
        return (
            <Modal
                animationType={'none'}
                visible={this.state.visible}
                transparent={true}
                onRequestClose={()=> {}}
            >
                <View style={styles.container}>
                    <View style={styles.contentBox}>
                        <View style={styles.tileView}>
                            <Text style={styles.tileText}>发送给：</Text>
                        </View>
                        <View style={styles.userView}>
                            <Text style={styles.userText}>
                                {TargetNames}
                            </Text>
                        </View>
                        <View style={styles.contentView}>
                            {this._renderContent(this.props.rowData)}
                        </View>
                        <View style={styles.btnView}>
                            <TouchableHighlight onPress={()=>{this._onCancelMethod()}} underlayColor={'#eee'} style={styles.optinTouch}>
                                <View style={styles.optinView}>
                                    <Text style={styles.cancelText}>
                                        取消
                                    </Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={()=>{this._onConfirmMethod()}} underlayColor={'#eee'} style={styles.optinTouch}>
                                <View style={styles.optinView}>
                                    <Text style={styles.confirmText}>
                                        发送
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    /*切换显示隐藏回调*/
    onChange() {
        this.setState({visible:!this.state.visible});
    }

    /**/
    _buildTargetName=(target)=>{
        let targetNames = '';
        for(let key in target){
            targetNames += target[key].name + ',';
        }
        return targetNames.slice(0,-1);
    };

    /*取消按钮回调*/
    _onCancelMethod=()=>{
        let {cancel} = this.props;
        cancel && cancel();
        this.onChange();
    };

    /*确认按钮执行方法*/
    _onConfirmMethod=()=>{
        let {confirm} = this.props;
        confirm && confirm();
        this.onChange();
    };

    /*渲染消息内容*/
    _renderContent=(rowData)=>{
        let {message,messageType} = rowData;
        //messageType为判断消息是文字还是文件，message.Type判断文件类型
        switch (messageType) {
            case 1:
                return(
                    <View style={styles.contentTextBox}>
                        <Text style={styles.contentText}>{message}</Text>
                    </View>
                );
            case 2: {
                switch (message.Type){
                    case 1:
                        return (
                            <View style={styles.contentImageBox}>
                                <Image style={styles.contentImage} source={{uri: message.LocalSource}}/>
                            </View>
                        );
                    default:
                        break;
                }
            }
            default:
                break;
        }
    }
}



const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'rgba(0,0,0,.5)',
        justifyContent:'center',
        alignItems:'center',
    },
    contentBox:{
        backgroundColor:'#fff',
        padding:10,
        width:300,
        borderRadius:2
    },
    tileView:{

    },
    tileText:{
        fontSize:20,
        color:'#000',
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false
    },
    userView:{
        paddingVertical:10
    },
    userText:{

    },
    contentView:{
        marginBottom:10,
    },
    contentTextBox:{
        backgroundColor:'#eee',
        justifyContent:'center',
        paddingVertical:8,
        paddingHorizontal:5,
        borderRadius:2,
    },
    contentText:{
        fontSize:14,
        color:'#666',
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false,
    },
    contentImageBox:{
        justifyContent:'center',
        alignItems:'center'
    },
    contentImage:{
        width:100,
        height:100
    },
    btnView:{
        backgroundColor:'#fff',
        flexDirection:'row',
        justifyContent:'flex-end',
        paddingTop:10,
        borderTopWidth:1,
        borderTopColor:'#62b900',
    },
    optinTouch:{
        borderRadius:2
    },
    optinView:{
        paddingHorizontal:10,
        paddingVertical:4,
        justifyContent:'center',
        alignItems:'center',
    },
    cancelText:{
        fontSize:16,
        color:'#666',
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false,
    },
    confirmText:{
        fontSize:16,
        color:'#62b900',
        fontWeight:'normal',
        textAlignVertical:'center',
        includeFontPadding:false,
    }

});
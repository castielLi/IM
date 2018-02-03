import  React,{ Component,PropTypes } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    requireNativeComponent
} from 'react-native';

{/**按钮防重复提交组件*/}
export default class Touch extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isDisable:props.disabled,//是否被禁用
        };
    }

    componentWillUnMount() {
        this.timer && clearTimeout(this.timer)
    }

    componentWillReceiveProps(nextProps){
        let {disabled} = nextProps;
        if(disabled == this.state.isDisable){
            return;
        }
        this.setState({
            isDisable:disabled,
        })

    }

    ToPress = async ()=>{
        const {onPress} = this.props;
        onPress&&onPress();
        await this.setState({isDisable:true})//防重复点击
        this.timer = setTimeout(async()=>{
            await this.setState({isDisable:false})//1.5秒后可点击
        },2000)
    }

    render(){
        const {style,content} = this.props
        return(
            <TouchableOpacity
                disabled={this.state.isDisable}
                activeOpacity={this.props.activeOpacity?this.props.activeOpacity:0.5}
                style={style?style:{}}
                onPress={this.ToPress}>
                {this.props.children}
            </TouchableOpacity>
        )
    }
}
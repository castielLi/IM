import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    AsyncStorage,
    Platform,
    Alert,
    FlatList,
    TouchableHighlight,
    View,
    Text,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

let {width,height} = Dimensions.get('window');
export default class CheckBox extends Component{
    constructor(props){
        super(props);
        this.state = {
            checked: props.checked,
        };
    }


    static defaultProps = {
        checked: false
    };
    static propTypes={
        checked: React.PropTypes.bool,
        onChange: React.PropTypes.func
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            checked: nextProps.checked
        });
    }

    onChange() {
        this.setState({checked:!this.state.checked});
    }

    //根据选中状态决定样式
    _renderOptin=(checked)=>{
        if(checked){
            return <Icon name={'check-square-o'} size={22} style={styles.checkbox} color="#66CD00" />
        }else{
            return <Icon name={'square-o'} size={22} style={styles.checkbox} color="#999" />
        }
    };

    render() {
        return (
            <View style={styles.container}>
                {this._renderOptin(this.state.checked)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    checkbox:{

    }
});
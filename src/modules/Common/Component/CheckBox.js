import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
let stateType = {Default:0,Selected:1,Unselected:2};
let {width,height} = Dimensions.get('window');
export default class CheckBox extends Component{
    constructor(props){
        super(props);
        this.state = {
            checked: props.checked,
        };
    }

    static defaultProps = {
        checked: stateType.Unselected
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

    onChange(value) {
        if(this.state.checked == stateType.Default) return;
        let checked;
        if(value){
            checked = value;
        }else{
            checked = (this.state.checked === stateType.Selected) ? stateType.Unselected : stateType.Selected;
        }
        this.setState({checked});
    }

    //根据选中状态决定样式
    _renderOptin=(checked)=>{
        switch (checked){
            case stateType.Default:
                return <Icon name={'check-square-o'} size={22} style={styles.checkbox} color="#999" />;
            case stateType.Selected:
                return <Icon name={'check-square-o'} size={22} style={styles.checkbox} color="#66CD00" />;
            case stateType.Unselected:
                return <Icon name={'square-o'} size={22} style={styles.checkbox} color="#999" />;
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
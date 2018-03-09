import React, {
	Component
} from 'react';
import {
	AppRegistry,
	View,
	Text,
	SectionList,
	StyleSheet,
	Dimensions
} from 'react-native';
import LetterPosition from './LetterPosition';
let currentObj = undefined;
let {width, height} = Dimensions.get('window');

export default class MySectionList extends Component {

	constructor(props) {
		super(props);
		this.state={
		};
        currentObj = this;
	}

    static defaultProps = {
        stickySectionHeadersEnabled:true,
        keyExtractor:(item,index)=>("index"+index+item),
        keyArray:[],
        sections:[]
    };
    static propTypes={
        keyExtractor: React.PropTypes.func,
        ItemSeparatorComponent: React.PropTypes.func,
        ListHeaderComponent: React.PropTypes.func,
        ListFooterComponent: React.PropTypes.func,
        renderItem: React.PropTypes.func,
        renderSectionHeader: React.PropTypes.func,
        stickySectionHeadersEnabled: React.PropTypes.bool,
    };

    scrollToLocation=(section)=>{
        let hasLetter = this.props.keyArray.indexOf(section);
        if(hasLetter === -1) return;
        this.refs.mySectionList.scrollToLocation({
            animated : true,
            sectionIndex: hasLetter,
            itemIndex : 0,
            viewOffset : this.props.viewOffset
        })
    };

    onChange=(value,show)=>{
        this._SelectText.onChange(value,show)
	};

    onChangeText=(value)=>{
        this._SelectText.onChangeText(value)
	};
	render() {
		return (
			<View style={styles.container}>
				<SectionList
					ref={'mySectionList'}
					{...this.props}
				/>
				<SelectText ref={e=>this._SelectText=e}/>
				<LetterPosition
					onPress={this.scrollToLocation}
					onChange={this.onChange}
					onChangeText={this.onChangeText}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
        backgroundColor: "#fff"
	},
});

class SelectText extends Component{
    constructor(props) {
        super(props);
        this.state = {
            text:'',
            show:false,
        };
    }

    onChangeText=(value)=>{
        this.setState({
            text:value
        })
    };

    onChange=(value,show)=>{
        if(this.state.show === show) return;
        this.setState({
            show:show,
            text:value
        })
    };

    render() {
        if(!this.state.show){
            return null;
        }
        return (
            <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,justifyContent:'center', alignItems:'center'}}>
				<View style={{width:80,height:80,backgroundColor:'rgba(0,0,0,.5)',borderRadius:5,justifyContent:'center', alignItems:'center'}}>
					<Text style={{fontSize:30,color:'#fff'}}>{this.state.text}</Text>
				</View>
			</View>
        )
    }
}

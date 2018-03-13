/**
 * Created by apple on 2017/12/29.
 */

import ContainerComponent from './ContainerComponent'
import AppManagement from '../../App/AppManagement'

let currentObj = undefined;
export default class AppComponent extends ContainerComponent{
    constructor(props) {
        super(props);
        this.appManagement = new AppManagement();
        if(props && props.MarkType) {
            if(props.MarkType instanceof Array){
                props.MarkType.forEach((value,index)=>{
                    this.appManagement.addPageManagement(value, props.name?props.name:this.constructor.name ,this._refreshUI)
                })
            }else{
                this.appManagement.addPageManagement(props.MarkType, props.name?props.name:this.constructor.name ,this._refreshUI)
            }
        }
        this._refreshUI = this._refreshUI.bind(this);
        currentObj = this;
    }


    componentWillUnmount(){
        this.appManagement.removePageManagement(this.props.MarkType,this.constructor.name)
    }

    _refreshUI(params){
        console.log("super refreshUI")
    }
}
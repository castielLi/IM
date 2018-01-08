/**
 * Created by apple on 2017/12/29.
 */

import ContainerComponent from './ContainerComponent'
import AppManagement from '../../App/AppManagement'

let currentObj = undefined;
export default class AppComponent extends ContainerComponent{
    constructor(props) {
        super(props);
        if(props && props.MarkType) {
            if(props.MarkType instanceof Array){
                props.MarkType.forEach((value,index)=>{
                    AppManagement.addPageManagement(value, this.constructor.name ,this._refreshUI)
                })
            }else{
                AppManagement.addPageManagement(props.MarkType, this.constructor.name ,this._refreshUI)
            }
        }
        this._refreshUI = this._refreshUI.bind(this);
        currentObj = this;
    }


    componentWillUnmount(){
       AppManagement.removePageManagement(this.props.MarkType,this.constructor.name)
    }

    _refreshUI(params){

    }
}
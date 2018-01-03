/**
 * Created by apple on 2017/12/29.
 */

import ContainerComponent from './ContainerComponent'
import AppManagement from './AppManagement'

let currentObj = undefined;
export default class AppComponent extends ContainerComponent{
    constructor(props) {
        super(props);
        if(props && props.MarkType) {
            AppManagement.addPageManagement(props.MarkType, this.constructor.name ,this._refreshUI)
        }
        this._refreshUI = this._refreshUI.bind(this);
        currentObj = this;
    }

    _refreshUI(params){

    }
}
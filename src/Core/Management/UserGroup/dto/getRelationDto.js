/**
 * Created by apple on 2017/12/4.
 */


export getRelationEnum = {
    SINGLE : 'single',
    LIST : 'list',
}

export class getRelationDto{
    constructor(){
        this.Id = '';
        this.type = '';
        this.callback = '';
    }
}

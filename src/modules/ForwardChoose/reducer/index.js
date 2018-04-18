const initialState = {
    selectRecord:{},//选择转发的记录{Account:{Account:id,Group:bool}}
    optionsType:false,//是否多选
    targetInfo:{},//选中的目标信息{key(id):{name:,headImage:}}
};

export default function selectRecordStore(state=initialState, action){

    switch(action.type){
        case 'CHANGE_SELECT_RECORD':
            let selectRecord = {...state.selectRecord};
            if(selectRecord[action.RecordDto.receiveId]){
                delete selectRecord[action.RecordDto.receiveId];
            }else{
                selectRecord[action.RecordDto.receiveId] = action.RecordDto;
            }
            return{
                ...state,
                selectRecord
            };
        case 'CHANGE_OPTION_TYPE':
            state.optionsType = !state.optionsType;
            return{
                ...state
            };
        case 'CHANGE_TARGET_INFO':
            let targetInfo = {...state.targetInfo};
            if(targetInfo[action.key]){
                delete targetInfo[action.key];
            }else{
                targetInfo[action.key] = action.TargetDto;
            }
            return {
                ...state,
                targetInfo
            };
            break;
        case 'INIT_SELECT':
            return {
                selectRecord:{},
                optionsType:false,
                targetInfo:{},
            };
        default:
            return state;
    }

}
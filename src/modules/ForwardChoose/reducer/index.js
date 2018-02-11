const initialState = {
    selectRecord:{},//选择转发的记录{Account:{Account:id,Group:bool}}
    optionsType:false,//是否多选
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
            break;
        case 'CHANGE_OPTION_TYPE':
            state.optionsType = !state.optionsType;
            return{
                ...state
            };
            break;
        case 'INIT_SELECT':
            return {
                selectRecord:{},
                optionsType:false,
            };
        default:
            return state;
    }

}
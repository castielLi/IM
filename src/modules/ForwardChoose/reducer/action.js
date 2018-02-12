export function changeSelectRecord(RecordDto){
    return {
        type: 'CHANGE_SELECT_RECORD',
        RecordDto
    };
}

export function changeOptionsType(){
    return {
        type: 'CHANGE_OPTION_TYPE',
    };
}

export function changTargetInfo(key,TargetDto){
    return {
        type: 'CHANGE_TARGET_INFO',
        key,
        TargetDto
    };
}

export function initSelect(){
    return {
        type: 'INIT_SELECT',
    };
}



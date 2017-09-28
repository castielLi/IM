

const initialState = {
    unReadMessageNumber:0
    
};

export default function unReadMessageStore(state=initialState, action){

    switch(action.type){


        case 'ADD_UNREADMESSAGE_NUMBER':
            return {
                unReadMessageNumber:state.unReadMessageNumber+1
            };
        case 'CUT_UNREADMESSAGE_NUMBER':
            return {
                unReadMessageNumber:state.unReadMessageNumber-action.cutNumber
            };
        default:
            return state;
    }

}
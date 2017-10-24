/**
 * Created by apple on 2017/6/7.
 */

const initialState = [];

export default function relationStore(state=initialState, action){

    switch(action.type){

        case 'INIT_RELATION':
            return action.relationData;
        case 'CLEAR_RELATION':
            return initialState;
        case 'ADD_RELATION':
            state.push(action.relation);
            return state.concat([]);
        case 'CHANGE_RELATION':
            for(let i=0;i<state.length;i++){
                if(state[i].RelationId === action.relation.relationId){
                   state[i] = action.relation;
                    break;
                }
            }
            return state.concat([]);

        case 'DELETE_RELATION':
            for(let i=0;i<state.length;i++){
                if(state[i].RelationId === action.relationId){
                    state.splice(i,1);
                    break;
                }
            }
            return state.concat([]);
        default:
            return state;
    }

}
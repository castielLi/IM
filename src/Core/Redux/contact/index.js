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
            let hasSameRelation = false;
            for(let i=0;i<state.length;i++){
                if(state[i].RelationId === action.relation.RelationId){
                    hasSameRelation = true;
                    break;
                }
            }
            if(!hasSameRelation){
                state.push(action.relation);
                return state.concat([]);
            }else{
                return state;
            }

        case 'CHANGE_RELATION':
            for(let i=0;i<state.length;i++){
                if(state[i].RelationId === action.relation.RelationId){
                   state[i] = action.relation;
                    break;
                }
            }
            return state.concat([]);
        case 'CHANGE_RELATION_OF_SHOW':
            for(let i=0;i<state.length;i++){
                if(state[i].RelationId === action.relationId){
                    if(state[i].show === 'true'){
                        state[i].show = 'false';
                    }else if(state[i].show === 'false'){
                        state[i].show = 'true';

                    }
                    break;
                }
            }
            return state.concat([]);
        case 'CHANGE_RELATION_OF_Nick':
            for(let i=0;i<state.length;i++){
                if(state[i].RelationId === action.relationId){
                    state[i].Nick = action.Nick;
                    break;
                }
            }
            return state.concat([]);
        case 'CHANGE_RELATION_OF_BLACKLIST':
            for(let i=0;i<state.length;i++){
                if(state[i].RelationId === action.relationId){
                    state[i].BlackList = action.isBlackList;
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
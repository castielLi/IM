export function pressRecord(){
	return{
		type:'PRESS_RECORD'
	}
}
export function pressExpression(){
	return{
		type:'PRESS_EXPRESSION'
	}
}
export function pressPlus(){
	return{
		type:'PRESS_PLUS'
	}
}
export function changeThouchBarInit(){
	return{
		type:'CHANGE_INIT'
	}
}

export function focusInput(){
	return{
		type:'FOCUS_INPUT'
	}
}
export function listLoadMore(){
	return{
		type:'LIST_LOADMORE'
	}
}



export function showImageModal(urls){
	return{
		type:'SHOW_MODAL',
		urls:urls
	}
}
export function hideImageModal(){
	return{
		type:'HIDE_MODAL'
	}
}
export function showMediaPlayer(url){
    return{
        type:'SHOW_MEDIA_PLAYER',
        urls:url
    }
}
export function hideMediaPlayer(){
    return{
        type:'HIDE_MEDIA_PLAYER'
    }
}



//聊天页面状态 聊天对象
export function changeChatDetailPageStatus(status,client,way){
	return{
		type:'CHANGE_CHATDETAILPAGE_STATUS',
		status,
		way,
		client
	}
}
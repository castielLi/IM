export default checkReg = (type,value)=>{//type:1 手机登录  2:邮箱登录
	switch(type){
		case 1:
			if(!(/^1[34578]\d{9}$/.test(value))){
				alert('账号必须是手机');
				return false;
			}else{
				return true;
			}
		break;
		case 2:
			if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))) {
				alert('账号必须是邮箱');
			}
		break;
		
	}
}
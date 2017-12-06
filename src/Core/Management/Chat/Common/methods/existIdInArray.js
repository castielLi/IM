//判断数组中是否存在指定id
export default function existIdInArray(arr,id){
    if(arr.indexOf(id)>-1){
        return true;
    }else{
        return false;
    }
}
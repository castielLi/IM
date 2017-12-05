//判断数组中是否存在指定id
export default function existIdInArray(arr,id){
    let isExist = false;
    for(let i=0,length = arr.length;i<length;i++){
        if(arr[i] == id){
            isExist = true;
            break;
        }
    }
    return  isExist;
}
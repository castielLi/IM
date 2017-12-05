//数组转对象
export default function formatArrToObjById(arr){
    return arr.reduce((o, m, i) => { //(previousValue, currentValue, currentIndex, array1)

        o[m.Client] = {
            ...m,
            Record:[]
        };
        return o;
    }, {})
}
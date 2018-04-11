/*module.exports = function printInventory(input) {

    console.log();
    return 'Hello World!';
};*/
let funs = require("../../pos-v1-node/main/datbase.js");

module.exports = function printInventory(inputs){
    let x = orders(inputs);
    let y = transition(x);
    let z = promotions(x);
    let discounts = 0;  z.forEach((e)=>{ discounts += e.total; });
    let sum = totalcosts(x);
    y.forEach((e1)=>{
        z.forEach((e2)=>{
            if(e1.barcode === e2.barcode){ e1.total -= e2.total; }
        });
    });

    let str_1 = '';
    y.forEach((e)=>{
        str_1 += '名称：'+e.name+'，数量：'+e.count+e.unit+'，单价：'+decimal(e.price)+'(元)，小计：'+decimal(e.total)+'(元)\n';
    });
    let str_2 = '';
    z.forEach((e)=>{
        if(e.count !== 0){ str_2 += '名称：'+e.name+'，数量：'+e.count+e.unit+'\n';}
    });
    let str_3 = '总计：'+decimal(sum)+'(元)\n'+'节省：'+decimal(discounts)+'(元)\n';

    let result = '***<没钱赚商店>购物清单***\n' +
        str_1 +
        '----------------------\n' +
        '挥泪赠送商品：\n' +
        str_2 +
        '----------------------\n' +
        str_3 +
        '**********************';

    return result;
}

function orders(inputs){  // OK  统计出用户购买的东西以及其数量
    let arr = [], order = [];
    inputs.forEach((item)=>{
        let re1 = /(-)/g;
        if(!re1.test(item)){
            if(!arr[item]){
                arr[item] = {};
                arr[item].code = item;
                arr[item].count = 1;
            } else{
                arr[item].count ++;
            }
        } else {
            let obj = {};
            obj.code = item.substr(0, 10);
            obj.number = item.substr(item.length - 1, 1);
            obj.count = parseInt(obj.number);
            if (!arr[obj.code]) {
                arr[obj.code] = {};
                arr[obj.code].code = obj.code;
                arr[obj.code].count = obj.count;
            } else {
                arr[obj.code].count += obj.count;
            }
        }
    });
    for(let i in arr){
        order.push(arr[i]);
    }
    return order;
}

function transition(inputs) {  // OK 整理出所有输出需要用到的量
    let items = funs.fun1();
    const result0 = [];

    inputs.forEach((i)=>{
        let re1 = new RegExp(i.code);
        for(let j in items) {
            if (re1.test(items[j].barcode)) {
                result0.push(items[j]);
                result0[result0.length - 1].count = i.count;
                result0[result0.length - 1].total = result0[result0.length - 1].count * result0[result0.length - 1].price;
                break;
            }
        }
    });
    return result0;
}

function promotions(inputs){ // OK 计算是否满足促销要求
    let temp = transition(inputs);
    let p = funs.fun2();
    let result = [];
    temp.forEach((i)=>{
        p[0].barcodes.forEach((e)=>{
            if(e === i.barcode && i.count/2 >= 1){
                result.push(i);
                if(i.count % 3 >= (i.count + 1) % 3){
                    result[result.length - 1].count = Math.floor(i.count / 3);
                } else { result[result.length - 1].count = i.count / 3;}
                result[result.length - 1].total = i.count * i.price;
            }
        });
    });
    return result;
}

function totalcosts(inputs){ // OK 计算总价格（包括促销节省的费用）
    let items = transition(inputs);
    let discounts = promotions(inputs);
    let sum = 0;
    items.forEach((e)=>{
        sum += e.total;
    });
    discounts.forEach((f)=>{
        sum -=f.total;
    });
    return sum;
}

function decimal(number){ // OK 输出时转为两位小数
    let result;
    if((number)!== Math.floor(number)){ result = (number).toString() + '0'} else{ result = (number).toString() + '.00' };
    return result;
}
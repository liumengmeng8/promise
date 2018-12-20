 
let context={

}

// 我们在这里进行如果这样取ctx.url ctx.path...的值
// js中 有一个不常用的方法， 算是Object.defineProperty的变种

// context  取path的时候就回调用这个函数
// 然后 this 指向context 因为是context 取值
// 实际取值的是在context上的request对象上的path属性
// context.__defineGetter__("path",function(){
//     return this['request'].path;
// })

//为了方便，我们定义一个方法
function defineGetter(prototype,key){ //获取属性器
    context.__defineGetter__(key,function(){
        return this[prototype][key];
    })
}
//代理，取属性的值，通过request来取值
defineGetter('request','url');
defineGetter('request','path');

function defineSetter(prototype,key){ //获取属性器
    context.__defineSetter__(key,function(value){
        return this[prototype][key] = value;
    })
}
// ctx.body ='100'  === ctx.response.body = '100'
defineGetter('response','body');//ctx.body 取值的时候实际取的是response的body
defineSetter('response','body')

module.exports = context;







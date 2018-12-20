
//koa 核心源码
let app = {};
app.ary = []; //用来存储 所有的use的函数
app.use = function(cb){
    app.ary.push(cb);//每调用一次use就给ary增加一个
}

app.use((ctx,next)=>{
    console.log(1);
    next();//
    console.log(2)
})
app.use((ctx,next)=>{
    console.log(3);
    next()
    console.log(4)
})
app.use((ctx,next)=>{
    console.log(5);
    next();// 如果下面没有函数了，这里表示一个空函数不会报错
    console.log(6)
})

function dispatch(index){
    if(index === app.ary.length) return ()=>{} // 当index 等于我们数组的长度的时候就是 没有函数可以执行了那next 应该返回一个空函数
    let rout = app.ary[index];
    rout(()=>dispatch(index+1)) //执行第一个的时候把下一个数组的函数穿进去，然后当点击第一个next的时候就会执行第二个函数了
}
dispatch(0);//默认执行第一个




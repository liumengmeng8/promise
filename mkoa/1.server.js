
//koa 导出的是一个大写的Koa，是一个类。koa的源码是用es6写的
let Koa = require("koa");

//创建koa的实例
let app = new Koa();

//use 中间件 参数是一个函数，函数有2个参数 
//1.ctx ctx不等于res+req 
//2.next 进行下一个的函数
//默认情况下，请求到来时会执行第一个中间件
// app.use((ctx,next)=>{ 
//     ctx.body = "a";  //body 就是响应体的内容 类似 res.end 但是res.end 不会执行后面的内容
//     ctx.body = "b"; //res.end 不会显示 b 因为res.end 就是结束了。但是body会执行完所有的取最后的
//     next() //加上next 下一个就可以显示了
//     ctx.body = "d";// 最后页面展示的d。因为 next() 就行 c的函数在执行，执行完在执行d的这行，body永远都是取的最后一个
// })
// app.use((ctx)=>{ 
//     ctx.body = "c"
//     console.log(2);
// })

//洋葱模型
//相当于：第一个next包含的是第二个函数，第二个函数的next包含的是 第三个函数，那到第三个函数执行完next 没有函数了，就会按照顺序，输出6  4 2
// 先外一层->二层->三层然后就是三层->二层->一层
// 先外执行到里面 在从里面到外面
//打印顺序是：1-3-5-6-4-2
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





//这个就是之前的http.createServer
app.listen(3000,()=>{
    console.log(`server start 3000`)
})
//





// let Koa = require("koa");
let Koa = require("./application");
// let url = require("url");


//koa 的ctx.body 还可以是一个流比如 fs.crearecreateReadStream(path.join(__dirname,'index.html'))
//但是如果是流的话那必须给设置这个一个头，ctx.set('Content-Type','text/html;charset=utf-8') 不然会默认成下载的

let app =new Koa();

// app.use((req,res)=>{
//     res.end("hello")
// })

// next  如果不调用，就不能继续执行
// next的功能
    //1. 权限校验
    //2. 可以在上面，把统一的功能进行扩展比如在第一个use里写ctx.a= '100' 那有next函数可以在下面的use函数拿到这个ctx.a
//中间件函数都可以放async函数。有promise
// app.use((ctx)=>{
//     // let {pathname} = url.parse(ctx.req.url,true);
//     console.log(ctx.req.path,"1");
//     // // console.log(pathname,"pathname")
//     console.log(ctx.request.req.path,"2");
//     console.log(ctx.request.path,"3");
//     console.log(ctx.path,"4");
//     ctx.body = 'hello'
//     console.log(ctx.body)

//     //ctx.path = ctx.request.path
//     //ctx.path 代理 ctx.request.path 属性
//     //当在ctx.path 取值时 实际取的是ctx.request.path的值 他俩不是赋值的关系，而是代理
// })
let logger = function () {
    return new Promise((resolve,reject)=>{
      setTimeout(() => {
        console.log('logger')
        resolve();
      }, 1000);
    })
}
//koa中，如果写了next 就必须在next前面加一个await
app.use(async (ctx,next)=>{
    console.log(1);
    await next()
    console.log(2)
})
app.use(async (ctx,next)=>{
    console.log(3);
    await logger();
    next()
    console.log(4)
})

app.listen(3000)



//koa 核心
// let app = {};
// app.middleware = [];//用来存储use 中的函数
// app.use = function(fn){//use是个函数，use的参数也是一个函数
//     app.middleware.push(fn); //每执行一次use 就把函数丢到数组里
// }
// app.use((next)=>{
//     console.log(1);
//     next()
//     console.log(2)
// })
// app.use((next)=>{
//     console.log(3);
//     next()
//     console.log(4)
// })
// function diratch(index){
//     if(index === app.middleware.length) return ()=>{}
//     let middle = app.middleware[index];
//     // 调用了next函数就将数组中的第二个函数传进去
//     middle(()=>diratch(index+1)); //()=>diratch(index+1) 就就是我们的next函数

// }
// diratch(0)


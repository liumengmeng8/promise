

/*
koa 
特点：小巧，富有变现力，koa为了解决异步方案，支持异步编写用的async+await，可以说基于promise
- 让创建服务端更方便，封装了http
- 在原生的req，res属性上又新增了自己的封装（ctx 上下文），可以帮我们简化 pathname 之类的获取
- 中间件 就帮我们把逻辑进行拆分

ctx 上有req，res属性，这些都是原生的属性
ctx 上有request,response 属性这些都是自己封装的

let x = Object.create(ctx) 
//Object.create() 就是产生一个函数，把参数的方法都挂上去
//把ctx的东西给了x 但是x可以在任意修改，但是不会影响原有的ctx




*/


let Koa = require("koa");

let app = new Koa();

// 默认不返回结果表示文件找不到
app.use((ctx,next)=>{
    // console.log(ctx.req.url);
    // console.log(ctx.request.req.url);
    // //上面的2个是一样的，下面的2个是一样的
    // console.log(ctx.request.url);
    // console.log(ctx.url);

    //原生的没有path只能我们需要pathnane的时候自己解析，但是koa内部自己实现了path
    console.log(ctx.req.path);
    console.log(ctx.request.req.path);
    //上面的2个是一样的，下面的2个是一样的
    console.log(ctx.request.path);
    console.log(ctx.path);
    
})








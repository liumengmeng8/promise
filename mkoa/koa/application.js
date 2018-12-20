//koa  源码是用es6 写的
let http = require("http");
let path = require("path");
let fs = require("fs");
let context = require("./context");
let request = require("./request");
let response = require("./response");
let Stream = require('stream');

//发布订阅
let EventEmitter = require("events");

//Koa 去继承 EventEmitter
class Koa extends EventEmitter{
    constructor(){
        super();
        this.middleware;
        // this.context = context;//正常是这样的，但是这样修改context的时候会改变原本的context
        //Object.create(context) 原理。object.create()会创建一个实例并把context给了这个实例的原型，这个创建的实例不会有context的原型而且还有他的方法。object.create()内部就是返回一个空函数
        //Object.create(null) 就是没有原型的对象
        this.context = Object.create(context);//这样就不会了
        this.request = Object.create(request);
        this.response = Object.create(response);

        this.middlewares = [];//存储use的多个函数
    }

    //创建上下文
    createContext(req,res){ //整合的作用，自己封装一个requese和response的作用
        let ctx = this.context;
        ctx.request = this.request;
        ctx.req = ctx.request.req = req;//请求相关的

        ctx.response = this.response;
        ctx.res = ctx.response.res = res;//响应相关的

        return ctx
        
    }

    //注册中间件的方法
    use(fn){
        // this.middleware = fn;
        this.middlewares.push(fn);//每一个use 都将把参数fn函数存储到数组
    }

    //把use当中的所有函数都整合运行起来
    compose(middlewares,ctx){
        function dispatch(index){
            //如果没有注册 中间件 use ，就返回一个成功的promise
            if(index === middlewares.length) return Promise.resolve()
            let middle = middlewares[index];//第一个数组中的函数
            // middle(ctx,()=>dispatch(index+1));//默认第一个函数执行.()=>dispatch(index+1)就是我们的next函数
            //返回一个promise
            //因为在调用use的时候添加 async 回变成一个promise。但是也有不这样写的，那我们为了保证都是一个promise就都给他统一就一层promise
            return Promise.resolve(middle(ctx,()=>dispatch(index+1)));
        }
        // dispatch(0)
        return dispatch(0)
    }

    //处理用户请求到来的
    hadleRequest(req,res){
        let ctx = this.createContext(req,res);
        // this.compose(this.middlewares,ctx);//每当请求的时候需要把所有的use函数都给整合起来，并且要把上下文ctx传进去
        // this.middleware(ctx);//当中间件函数执行完毕后，需要结束响应，不然浏览器的小圈圈回一直一直转
        //我们应该把 use 所有的函数都变成(返回)promise
        let fn = this.compose(this.middlewares,ctx);
        res.statusCode = 404;//默认没有ctx.body设置值的时候就是404 并且返回 not found
        //把所有的函数进行组合，当组合的函数都执行成功后，把最终的结果响应
        fn.then(()=>{
            if(!ctx.body){
                res.end("Not Found");
            }else if(ctx.body instanceof Stream){
                res.setHeader('Content-Type','text/html;charset=utf-8')
                ctx.body.pipe(res);//写到响应中
            }else if(typeof ctx.body === "object"){//ctx.body是一个对象
                res.setHeader('Content-Type','application/json;charset=utf-8');
                res.end(JSON.stringify(ctx.body))
            }else{
                res.end(ctx.body); // 用res.end结束
            }
        }).catch(err=>{//出错的时候绑定error函数，抛出异常
            this.emit('error',err)
        })
    }
    listen(...args){
        //真正的请求服务
        let server = http.createServer(this.hadleRequest.bind(this));
        server.listen(...args);
    }

}

module.exports = Koa;







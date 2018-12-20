
let url = require("url");

let request={

    //属性访问器，相当于拦截，Object.defineProperty({get方法})
    get url(){
        return this.req.url;// this 点前面是谁就是谁 在 ctx.request.url 里，ctx.request就是this而ctx.request上有原生的req
    },
    get path(){
        let {pathname} = url.parse(this.req.url);
        return pathname
    }

}
//request这样就写好了。但是我们这样不能实现 ctx.url ctx.path 这样的取值。接下来我们在ctx上做改动
module.exports = request;




 
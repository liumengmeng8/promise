let fs = require("fs");
let path = require("path")


// fs.mkdir("s/w",(err)=>{
//     console.log(err);
//     console.log("chenggong")
// })


//同步创建目录
function myMkdirSync(url){
    //先把url 以/拆分成数组
    let arr = url.split("/");

    for(let i=0;i<arr.length;i++){
        //截取目录,并添加/
        let cur = arr.slice(0,i+1).join("/");
        try{
            fs.accessSync(cur);
        }catch(e){
            fs.mkdirSync(cur);//如果fs.accessSync 检测不到目录，则创建新的目录
        }
    }
}
myMkdirSync("w/p/d/s");

//异步创建目录
function myMkdir(url,cb){
    let arr = url.split("/");
    //设置一个定时器
    let index = 0;
    //同步是循环创建的，异步采用递归的方式，所以需要一个next函数
    function next(){
        if(index === arr.length) return cb();//在条件格式下结束循环，并把我们的回调执行
        let cur = arr.slice(0,++index).join("/");
        fs.access(cur,(err)=>{
            if(err){
                fs.mkdir(cur,()=>{//如果fs.access报错则表示没有找到这个目录，则新创建一个
                    next();//这里是为了创建下一个目录
                })
            }else{
                next();//这里是为了创建下一个目录
            }
        })
    }
    next();
}
myMkdir("p/k/l/n",()=>{
    console.log("成功")
})


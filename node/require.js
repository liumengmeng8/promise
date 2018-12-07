// let a = require("./a");



let path = require('path');
let fs = require('fs');
let vm = require("vm");

function Module(id){
    this.id = id;
    this.exports = {}
}
Module.wrap = function(content){
    return  `(function(exports,require,module,__filename,__dirname){
        ${content}
    })`
}
Module._cache = Object.create(null);
Module._extensions = {
    '.js'(module){
        let content =  fs.readFileSync(module.id,"utf8");
        let fnStr = Module.wrap(content);
        let fn = vm.runInThisContext(fnStr);
        fn.call(module.exports,module.exports,req,module);
    },
    '.json'(module){
       let content =  fs.readFileSync(module.id,"utf8");
       module.exports =  JSON.parse(content);
    }
}
Module._resolveFilename = function(req){
    let readPath = path.resolve(__dirname,req);//把相对路径转为绝对路径
    if(!path.extname(readPath)){//先判断传进来的文件有没有后缀
        let exts = Object.keys(Module._extensions); //把Module._extensions 变成数组，循环，查找 符合的文件
        for(let i=0;i<exts.length;i++){
            let cur = exts[i];
            if(fs.existsSync(req+cur)){ // fs.existsSync 采用同步的方式检测目录是否存在
                return req+cur
            }else{
                console.log("没有找到文件。");
            }
        }
    }
    return readPath;
}
function req(p){
    if(typeof p !== "string") return new Error("文件名称应该是一个字符串");
    if(p === "") return new Error("文件名不能为空")
    let readPath = path.resolve(__dirname,p);//把相对路径转为绝对路径
    let filtName = Module._resolveFilename(readPath);
    let cachedModule = Module._cache[filtName];
    if(cachedModule) return cachedModule.exports;
    let module = new Module(filtName);
    let extName = path.extname(module.id);
    Module._extensions[extName](module);
    return module.exports;
}

let r = req('./a');
console.log(r);






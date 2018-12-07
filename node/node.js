
//node 中 没有window，全局变量是global
// console.log(this);//{} 空对象 因为模块化的原因

// function a(){
//     console.log(this)
// }
// a();

//gobale中的属性/方法

//process 进程，线程都被包含了进程里面。进程就是计算器分配资源的一个基本单位
//js 是单线程的（主线程是单线程的）一个进程里面，只有一个主线程

// 在计算器中文件都是以二进制实现的
//Buffer 操作文件，默认清空下的操作的内存，内存的表示方式 buffer

//process
// console.log(process.cwd());//current working directory  当前执行的文件夹目录 // /Users/mm/lm/mm/node

//每个文件，都会赠送2个属性，__dirname 、 __filename
// console.log(__dirname) //是一个绝对路径代表当前的文件所在目录 /Users/mm/lm/mm/node
// console.log(__filename) // 代表当前文件的文件名，也是一个绝对路径 /Users/mm/lm/mm/node/node.js

//process.env 用来区分线上和线下环境，设置环境变量（在哪设置，在哪取出） env 这个环境变量 就是指我们电脑的环境变量
// console.log(process.env); 
// 设置环境变量
//set NODE_ENV=dev
//mac: export NODE_ENV=dev
//取
// process.env.NODE_ENV
//在react vue 项目中，会区分本地开发和上线的问题
// let ajax_url = '';
// if(process.env.NODE_ENV === "dev"){
//     ajax_url = '本地开发地址'
// }else{
//     ajax_url = '线上地址'
// }
// console.log(ajax_url);

//参数列表
// console.log(process.argv);
//[ '/usr/local/bin/node', '/Users/mm/lm/mm/node/node.js' ]  直接在代码中运行的这2个没用，
//在 命令行传参 获取的[ '/usr/local/bin/node','/Users/mm/lm/mm/node/node.js','--name','lm','--age', '24'  ] ,那我们如何拿到这样的形式呢？.name 拿到lm，.age拿到24
// let r = process.argv.slice(2).reduce((a,b,index,arr)=>{//reduce 帮助我们把数组变成对象
//     if(b.includes('--')){//includes es7语法，检测b是否包含--
//         // 不要--
//         a[b.slice(2)] = arr[index+1]
//     }
//     return a;
// },{})
// console.log(r);//{ name: 'lm', age: '24' }

//process.nextTick 下以队列， 微任务，异步
process.nextTick(()=>{ //变相的then方法
    console.log('xxx');
})
console.log(22);

// commonjs 流程
// require方法 
// Module._load 加载模块
// Module._resolveFilename 解析文件名 把一个相对路径转化成绝对路径 加一个.js后缀
// Module._cache 存放缓存的
// 如果没有缓存 new Module 就创建一个模块
// Module 中 1) id 路径 2) exports ={}
// 把模块缓存起来 绝对路径
// tryModuleLoad 尝试加载模块 load();
// 如果是json 按照json 来处理 如果js 按照js的方式来处理
// Module.extensions[];

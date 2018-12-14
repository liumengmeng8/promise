let fs = require("fs");
let path = require("path");

// let dir = fs.readdirSync("p");
// let dirAry = dir.map(item=>path.join("p",item));
// for(let i = 0;i <dirAry.length;i++){
//     let statObj = fs.statSync(dirAry[i]);
//     if(statObj.isFile()){
//         fs.unlinkSync(dirAry[i])
//     }else{
//         console.log(dirAry[i]);
//         fs.rmdirSync(dirAry[i]);
//     }
// }
// fs.rmdirSync("p")


// function Myrmdir (url){
//     let statObj = fs.statSync(url);
//     console.log(url)
//     if(statObj.isDirectory()){
//         let dirs = fs.readdirSync(url);
//         dirs.map(dir=>{
//             let cur = path.join(url,dir);
//             Myrmdir(cur);
//         })
//         fs.rmdirSync(url);
//     }else{
//         fs.unlinkSync(url);
//     }
// }
// Myrmdir("w")

// function rmDir(p,callback){
//     fs.stat(p,(err,statObj)=>{
//         if(statObj.isDirectory()){
//             fs.readdir(p,(err,dirs)=>{
//                 dirs = dirs.map(dir=>path.join(p,dir));
//                 let index = 0;
//                 function next(index){
//                     if(dirs.length == index) return  fs.rmdir(p,callback)
//                     rmDir(dirs[index],()=>{next(index+1);})
//                 }
//                 next(index)
//             })
//         }else{
//             fs.unlink(p,callback)
//         }
//     })
// }
// rmDir("w",()=>{
//     console.log("删除了")
// })

// 先序 深度 并行
// function removeDir(p,callback){
//     fs.stat(p,(err,statObj)=>{
//       if(statObj.isDirectory()){
//         fs.readdir(p,(err,dirs)=>{
//           dirs = dirs.map(dir=>path.join(p,dir))
//           if(dirs.length == 0) return fs.rmdir(p,callback)
//           let index = 0;
//           function all(){
//             index++
//             console.log(index," === ",dirs.length)
//             if(index === dirs.length){
//               fs.rmdir(p,callback)
//             }
//           }
//           dirs.map(dir=>{
//             console.log(dirs[index])
//             removeDir(dir,()=>{
//               all();
//             })
//           })
//         })
//       }else{
//         fs.unlink(p,callback())
//       }
//     })
//   }
//   removeDir("w",()=>{
//     console.log("删除了")
//   })

// //promise 版 先序 深度 并行

// function promiseRmDir(p){
//   return new Promise((resolve,reject)=>{
//     fs.stat(p,(err,statObj)=>{
//       if(statObj.isDirectory()){
//         fs.readdir(p,(err,dirs)=>{
//           dirs = dirs.map(dir=>path.join(p,dir))
//           dirsAry = dirs.map(dir=>{
//             return promiseRmDir(dir)
//           })
//           console.log(dirsAry);
//           Promise.all(dirsAry).then(data=>{
//             fs.rmdir(p,resolve)
//           })
//         })
//       }else{
//         fs.unlink(p,resolve)
//       }
//     })
//   })
// }
// promiseRmDir("w").then(data=>{
//   console.log("删除 成功了")
// })

// 异步广度
function wideDir(p,callback){
    let arr = [p];
    let index = 0;
    function next(index){
      let current = arr[index];
      fs.stat(current,(err,statObj)=>{
          if(statObj.isDirectory()){
            fs.readdir(current,(err,dirs)=>{
              dirs = dirs.map(dir=>path.join(current,dir))
              arr = [...arr,...dirs]
              next(++index)
              
            })
          }else{
            arr.splice(index,1);
            index--;
            fs.unlink(current,callback)
          }
      })
      if(arr.length != 0 ){
        rmItemDir(arr.length-1)
      }
    }
    function rmItemDir(index){
      let cur = arr[index];
      fs.rmdir(cur,()=>{
        rmItemDir(index)
      })
    }
    next(index)
  
  }
  wideDir("p",()=>{
    console.log("删除成功")
  })
class Promose{
    constructor(execuor){
        this.value = "";
        this.reason = "";
        this.state = "pending";
        this.onResolveCallback = [];
        this.onRejectCallback = [];

        let resonlve = value=>{
            if(this.state === "pending"){
                this.value = value;
                this.state === "resolved";
            }
        }
        let reject = reason =>{
            if(this.state === "pending"){
                this.reason = reason;
                this.state = "rejected";
            }
        }
        try{
            execuor(resonlve,reject);
        }catch(e){
            reject(e)
        }
    }
    // promsie 核心事件
    resolvePromise(promise2,x,resolve,reject){
        if(x === promise2){//表示是同一个东西，就循环引用
            reject(new TypeError("循环引用啦"))
        }
        let clled;
        if(x !== null && (typeof x === "function" || typeof x === "object")){//表示x可能是一个promise
            try{//x可能是一个异常
                let then = x.then;
                if(typeof then === "function"){//判断x.then是不是一个函数，如果是一个函数则认为就是一个promise
                    then.call(x,y=>{
                        if(!clled){
                            clled = true;
                        }else{
                            return
                        }
                        // reject(y);
                        resolvePromise(promise2,y,resolve,reject);// 有可能 y也是一个promise，所以用递归一直递归到是一个普通值
                    },r=>{
                        if(!clled){
                            clled = true;
                        }else{
                            return
                        }
                        reject(r);
                    })
                }else{//如果x上面有then属性，但可能是这样的{then:111}
                    resolve(x)
                }
            }catch(e){
                if(!clled){
                    clled = true;
                }else{
                    return
                }
                reject(e);
            }
        }else{//x是一个普通值
            resolve(x);
        }
    }
    then(onFulfilled,onReject){
        let promise2 = new Promise((resolve,reject)=>{
            if(this.state === "resolved"){ 
                setTimeout(()=>{ // 加定时器是因为要异步拿到promise2，同步那不到
                    try{
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e);
                    }
                },0)
            }
            if(this.state === "rejected"){
                setTimeout(() => {
                    try{
                        let x = onReject(this.reason);
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e);
                    }
                }, 0);
            }
            if(this.state === "pending"){
                this.onResolveCallback.push(()=>{
                    setTimeout(() => {
                        try{
                            let x = onFulfilled();
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(e){
                            reject(e);
                        }
                    }, 0);
                });
                this.onRejectCallback.push(()=>{
                    setTimeout(() => {
                        try{
                            let x = onReject();
                            resolvePromise(promise2,x,resolve,reject);
                        }catch(e){
                            reject(e);
                        }
                    }, 0);
                });
            }
        })
        return promise2
    }

    catch(errFn){
        return this.then(null,errFn)
    }
    finally(callback){
        return this.then(value=>{
            return Promise.resolve(callback()).then(()=>{
                return value;
            })
        },reason=>{
            return Promise.resolve(callback()).then(()=>{
                throw reason;
            })
        })
    }
    static reject(reason){
        return new Promise((resolve,reject)=>{
            reject(reason);
        })
    }
    static resolve(value){
        return new Promise((resolve,reject)=>{
            resolve(value);
        })
    }

    static all(promise){
        return new Promise((resolve,reject)=>{
            let arr = [];
            let i = 0;
            let processData = (inx,data)=>{
                arr[inx] = data;
                if(++i === promise.length){
                    resolve(arr)
                }
            }
            for(let i = 0;i<promise.length;i++){
                let promise = promose[i];
                if(typeof promise.then === "function"){
                    promise.then(value=>{
                        processData(i,value);
                    })
                }else{
                    processData(i,promise)
                }
            }
        })
    }
    static race(promise){
        return new Promise((resolve,reject)=>{
            for(let i=0;i<promise.length;i++){
                let promise = promise[i];
                if(typeof promise.then === "function"){
                    promise.then(resolve,reject);
                }else{
                    resolve(promise);
                }
            }
        })
    }
    static deferred(){
        let dfd = {};
        dfd.Promise = new Promise((resolve,reject)=>{
            dfd.resolve = resolve;
            dfd.reject = reject;
        })
        return dfd;
    }

}

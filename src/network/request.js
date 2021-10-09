import axios from 'axios'

//5.使用拦截器：
export function request(config) {
    //1.创建axios实例
    const instance = axios.create({
        baseURL: "http://152.136.185.210:7878/api/hy66",

        timeout: 5000
    })
    //2.axios拦截器
    // axios.interceptors(全局拦截器，这里是实例拦截器)
    // use()需要传入两个函数作为参数,分别对于请求成功和请求失败
    instance.interceptors.request.use(config => {       //config只是回调传过来的参数，参数的名字可以自己命名，不一定叫config,err也是，但错误一般都叫err
        //console.log(config);//baseURL,timeout,headers等配置信息，可见成功把请求拦截了，控制台还打印了err,但不是请求失败，而是main.js的响应失败，所以还要返回config
        //拦截下来要作什么
        //1.比如config中的一些信息不符合服务器的需求。比如换个headers，但是实际上可以在一开始请求的时候就在实例里面写好
        //2.比如每次发送网络请求时，都希望在界面中显示一个请求的图样(比如请求没成功时界面在转圈圈)
        //3.某些网络请求(比如登录(token)),必须携带一些特殊的信息
        return config
    }, err => {
        // console.log(err);
    })

    instance.interceptors.response.use(res => {
        //console.log(res);       //除了data，其他东西都是axios自己添加的配置
        //console.log(res.data);
        return res.data        //这里响应拦截下来要做的处理不是在这里做，要在main.js做，所以返回data,否则那边是undefined
    }, err => {
        console.log(err);
    })


    //3.发送真正的网络请求
    return instance(config)
    //为什么之前instance后面可以跟.then和.catch,是因为调用这个时其本身就是返回一个Promise,可以看源码，main那边可以一样使用.then
}
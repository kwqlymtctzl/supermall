//脚手架3的别名配置方式,不起作用
// module.exports = {
//     // Webpack配置
//     configureWebpack: {
//         // 解决
//         resolve: {
//             //扩展
//             extensions: [], //这里默认配置了css,js,后缀就不用写这些了
//             // 别名
//             alias: {
//                 '@': 'src',  //默认配置的别名
//                 'assets': '@/assets',
//                 'common': '@/common',
//                 'components': '@/components',
//                 'network': '@/network',
//                 'views': '@/views',
//                 //router就一个地方引用,组件用法this.$router,store一般在组件的用法是this.$store
// }

//                 以后试试这个：
//                 '@': resolve('src'),  
//                 'assets': resolve('src/assets'),
//                 'common': resolve('src/common'),
//                 'components': resolve('src/components'),
//                 'network': resolve('src/network'),
//                 'views': resolve('src/views'),




//         }
//     }
// }

//脚手架4的配置别名方式
const path = require('path');        //引入path模块
function resolve(dir) {
    return path.join(__dirname, dir)  //path.join(__dirname)设置绝对路径
}
module.exports = {
    chainWebpack: (config) => {
        config.resolve.alias
            //set第一个参数：设置的别名，第二个参数：设置的路径
            .set('@', resolve('./src'))
            .set('assets', resolve('./src/assets'))
            .set('components', resolve('./src/components'))
            .set('views', resolve('./src/views'))
            .set('common', resolve('./src/common'))
    },
    devServer: {
        port: 8080, // 设置端口号
        host: '192.168.177.106', // ip
        disableHostCheck: true, //是否关闭用于 DNS 重绑定的 HTTP 请求的 HOST 检查
        hotOnly: false, // 热更新
        https: false, // https:{type:Boolean}配置前缀
        open: false, //配置自动启动浏览器
        proxy: null,  //设置代理
    }
}

// 对于javascript引入：
// 第一种写法：
// import GoodsList from "components/content/goods/GoodsList.vue";
// 第二种写法：
// import GoodsList from "@/components/content/goods/GoodsList.vue";


// 对于css引入：
// 第一种写法：
// @import "assets/css/base.css";
// 第二种写法：
// @import "~@/assets/css/base.css";


// 对于Vue页面其他资源引入：
// 第一种写法：加上 @
// <img slot="item-icon" src="@/assets/img/tabbar/home.svg">
// 第二种写法：加上 ~@
// <img slot="item-icon" src="~@/assets/img/tabbar/home.svg"> 

// 对于路由中的赖加载：
// 第一种写法：这里不能用~@
// const Home = () => import('@/views/home/Home')
// 第二种写法：
// const Home = () => import('../views/home/Home')

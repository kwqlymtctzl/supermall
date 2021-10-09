import { request } from './request';

// 不是使用export default的 ，导入时都像上面用{}导入
export function getHomeMultidata() {
    return request({
        url: '/home/multidata'
    })
}
//需要传参数过来,上面的导出和这个导出，在Home可以放在一起导入
export function getHomeGoods(type, page) {
    return request({
        url: '/home/data',
        params: {
            type,
            page
        }
    })
}
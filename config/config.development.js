/*
 */


export const config = {
    appName:'zhuli',
    weixin_gate:{
        url:'http://weixin_gate_test.gankao.com'
    },
    gankao_main_site:{
        url:"http://gktest2.gankao.com"
    },
    redis: {
        host: "127.0.0.1",
        port: 6379,
        cache_prefx:'prod_zhuli_',
        defaultExpireSecond:10*60
    },
    session: {
        secret: '62c3b695&^*%1241d%9df047i'
    }
}

const express = require('express');

const app = express();

const path = require('path');

const axios = require('axios');

axios.defaults.baseURL = 'https://wy.iyouhun.cn';

// 伪装CSRF
axios.interceptors.request.use(function (config) {
    config.headers = {
        ...config.headers,
        'x-requested-with': 'XMLHttpRequest',
        'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Mobile Safari/537.36',
        'origin': 'https://wy.iyouhun.cn',
        'referer': 'https://wy.iyouhun.cn/index/index/login.html',
        'sec-ch-ua-platform': 'Android',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }

    return config;
});

// 跨域
app.use((req, res, next) => {
    // 允许客户端出现跨域发送请求时携带cookie
    res.header('Access-Control-Allow-Credentials', true);

    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.end();
    } else {
        next();
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

// 登录
app.use('/login', require('./api/login'));

// 信息
app.use('/info', require('./api/info'));

// 听歌
app.use('/song', require('./api/song'));

// 签到
app.use('/sign', require('./api/sign'));

// 退出登录
app.use('/logout', require('./api/logout'));

// 错误处理
app.use((err, req, res, next) => {
    const { msg } = err;

    res.json({
        code: 500,
        msg: msg || '服务器内部错误'
    })
});

app.listen(3006, () => {
    console.log('服务启动成功,请访问http://127.0.0.1:3006');
})
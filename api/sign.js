
const axios = require('axios');

module.exports = async (req, res, next) => {

    try {
        var { data } = await axios({
            url: '/index/user/sign',
            method: 'post',
            headers: {
                cookie: req.headers.cookie || ''
            }
        });
    } catch (err) {
        next({ msg: '签到失败，请稍后重试!' });
        return;
    }

    res.json(Object.assign({ code: 200 }, data));
}
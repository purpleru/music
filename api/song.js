
const axios = require('axios');

module.exports = async (req, res, next) => {

    try {
        var { data } = await axios({
            url: '/index/user/song',
            method: 'post',
            headers: {
                cookie: req.headers.cookie || ''
            }
        });
    } catch (err) {
        next({ msg: '听歌失败,请联系技术人员修复！' });
        return;
    }


    res.send(Object.assign({ code: 200 }, data));
}
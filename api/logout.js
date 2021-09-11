
const axios = require('axios');

module.exports = async (req, res) => {

    const { data } = await axios({
        url: '/index/user/logOut',
        method: 'post',
        headers: {
            cookie: req.headers.cookie || ''
        }
    });

    res.json(Object.assign({ code: 200 }, data));
}
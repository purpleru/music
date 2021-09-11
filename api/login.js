
const axios = require('axios');

const queryString = require('querystring');

const cookie = require('cookie');

const cookiParser = require('set-cookie-parser');

module.exports = async (req, res) => {

    const { data, headers } = await axios.post('/index/index/status', queryString.stringify(req.body));

    const cookies = cookiParser(headers['set-cookie'] || []).map((item) => {
        delete item.domain;
        return cookie.serialize(item.name, item.value, item);
    });

    res.append('set-cookie', cookies).json(data);
}

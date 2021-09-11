
const cheerio = require('cheerio');

const axios = require('axios');


function parserData(htmlText) {
    const $ = cheerio.load(htmlText);

    const resData = {
        code: 200
    }

    $('.card-block p').each((index, el) => {

        const text = $(el).find('font').text();

        switch (index) {
            case 0:
                resData.song = text.trim();
                return;
            case 1:
                resData.level = text.match(/\d+/)[0] || 0;
                return;
        }
    });

    $('.layui-progress').each((index, el) => {

        const text = $(el).prev().text();
        const progress = $(el).find('.layui-progress-bar').prop('lay-percent');

        switch (index) {
            case 0:
                resData.needDay = {
                    val: text,
                    progress
                }
                return;
            case 1:
                resData.needSong = {
                    val: text,
                    progress
                }
                return;
        }

    });

    resData.avatar = $('.bg-img img').attr('src');
    resData.uname = $('h3 > b').eq(1).text().trim();

    return resData;
}

module.exports = async (req, res) => {

    const { data, headers } = await axios.get('/index/user/home.html', {
        headers: {
            cookie: req.headers.cookie || ''
        }
    });



    if (data instanceof Object) {
        res.json(data);
        return;
    } else {
        res.json(parserData(data));
    }

}
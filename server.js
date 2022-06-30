
const express = require('express');

const app = express();

const path = require('path');

const port = 3006;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log('服务启动成功,请访问http://127.0.0.1:' + port);
});
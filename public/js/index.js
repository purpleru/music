
var baseURL = 'http://tools.wgudu.com:3000';

$(document).ajaxSend(function (evt, request, settings) {
    var token = window.localStorage.getItem('token');

    var url = new URL(baseURL.replace(/\/*$/, '') + settings.url);
    url.searchParams.set('version', '2.3');
    url.searchParams.set('token', token);

    settings.url = url.toString();
});

var captchaIns;
initNECaptcha({
    element: '#captchaIns',
    captchaId: '73a18dc827b24b18ad0783701a75277d',
    mode: 'popup',
    width: '320px',
    enableClose: false,
    maxVerification: 8,
    onClose: function () {
    },
    onReady: function (instance) {
    },
    onVerify: verify
}, function load(instance) {
    // 初始化成功后得到验证实例instance，可以调用实例的方法
    captchaIns = instance
}, function error(err) {
    alert('网络错误!');
});

function verify(err, verifyData) {

    if (err) return false;

    var state = captchaIns._captchaIns.$store.state;

    var token = window.localStorage.getItem('token');

    var uname = $('[name="username"]').val(),
        password = $('[name="password"]').val();

    $.get({
        url: '/login/b',
        data: {
            token: token
        },
        beforeSend: function () {
            tip('正在登录中,请稍后...', 'info');
            $('[type="submit"]').prop('disabled', true);
        },
        success: function (data) {

            if (data.code === 200) {
                window.localStorage.setItem('token', data.token);
                login(data.token || token, {
                    phone: uname,
                    password: password,
                    secureCaptcha: verifyData.validate,
                    fp: state.fingerprint
                });
            } else {
                tip(data.msg);
                $('[type="submit"]').prop('disabled', false);
            }
        },
        error: function () {
            tip('登录失败，服务器错误!');
            $('[type="submit"]').prop('disabled', false);
        }
    });

}

// 提示 success info warning danger
function tip(msg, type) {
    var tip = $('.alert-tip'),
        types = ['success', 'info', 'warning', 'danger'],
        classes = ['alert', 'alert-tip'];

    tip[0].className = '';

    if (types.indexOf(type) > -1) {
        classes.push('alert-' + type);
    } else {
        classes.push('alert-danger');
    }

    tip.addClass(classes).fadeIn(300).html(msg);
}

// 账号信息
function user(data) {
    var user = window.localStorage.getItem('user');

    try {
        user = JSON.parse(user || '{}');
    } catch (err) {
        window.localStorage.removeItem('user');
        return {};
    } finally {
        var userInfo = Object.assign(user, data);
        if (arguments.length === 0) {
            return user;
        } else {
            window.localStorage.setItem('user', JSON.stringify(userInfo));
        }
    }
}

$('#login-form').on('submit', function () {

    var complete = $(this).serializeArray().some(({ value, name }) => {
        return value.trim().length === 0 && name !== 'NECaptchaValidate';
    });

    if (complete) {
        tip('请输入完整!');
        return false;
    }

    captchaIns.popUp();

    return false;
});


// 登录
function login(token, params) {
    $.ajax({
        url: '/login/phone?token=' + token,
        type: 'post',
        data: params,
        success: function (data) {

            var profile;

            if (data.token) {
                window.localStorage.setItem('token', data.token);
            }

            if (data.code === 200) {
                profile = data.profile;
                user(Object.assign({ isLogin: true, userId: profile.userId, nickname: profile.nickname }, params));
                info();
                $('#login-form').hide();
                $('#my-core').fadeIn(300);
                tip('登录成功', 'info');
                window.localStorage.setItem('account', JSON.stringify(data.account));
                window.sessionStorage.setItem('info', JSON.stringify(profile));
            } else {
                tip(data.msg || '登录失败,请稍后再试!');
                captchaIns.refresh();
            }
            console.log(data);
            $('[type="submit"]').prop('disabled', false);
        },
        error: function () {
            tip('登录失败，服务器错误!');
            $('[type="submit"]').prop('disabled', false);
        }
    })
}

// 信息
function info() {

    $('.alert-tip').hide();

    var userInfo = user();

    var info = window.sessionStorage.getItem('info');

    try {
        if (typeof info === 'string') {
            info = JSON.parse(info);
        }
    } catch (err) {
        info = null;
    }

    if (info) {
        $('#show-info').html(template('info', info));
        tip(info.msg || '欢迎再次使用，' + userInfo.nickname, 'info');
    } else {

        $.get('/user/detail?userId=' + userInfo.userId, function (data) {
            if (data.code === 200) {
                $('#show-info').html(template('info', data));
                if (data.msg) {
                    tip(data.msg, 'info');
                }
                window.sessionStorage.setItem('info', JSON.stringify(data));
            } else {
                tip(data.msg || '获取信息失败');
            }

        });
    }

}


// 记住密码
$('[type="checkbox"]').change(function () {
    user({ checked: this.checked });
});

function init() {

    var userInfo = user();

    var token = window.localStorage.getItem('token');

    if (userInfo.isLogin) {
        info();
        $('#login-form').hide();
        $('#my-core').fadeIn(300);
    } else {
        $('#login-form').show();
        $('#my-core').hide();
    }

    $('[name="username"]').val(userInfo.phone);
    $('[type="checkbox"]').prop('checked', userInfo.checked);
    if (userInfo.checked) {
        $('[name="password"]').val(userInfo.password);
    }

    if (!token) {
        $.get('/login/d', function (data) {
            if (data.code === 200) {
                window.localStorage.setItem('token', data.token);
            }
        });
    }

}

init();

// 签到
function sign() {

    var _this = this;

    $.ajax({
        url: '/signin',
        beforeSend: function () {
            $(_this).attr('disabled', true);
            tip('正在签到中，请稍后...', 'info');
        },
        success: function (data) {
            $(_this).attr('disabled', false);

            if (data.code === 200) {
                tip('签到成功，EX+' + data.point, 'success');
            } else {
                tip('签到失败，' + data.msg);
            }

        }
    })
}

// 听歌
function song() {

    var _this = this;

    $.ajax({
        url: '/scrobble',
        beforeSend: function () {
            $(_this).attr('disabled', true);
            tip('正在努力听歌中，请稍后...', 'info');
        },
        success: function (data) {
            $(_this).attr('disabled', false);

            if (data.code === 200) {
                tip('一键听歌成功，本次听歌共' + data.song_detail.length + '首歌曲', 'success');
            } else {
                tip(data.msg || '一键听歌失败,请稍后重试!');
            }

        }
    });

}

function logout() {

    if (window.confirm('是否确定退出账号登录？')) {
        $.get('/logout', function (data) {
            console.log(data);
            user({
                isLogin: false
            });
            window.sessionStorage.removeItem('info');
            init();
            tip('暂时只支持手机号登录，邮箱的请绑定手机哦~', 'info')
        });
    }

}

$('#sign').click(sign);
$('#song').click(song);
$('#logout').click(logout);
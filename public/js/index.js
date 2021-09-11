
var baseURL = location.origin;

$(document).ajaxSend(function (evt, request, settings) {
    settings.url = baseURL.replace(/\/*$/,'') + settings.url;
});


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

    var complete = $(this).serializeArray().some(({ value }) => {
        return value.trim().length === 0;
    });

    if (complete) {
        tip('请输入完整!');
        return false;
    }

    var captcha1 = new TencentCaptcha('2035560721', function (result) {

        if (result.ret === 0) {
            $.ajax('/login', {
                url: '/login',
                beforeSend: function () {
                    tip('正在登录中，请稍后...', 'info');
                    $('[type="submit"]').attr('disabled', true);
                },
                data: {
                    username: $('[name="username"]').val(),
                    password: $('[name="password"]').val(),
                    Randstr: result.randstr,
                    Ticket: result.ticket
                },
                type: 'post',
                success: login,
                error: function () {
                    tip('登录失败，服务器错误!');
                    $('[type="submit"]').attr('disabled', false);
                }
            });
        } else if (result.ret === 2) {
            tip('请完成验证码操作');
        }

        // console.log(result);
    });

    captcha1.show();

    return false;
});



// 登录
function login(data) {

    var isSvaePassword = $('[type="checkbox"]').prop('checked');

    if (data.status === 1) {
        info();
        $('#login-form').hide();
        $('#my-core').fadeIn(300);
        tip(data.msg || '登录成功！', 'success');
        $('[type="submit"]').attr('disabled', false);

        if (isSvaePassword) {
            user({
                uname: $('[name="username"]').val(),
                password: $('[name="password"]').val()
            });
        }
    } else {
        tip(data.msg || '登录失败，请使用手机号登录');
        $('[type="submit"]').attr('disabled', false);
    }
}

// 信息
function info() {

    $('.alert-tip').hide();

    var info = window.sessionStorage.getItem('info');

    try {
        info = JSON.parse(info);
    } catch (err) {
        info = null;
    }

    if (info) {
        $('#show-info').html(template('info', info));
    } else {

        $.get('/info', function (data) {
            if (data.code === 200) {
                $('#show-info').html(template('info', data));
                window.sessionStorage.setItem('info', JSON.stringify(data));
            } else {
                tip('获取信息失败');
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

    $('[name="username"]').val(userInfo.uname);
    $('[type="checkbox"]').prop('checked', userInfo.checked);
    if (userInfo.checked) {
        $('[name="password"]').val(userInfo.password);
    }

    if (Cookies.get('ylnwyy_token')) {
        $('#login-form').hide();
        $('#my-core').show();
        info();
    } else {
        $('#login-form').show();
        $('#my-core').hide();
    }
}

init();

// 签到
function sign() {

    var _this = this;

    $.ajax({
        url: '/sign',
        beforeSend: function () {
            $(_this).attr('disabled', true);
            tip('正在签到中，请稍后...', 'info');
        },
        success: function (data) {
            $(_this).attr('disabled', false);

            if (data.status === 1 && data.code === 200) {
                tip('签到成功', 'success');
            } else {
                tip('签到失败,请稍后重试!');
            }

        }
    })
}

// 听歌
function song() {

    var _this = this;

    $.ajax({
        url: '/song',
        beforeSend: function () {
            $(_this).attr('disabled', true);
            tip('正在努力听歌中，请稍后...', 'info');
        },
        success: function (data) {
            $(_this).attr('disabled', false);

            if (data.status === 1 && data.code === 200) {
                tip('一键听歌成功', 'success');
            } else {
                tip('一键听歌成功,请稍后重试!');
            }

        }
    });

}

function logout() {

    if (window.confirm('是否确定退出账号登录？')) {
        $.get('/logout', function (data) {
            Cookies.remove('ylnwyy_token');
            window.sessionStorage.removeItem('info');
            init();
            tip('暂时只支持手机号登录，邮箱的请绑定手机哦~', 'info')
        });
    }

}

$('#sign').click(sign);
$('#song').click(song);
$('#logout').click(logout);
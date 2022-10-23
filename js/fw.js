var address =
  /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
var zzms = /^1000|([1-9]|[1-9]\d|[1-9]\d{2}|[1-5]\d{3}|60000){4,6}$/;
var dz = document.querySelector('#dz');
var dk1 = document.querySelector('#dk1');
var dk2 = document.querySelector('#dk2');
var ys = document.querySelector('#ys');
var btn = document.querySelector('#btn');
var dkdk = document.querySelector('#dkdk');
var dkdk1 = document.querySelector('#dkdk1');
// 校验IP地址
dz.onfocus = function () {
  this.nextElementSibling.className = 'alert alert-info';
  this.nextElementSibling.innerHTML = '请输入要检测的地址，建议输入ip，本地默认为127.0.0.1';
};
dz.onblur = function () {
  if (address.test(this.value)) {
    this.nextElementSibling.className = '';
    this.nextElementSibling.innerHTML = '';
    btn.removeAttribute('disabled');
  } else {
    this.nextElementSibling.className = 'alert alert-danger';
    this.nextElementSibling.innerHTML = 'IP地址输入错误，请重新输入！';
    btn.setAttribute('disabled', '');
  }
};
// 端口提示
dk1.onfocus = function () {
  dkdk.className = 'alert alert-info';
  dkdk.innerHTML = '端口号的范围是从1～65535';
};
dk1.onblur = function () {
  var a = dk1.value;
  var b = dk2.value;
  if (b < a || b > 65535) {
    dkdk.className = 'alert alert-danger';
    dkdk.innerHTML = '端口输入错误，结束端口必须 ≥ 起始端口且＜65535';
    btn.setAttribute('disabled', '');
  } else {
    dkdk.className = '';
    dkdk.innerHTML = '';
    btn.removeAttribute('disabled');
  }
};

//端口检测
dk2.onfocus = function () {
  dkdk.className = 'alert alert-info';
  dkdk.innerHTML = '端口号的范围是从1～65535';
};
dk2.onblur = function () {
  var a = dk1.value;
  var b = dk2.value;
  if (b < a || b > 65535) {
    dkdk.className = 'alert alert-danger';
    dkdk.innerHTML = '端口输入错误，结束端口必须 ≥ 起始端口且＜65535';
    btn.setAttribute('disabled', '');
  } else {
    dkdk.className = '';
    dkdk.innerHTML = '';
    btn.removeAttribute('disabled');
  }
};
//延时检测
ys.onfocus = function () {
  this.nextElementSibling.className = 'alert alert-info';
  this.nextElementSibling.innerHTML = '单位为毫秒，填写1000表示1000ms未通过则为端口关闭';
};
ys.onblur = function () {
  if (zzms.test(this.value)) {
    this.nextElementSibling.className = '';
    this.nextElementSibling.innerHTML = '';
    btn.removeAttribute('disabled');
  } else {
    this.nextElementSibling.className = 'alert alert-danger';
    this.nextElementSibling.innerHTML = '请输入1000-60000之间的整数！';
    btn.setAttribute('disabled', '');
  }
};

var AttackAPI = {};
AttackAPI.PortScanner = {};
AttackAPI.PortScanner.scanPort = function (callback, target, port, portlg, timeout) {
  var timeout = timeout == null ? 100 : timeout;
  var img = new Image();
  img.onerror = function () {
    if (!img) return;
    img = undefined;
    callback(target, port, ' --- 开启');
  };

  img.onload = img.onerror;
  img.src = 'http://' + target + ':' + port;

  setTimeout(function () {
    if (!img) return;
    img = undefined;
    callback(target, port, ' --- 关闭');
  }, timeout);
};
AttackAPI.PortScanner.scanTarget = function (callback, target, port, portlg, timeout) {
  for (var index = port; index <= portlg; index++)
    AttackAPI.PortScanner.scanPort(callback, target, index, portlg, timeout);
};

var result = document.getElementById('result');
var callback = function (target, port, status) {
  result.value += target + ':' + port + status + ' \n';
};
var scan = function (form) {
  // 清空结果
  var obj = document.getElementById('result');
  obj.value = '';
  // 执行回调函数
  AttackAPI.PortScanner.scanTarget(
    callback,
    form.target.value,
    form.port.value,
    form.portlg.value,
    form.timeout.value
  );
};
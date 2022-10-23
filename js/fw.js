var address =
  /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
var zzms = /^[0-9]{4,6}$/;
var dz = document.querySelector('#dz');
var dk1 = document.querySelector('#dk1');
var dk2 = document.querySelector('#dk2');
var ys = document.querySelector('#ys');
var btn = document.querySelector('#btn');
var dkdk = document.querySelector('#dkdk');

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
  dkdk.className = '';
  dkdk.innerHTML = '';
};

//端口检测
dk2.onfocus = function () {
  dkdk.className = 'alert alert-info';
  dkdk.innerHTML = '端口号的范围是从1～65535';
};
dk2.onblur = function () {
  dkdk.className = '';
  dkdk.innerHTML = '';
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
// 请求逻辑
var AttackAPI = {};
AttackAPI.PortScanner = {};
AttackAPI.PortScanner.scanPort = function (callback, target, port, portlg, timeout) {
  var timeout = timeout == null ? 100 : timeout;
  var msg = new Image();
  msg.onerror = function () {
    if (!msg) return;
    msg = undefined;
    callback(target, port, ' --- 开启');
  };

  msg.onload = msg.onerror;
  msg.src = 'http://' + target + ':' + port;

  setTimeout(function () {
    if (!msg) return;
    msg = undefined;
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
  if (dk1.value == '' || dk2.value == '') {
    dkdk.className = 'alert alert-danger';
    dkdk.innerHTML = '请输入端口号的区间范围，例如80-88';
    return;
  }
  if (dk1.value > dk2.value) {
    dkdk.className = 'alert alert-danger';
    dkdk.innerHTML = '端口范围输入错误，结束端口必须 ≥ 起始端口且＜65535';
    return;
  } else if (dk2.value > 65535) {
    dkdk.className = 'alert alert-danger';
    dkdk.innerHTML = '端口范围输入错误，结束端口必须 ≥ 起始端口且＜65535';
    return;
  }
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

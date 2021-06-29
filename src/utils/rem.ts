// rem等比适配配置文件
// 基准大小
const baseSize = 100;
// 设置 rem 函数
function setRem() {
  const scale = document.documentElement.clientWidth / 375;
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 1) + "px";
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.onresize = function() {
  setRem();
};

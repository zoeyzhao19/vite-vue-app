import { App } from "vue";
import elementPlus from "element-plus";
// import *** 样式文件 自定义主题变量或引入组件本身或下载主题
const element = (app: App): void => {
  app.use(elementPlus);
};

export default element;

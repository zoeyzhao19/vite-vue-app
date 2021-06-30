import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import viteSvgIcons from "vite-plugin-svg-icons";
import path from "path";
import { minifyHtml, injectHtml } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteSvgIcons({
      // 配置路劲在你的src里的svg存放文件
      iconDirs: [path.resolve(__dirname, "src/icons/svg")],
      symbolId: "icon-[dir]-[name]"
    }),
    minifyHtml(),
    injectHtml({
      injectData: {
        title: "Vite App",
        cdn: process.env.NODE_ENV === "development" ? false : true
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
  // build: {
  //   // 依赖外置
  //   rollupOptions: {
  //     external: ["vue", "element3"],
  //     output: {
  //       globals: {
  //         vue: "Vue",
  //         element3: "ELEMENT"
  //       }
  //     }
  //   }
  // }
});

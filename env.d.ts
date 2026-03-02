/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 默认值可设置为项目备案号，如果不配置则组件会隐藏
  // 例如：2026005080
  readonly VITE_ICP_NUMBER?: string;
  // 默认值示例：11010702003005
  readonly VITE_PUBLIC_SECURITY_NUMBER?: string;
  // 可选自定义跳转链接模板，使用 `{number}` 占位
  // 默认：
  //   ICP -> https://beian.miit.gov.cn/#/Integrated/recordSearch?record={number}
  //   公安 -> http://www.beian.gov.cn/portal/registerSystemInfo?recordcode={number}
  readonly VITE_ICP_LINK?: string;
  readonly VITE_PUBLIC_SECURITY_LINK?: string;
}

// interface ImportMeta {
//   readonly env: ImportMetaEnv
// }

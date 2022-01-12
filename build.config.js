import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    // 入口
    entries: [
        'core/index',
    ],
    // stub: true, // 插桩，调试用
    rollup: {
        cjsBridge: true, // 保持cjs的上下文
    },
    // declaration: true, // 生成声明文件
})
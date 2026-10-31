# video-question-solver

一个基于浏览器控制台的 Vue2 视频题目识别与自动作答脚本。脚本会自动查找视频答题组件、匹配内置题库并逐题提交答案，同时提供暂停、继续、补充答案和进度查询等控制命令。

> 本项目仅供编程学习与技术交流。请在获得授权的环境中使用，遵守所在平台的使用规则，并自行核对题库答案。

## 功能特性

- 自动探测页面中的 Vue2 视频答题组件
- 内置 122 条实验室安全相关题目及答案
- 规范化题干中的空格、全角字符和常见标点
- 优先精确匹配，模糊匹配时选择最长题干，降低误匹配概率
- 逐题串行处理，避免定时器造成重复提交
- 未匹配题目自动暂停，不会直接从队列中删除
- 提交失败时恢复当前题目
- 重复运行脚本时自动停止旧任务
- 支持运行时暂停、继续、补充答案和查询进度
- 可选择是否在答题结束后跳转到视频结尾

## 环境要求

- Chrome、Edge 等支持开发者工具的现代浏览器
- 目标页面使用 Vue2，并保留 DOM 节点的 `__vue__` 属性
- 页面答题组件包含 `model.questionRelaList` 和 `submit()` 等原有结构

如果网站已经升级前端框架或调整组件结构，脚本可能无法识别，需要针对新页面重新适配。

## 使用方法

### 1. 获取脚本

下载本项目的 [`video-question-solver.js`](./video-question-solver.js)，使用记事本或代码编辑器打开。

### 2. 打开视频页面

进入能够正常播放视频并弹出问题的页面，等待视频加载完成。

### 3. 打开控制台

在 Chrome 或 Edge 中按 `F12`，或使用快捷键 `Ctrl + Shift + J`，切换到 **Console（控制台）**。

### 4. 运行脚本

复制 `video-question-solver.js` 的全部内容，粘贴到控制台并按 `Enter`。

如果浏览器阻止粘贴，请按照控制台显示的安全提示操作后再试。不要粘贴来源不明的脚本。

运行成功后会显示：

```text
✅ 已连接答题组件，题库共 122 条……
📝 当前题目……
✅ 已提交……
```

## 配置项

配置位于脚本顶部的 `CONFIG` 对象中，请在运行前修改。

| 配置项 | 默认值 | 说明 |
| --- | ---: | --- |
| `submitDelay` | `800` | 展示题目后等待多少毫秒再提交 |
| `nextDelay` | `1200` | 提交后等待多少毫秒再处理下一题 |
| `finishDelay` | `2000` | 跳转视频结尾后等待多少毫秒再调用完成回调 |
| `autoFinishVideo` | `true` | 全部题目完成后是否跳转到视频结尾 |
| `minFuzzyLength` | `6` | 双向包含匹配所需的最短题干长度 |

如果只需要答题、不希望自动跳转视频结尾，请修改为：

```javascript
autoFinishVideo: false
```

## 控制命令

### 暂停任务

```javascript
window.videoQuestionSolver.stop()
```

当前等待步骤结束后，不再继续处理后续题目。

### 继续任务

```javascript
window.videoQuestionSolver.start()
```

### 查看进度

```javascript
window.videoQuestionSolver.getStats()
```

返回已提交数量、失败数量和剩余题目数量。

### 查看未匹配题目

```javascript
window.videoQuestionSolver.getUnmatched()
```

## 补充或更新答案

遇到未匹配题目时，脚本会暂停并保留该题。可以补充答案后继续运行。

单选题：

```javascript
window.videoQuestionSolver.addAnswer("这里填写完整题干", "A");
window.videoQuestionSolver.start();
```

多选题：

```javascript
window.videoQuestionSolver.addAnswer("这里填写完整题干", ["A", "B", "D"]);
window.videoQuestionSolver.start();
```

也可以直接编辑脚本中的 `questionBank` 对象：

```javascript
const questionBank = {
    "单选题题干": "A",
    "多选题题干": ["A", "C", "D"]
};
```

使用相同规范化题干添加答案时，新答案会覆盖旧答案。通过 `addAnswer()` 添加的答案仅在当前页面会话中有效，刷新页面后需要重新添加；长期使用时建议直接修改题库。

## 题目匹配规则

1. 移除题干中的空白和常见标点，并进行全角字符规范化。
2. 优先查找完整题干的精确匹配。
3. 精确匹配失败时，使用题干双向包含匹配。
4. 存在多个包含匹配时，选择规范化后最长的题库题干。
5. 仍未找到答案时暂停任务，并保留当前题目。

## 常见问题

### 提示“未找到目标 Vue2 答题组件”

可能原因：

- 当前不是正确的视频播放页面
- 页面尚未加载完成
- 网站已不再使用 Vue2
- 构建工具移除了 `__vue__`
- 视频或答题组件位于 iframe 中

请先刷新页面并等待视频加载完成。如果仍然失败，需要根据实际页面结构重新适配。

### 脚本没有继续答题

检查是否遇到未匹配题目、提交异常或已有答题弹窗。可以执行：

```javascript
window.videoQuestionSolver.getStats()
window.videoQuestionSolver.getUnmatched()
```

### 如何完全停止任务

执行：

```javascript
window.videoQuestionSolver.stop()
```

刷新页面也会清除当前脚本及运行时添加的答案。

## 免责声明

本项目不隶属于任何视频或培训平台，不保证适用于所有网站，也不保证题库答案始终正确。使用者应自行核对答案并承担使用产生的责任。

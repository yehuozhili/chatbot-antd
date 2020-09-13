## 基于 Antd 制作的纯前端客服机器人

![build](https://github.com/yehuozhili/chatbot-antd/workflows/build/badge.svg)
![npm](https://img.shields.io/npm/v/chatbot-antd)

### 简介

-   由于客服机器人场景使用很多，大部分都需要前后端通信，甚至可能还需要智能对话平台利用 nlp 进行处理，不说那些平台需要花钱，如果自己写前后端写起来也相当麻烦，所以我着手制作了个只需要前端并且支持对话定制的客服机器人。当然，同时支持使用后端或者平台。
-   ui 使用了 antd，这样很多人能看得懂代码并且方便定制修改。几乎所有样式都暴露出来，可以直接进行修改样式。antd 配置项也几乎全部暴露出来，满足各种特殊需要。

### 快速上手

-   需要 react 版本 16.8 以上，支持 hooks。
-   需要 antd4。
-   安装：

```
npm i chatbot-antd
```

```tsx
import React, { useCallback, useState } from "react";
import { CustomerServiceOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "antd/dist/antd.css";
import {
	library,
	generateRespones,
	RenderList,
	useRegister,
} from "chatbot-antd";

//text是语句，reg会生成正则匹配，useReg会使用自定义匹配
library.push(
	//语料库，push进去，也可以不用
	{
		text: "我是机器人",
		reg: "你是谁",
	},
	{
		text: "author is yehuozhili",
		useReg: /(.*?)作者是谁(.*?)/,
	},
	{
		text: <CustomerServiceOutlined></CustomerServiceOutlined>,
		useReg: /(.*?)表情(.*?)/,
	}
);

function App() {
	const [modalOpen, setModalOpen] = useState(false);
	//使用useCllback避免用户输入时调用匹配！！！！！！！
	const callb = useCallback((v: RenderList) => {
		setTimeout(() => {
			//使用settimeout 更像机器人回话
			let returnValue = generateRespones(v);
			if (returnValue) {
				//排除null
				setList((prev) => [
					...prev,
					{ isUser: false, text: returnValue },
				]);
			}
		}, 500);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// 注册
	const [render, setList] = useRegister(
		modalOpen,
		callb,
		{
			onOk: () => setModalOpen(false),
			onCancel: () => setModalOpen(false),
			title: "h5-Dooring机器人客服",
		},
		{},
		<div>welcome!我是机器人初始欢迎语句！！</div>
	);

	return (
		<div>
			<div
				style={{
					position: "fixed",
					right: "10px",
					top: "40%",
				}}
			>
				<Button type="primary" onClick={() => setModalOpen(!modalOpen)}>
					<CustomerServiceOutlined></CustomerServiceOutlined>
				</Button>
			</div>
			{render}
		</div>
	);
}
```

### 使用说明

#### 按需引入样式

-   按需引入样式，或者全量或者按需引入 antd 样式，这个样式完全是 antd 的，如果全量引入可以不引 css

```js
import "chatbot-antd/index.css";
```

-   按需引入需要引入,引入对应的 less 也可以。

```
antd/lib/style/index.css
antd/lib/button/style/index.css
antd/lib/avatar/style/index.css
antd/lib/input/style/index.css
antd/lib/modal/style/index.css
antd/lib/popover/style/index.css
```

-   全量引入直接：

```
import "antd/dist/antd.css";
```

#### library 语料库

-   语料库部分，是跟主体进行分离的，可以不用，直接对接平台。
-   使用语料库导入 library 后自己配置即可，text 是机器人需要返回的话，reg 会生成正则匹配，useReg 则会使用自定义正则进行匹配。

```typescript
library.push(
	//语料库，push进去，也可以不用
	{
		text: "我是机器人",
		reg: "你是谁",
	},
	{
		text: "author is yehuozhili",
		useReg: /(.*?)作者是谁(.*?)/,
	},
	{
		text: <CustomerServiceOutlined></CustomerServiceOutlined>,
		useReg: /(.*?)表情(.*?)/,
	}
);
```

#### useRegister 注册钩子

-   这个是自定义钩子，也是主体部分，传入参数，以及返回格式：

```typescript
export function useRegister(
	//modal状态,只有开启状态才能开启Modal
	state: boolean,
	//获取用户回话的回调，用户输入会通过callback传回
	callback?: (v: RenderList) => void,
	//这个是antd的modal属性，参考antd官网
	modalOption?: ModalProps,
	//这个是input属性，参考antd官网
	inputOption?: InputProps,
	//这个是机器人语句，就是第一次打开后机器人发的语句
	initWelcome?: ReactNode,
	//这个是初始值，如果需要持久化可以考虑使用
	initState?: RenderList[],
	//是否关闭输入框上方功能条
	closeFunctionBar?: boolean
): [ReactNode, React.Dispatch<React.SetStateAction<RenderList[]>>];
```

-   返回里可以拿到 render 渲染结果以及 setList 来设置对话框中的聊天语句。
-   值得注意的是 callback 设置语句请使用 useCallback 将函数作为常驻变量，否则用户每次输入都会触发：

```tsx
const callback = useCallback((v: RenderList) => {
	setTimeout(() => {
		//使用settimeout 更像机器人回话
		let returnValue = generateRespones(v);
		if (returnValue) {
			//排除null
			setList((prev) => [...prev, { isUser: false, text: returnValue }]);
		}
	}, 500);
	// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

-   callback 传入 register 的第二个参数。
-   callback 可以直接去发请求给平台获取结果，再 setList 回来，让机器人发送。

-   setList 的格式为：

```tsx
export interface RenderList {
	isUser: boolean;
	text: ReactNode;
}
```

-   isUser 表示是否是用户所发。

-   text 表示每条对话。其中用户所发的 text 类型为 string，而机器人所发 text 类型可以是 ReactNode。

#### 响应生成器 generateRespones

-   这个函数结合 library 用正则去匹配收到的语句，从而返回机器人的响应。
-   如果觉得不好用可以自己制作响应生成器。

#### 修改样式

-   可以直接靠 css 修改。
-   不少样式都以变量方式暴露出来，可以参考源码导入暴露的变量进行修改。

#### 修改头像

-   修改头像请导入暴露的变量 robotAvatarOptions 或者 userAvatarOptions，去除 icon，传入 children 进行修改。

### 更新日志 changelog

-   如果有需要请自行下载对应版本：npm i chatbot-antd@版本号
-   0.6.0 增加清空功能与发送图片功能
-   0.5.0 增加按需引入 css
-   0.3.0 增加回车键发送功能
-   0.2.0 基本完成功能

### 效果演示

-   预览地址：https://yehuozhili.github.io/chatbot-antd/
-   此预览地址的语料库为 demo 中的那几个

<img src='https://github.com/yehuozhili/chatbot-antd/blob/master/demo/demo.gif'/>

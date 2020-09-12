import React, { useCallback, useState } from "react";
import { useRegister } from "./components";
import { CustomerServiceOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { library, generateRespones, RenderList } from "./components/index";

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

export default App;

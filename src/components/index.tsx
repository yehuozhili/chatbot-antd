import { Button, Input } from "antd";
import { InputProps } from "antd/lib/input";
import Modal, { ModalProps } from "antd/lib/modal/Modal";
import React, {
	ReactNode,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
} from "react";
import { EnterOutlined } from "@ant-design/icons";
import { RobotItem } from "./listItem";

export * from "./dataValidate";
export * from "./listItem";

export let modalHeight = 400;
export const defaultInputOption: InputProps = {};
export const defaultModalOption: ModalProps = {
	mask: false,
	style: { marginRight: 0, zIndex: 10000 },
	width: 300,
	bodyStyle: {
		height: `${modalHeight}px`,
		overflow: "auto",
	},
	wrapClassName: "yehuozhili",
};

export interface RenderList {
	isUser: boolean;
	text: ReactNode;
}

export let initWelcomeDelay = 500;

export function useRegister(
	//modal状态
	state: boolean,
	//获取用户回话的回调
	callback?: (v: RenderList) => void,
	modalOption?: ModalProps,
	inputOption?: InputProps,
	initWelcome?: ReactNode,
	initState?: RenderList[]
): [ReactNode, React.Dispatch<React.SetStateAction<RenderList[]>>] {
	//存放渲染语句
	const [list, setList] = useState<RenderList[]>(initState ? initState : []);
	//存放输入框内容
	const [inputValue, setInputValue] = useState<string>("");

	const finalInputOption = useMemo(() => {
		return { ...defaultInputOption, ...inputOption };
	}, [inputOption]);

	const finalModalOption = useMemo(() => {
		const footer = (
			<div style={{ display: "flex" }}>
				<Input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					{...finalInputOption}
				></Input>
				<Button
					style={{ marginLeft: "5px" }}
					onClick={() => {
						if (inputValue !== "") {
							setList((prev) => {
								return [
									...prev,
									{ isUser: true, text: inputValue },
								];
							});
							setInputValue("");
						}
					}}
				>
					<EnterOutlined />
				</Button>
			</div>
		);

		return { ...defaultModalOption, footer, ...modalOption };
	}, [finalInputOption, inputValue, modalOption]);
	//这个为了使得滚动条始终保持最底
	useLayoutEffect(() => {
		const dom = document.querySelector(".yehuozhili");
		if (dom) {
			let body = dom.querySelector(".ant-modal-body") as HTMLElement;
			if (body) {
				let height = body.scrollHeight;
				let bodyheight = modalHeight;
				let scrolltop = height - bodyheight;
				body.scrollTop = scrolltop;
			}
		}
	}, [list]);
	//用来制作回调,过滤机器人发送
	useEffect(() => {
		if (list.length > 0 && callback) {
			let last = list[list.length - 1];
			if (last.isUser) {
				callback(last);
			}
		}
	}, [callback, list]);

	//不能直接设到state初始值上，否则看起来怪异。
	//需要第一次用户打开时把语句设上
	const flag: { sign: boolean } = useMemo(() => {
		return { sign: true };
	}, []);
	useEffect(() => {
		let timer: number;
		if (flag.sign && state && initWelcome) {
			timer = window.setTimeout(() => {
				flag.sign = false;
				setList((prev) => [
					...prev,
					{ isUser: false, text: initWelcome },
				]);
			}, initWelcomeDelay);
		}
		return () => window.clearTimeout(timer);
	}, [flag, initWelcome, state]);

	let modalRender = (
		<Modal visible={state} {...finalModalOption}>
			{list.map((it, index) => {
				return (
					<RobotItem
						key={index}
						isUser={it.isUser}
						text={it.text}
					></RobotItem>
				);
			})}
		</Modal>
	);
	return [modalRender, setList];
}

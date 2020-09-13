import { Button, Input } from "antd";
import { InputProps } from "antd/lib/input";
import Modal, { ModalProps } from "antd/lib/modal/Modal";
import React, {
	CSSProperties,
	ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	EnterOutlined,
	DeleteOutlined,
	PictureOutlined,
} from "@ant-design/icons";
import { RobotItem } from "./listItem";
import "./index.css";
export * from "./dataValidate";
export * from "./listItem";

//客服窗口的高度
export let modalHeight: number = 400;
//antd的输入框接口
export const defaultInputOption: InputProps = {};
//antd的modal接口
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
//初始语句延迟
export let initWelcomeDelay: number = 500;
//功能条包裹div的样式
export const functionDivStyle: CSSProperties = {
	display: "flex",
	paddingBottom: "10px",
	marginBottom: "10px",
};
//功能条按钮样式
export const functionButtonStyle: CSSProperties = {
	padding: 0,
	marginRight: "10px",
};

//图片显示到聊天框的样式
export const imgStyle: CSSProperties = {
	width: "100%",
};
//允许图片验证通过的列表
export const imgAccept = ["image/png", "image/jpeg", "image/gif"];
//允许图片验证通过的大小
export const imgMaxSize = 500000;
//验证图片的函数，不满意自行修改
export let imgValidate = (f: File) => {
	if (f.size <= imgMaxSize && imgAccept.includes(f.type)) {
		return true;
	} else {
		console.error("invalidate file");
		return false;
	}
};

function getBase64(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});
}
export interface RenderList {
	isUser: boolean;
	text: ReactNode;
}

export function useRegister(
	//modal状态
	state: boolean,
	//获取用户回话的回调
	callback?: (v: RenderList) => void,
	modalOption?: ModalProps,
	inputOption?: InputProps,
	initWelcome?: ReactNode,
	initState?: RenderList[],
	closeFunctionBar?: boolean
): [ReactNode, React.Dispatch<React.SetStateAction<RenderList[]>>] {
	//存放渲染语句
	const [list, setList] = useState<RenderList[]>(initState ? initState : []);
	//存放输入框内容
	const [inputValue, setInputValue] = useState<string>("");

	const finalInputOption = useMemo(() => {
		return { ...defaultInputOption, ...inputOption };
	}, [inputOption]);

	const submit = useCallback(() => {
		if (inputValue !== "") {
			setList((prev) => {
				return [...prev, { isUser: true, text: inputValue }];
			});
			setInputValue("");
		}
	}, [inputValue]);

	const sendImg = useCallback(() => {
		if (uploadRef.current) {
			uploadRef.current.click();
		}
	}, []);

	const uploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target && e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			if (imgValidate(file)) {
				//验证后获取blob
				let res = await getBase64(file);
				const img = (
					<img style={imgStyle} src={res} alt="user-img"></img>
				);
				setList((prev) => [...prev, { isUser: true, text: img }]);
			}
		}
	};

	const uploadRef = useRef<HTMLInputElement>(null);
	//这个是功能条渲染部分
	const FunctionBar = useMemo(() => {
		if (closeFunctionBar) {
			return null;
		} else {
			return (
				<div style={functionDivStyle}>
					<Button
						title="清空"
						type="link"
						onClick={() => setList([])}
						style={functionButtonStyle}
					>
						<DeleteOutlined />
					</Button>
					<input
						ref={uploadRef}
						type="file"
						accept="image/*"
						style={{ display: "none" }}
						value=""
						onChange={uploadChange}
					></input>
					<Button
						title="发送图片"
						type="link"
						onClick={() => sendImg()}
						style={functionButtonStyle}
					>
						<PictureOutlined />
					</Button>
				</div>
			);
		}
	}, [closeFunctionBar, sendImg]);

	const finalModalOption = useMemo(() => {
		const footer = (
			<div>
				{FunctionBar}
				<div style={{ display: "flex" }}>
					<Input
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onPressEnter={submit}
						{...finalInputOption}
					></Input>
					<Button style={{ marginLeft: "5px" }} onClick={submit}>
						<EnterOutlined />
					</Button>
				</div>
			</div>
		);

		return { ...defaultModalOption, footer, ...modalOption };
	}, [FunctionBar, finalInputOption, inputValue, modalOption, submit]);
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

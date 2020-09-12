import { ReactNode } from "react";
import { RenderList } from ".";

//这个文件与index实际分离关系。

export type libraryType = Array<{
	reg?: string;
	text: ReactNode;
	useReg?: RegExp;
}>;

export let library: libraryType = [];

export function generateRespones(v: RenderList): ReactNode {
	if (typeof v.text === "string") {
		for (let value of library) {
			if (value.reg) {
				//字符串全字匹配
				let r = new RegExp(value.reg);
				if (r.test(v.text)) {
					return value.text;
				}
			} else if (value.useReg && value.useReg.test(v.text)) {
				//使用自定义匹配
				return value.text;
			}
		}
		return null;
	}
	console.error("user input invalid type");
	return null;
}

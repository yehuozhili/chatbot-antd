import Avatar, { AvatarProps } from "antd/lib/avatar/avatar";
import React, { CSSProperties, ReactNode } from "react";
import { RobotOutlined, UserOutlined } from "@ant-design/icons";

export const robotAvatarOptions: AvatarProps = {
	style: { color: "#f56a00", backgroundColor: "#fde3cf" },
	icon: <RobotOutlined />,
};
export const userAvatarOptions: AvatarProps = {
	style: { color: "white", backgroundColor: "#87d068" },
	icon: <UserOutlined />,
};

export const RobotWrapperStyle: CSSProperties = {
	display: "flex",
	position: "relative",
};
export const robotAvatarWrapperStyle: CSSProperties = {
	width: "32px",
};
export const popWrapperStyle: CSSProperties = {
	width: "calc(100% - 20px - 64px)", //头像宽32*2 边距20
	margin: "10px",
	padding: "10px",
};

export const robotArrowStyle: CSSProperties = {
	left: "40px", //这个和下面那个user对应，改了必须都改
	top: "15px",
	color: "white",
};
export const userArrowStyle: CSSProperties = {
	right: "40px",
	top: "15px",
	color: "white",
};
export type ItemProps = {
	isUser?: boolean;
	text: ReactNode;
};

export function RobotItem(props: ItemProps) {
	const { isUser, text } = props;
	return (
		<div style={RobotWrapperStyle}>
			<div style={robotAvatarWrapperStyle}>
				{!isUser && <Avatar {...robotAvatarOptions}></Avatar>}
			</div>
			<div
				className="ant-popover-arrow"
				style={isUser ? userArrowStyle : robotArrowStyle}
			></div>
			<div className="ant-popover-inner" style={popWrapperStyle}>
				<span>{text}</span>
			</div>
			<div style={robotAvatarWrapperStyle}>
				{isUser && <Avatar {...userAvatarOptions}></Avatar>}
			</div>
		</div>
	);
}

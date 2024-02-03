import pc from "picocolors";
// @ts-ignore
import gradient from "gradient-string";

function isUnicodeSupported() {
	if (process.platform !== "win32") {
		return process.env.TERM !== "linux"; // Linux console (kernel)
	}

	return (
		Boolean(process.env.WT_SESSION) || // Windows Terminal
		Boolean(process.env.TERMINUS_SUBLIME) || // Terminus (<0.2.27)
		process.env.ConEmuTask === "{cmd::Cmder}" || // ConEmu and cmder
		process.env.TERM_PROGRAM === "Terminus-Sublime" ||
		process.env.TERM_PROGRAM === "vscode" ||
		process.env.TERM === "xterm-256color" ||
		process.env.TERM === "alacritty" ||
		process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm"
	);
}

export function combineUrl(path1: string, path2: string) {
	let firstPath = path1;
	let secondPath = path2;
	if (path1.endsWith("/")) {
		firstPath = path1.substring(0, path1.length - 1);
	}
	if (path2.startsWith("/")) {
		secondPath = path2.substring(1);
	}
	return `${firstPath}/${secondPath}`;
}

const unicode = isUnicodeSupported();
const s = (c: string, fallback: string) => (unicode ? c : fallback);
const S_ITEM_FILLED = s("◆", "*");
const S_ITEM = s("◇", "o");

const S_BAR_START = s("┌", "T");
const S_BAR = s("│", "|");
const S_BAR_END = s("└", "—");

const S_CONNECT_LEFT = s("├", "+");

const S_ERROR = s("▲", "!");

export const log = {
	title() {
		console.log("\n");
		console.log(
			S_BAR_START,
			S_ITEM_FILLED,
			pc.bold(gradient.morning("BUN-RSC")),
		);
	},
	i(string: string, isEnd = false) {
		console.log(S_BAR);
		console.log(
			isEnd ? S_BAR_END : S_CONNECT_LEFT,
			isEnd ? S_ITEM_FILLED : S_ITEM,
			string,
		);
		if (isEnd) console.log("\n");
	},
	s(string: string, isEnd = false) {
		console.log(S_BAR);
		console.log(
			isEnd ? S_BAR_END : S_CONNECT_LEFT,
			isEnd ? S_ITEM_FILLED : S_ITEM,
			pc.green(string),
		);
		if (isEnd) console.log("\n");
	},
	w(string: string, isEnd = false) {
		console.log(S_BAR);
		console.log(
			isEnd ? S_BAR_END : S_CONNECT_LEFT,
			isEnd ? S_ITEM_FILLED : S_ITEM,
			pc.yellow(string),
		);
		if (isEnd) console.log("\n");
	},
	e(string: string) {
		console.log(S_BAR);
		console.log(S_BAR_END, S_ERROR, pc.red(string));
		console.log("\n");
	},
};

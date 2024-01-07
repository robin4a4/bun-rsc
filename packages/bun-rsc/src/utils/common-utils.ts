export function combineUrl(path1: string, path2: string) {
	if (path1.endsWith("/")) {
		path1 = path1.substring(0, path1.length - 1);
	}
	if (path2.startsWith("/")) {
		path2 = path2.substring(1);
	}
	return path1 + "/" + path2;
}

export const refreshPort = 21717;

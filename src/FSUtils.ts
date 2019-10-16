import * as fs from 'fs';
import { join } from 'path';

export function getChildDir(source: string) {
	return fs.readdirSync(source).map(fldr => [fldr, join(source, fldr)]);
}

export function isDirectory(dir: string) {
	return fs.statSync(dir).isDirectory();
}

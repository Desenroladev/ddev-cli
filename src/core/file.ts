
import * as fs from 'fs';

export class File {

    static exists(path: string) {
        return fs.existsSync(path);
    }

    static mkdir(folder: string) {
        let folders = folder.split('/');
        folders.push('');

        const reducer = (folder: string, current: string) => {
            if (folder.length > 0 && !fs.existsSync(folder)) {
                fs.mkdirSync(folder);
            }
            return folder + '/' + current;
        };

        folders.reduce(reducer);
    }

}
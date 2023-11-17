import { createReadStream, createWriteStream, readFileSync } from 'fs';

import { convertToVtt, VTT_CONTENT_TYPE } from './lib.js';

async function main() {

    const inputFilename = 'sintel_en.srt';
    const inputStream = createReadStream(`../demo/${inputFilename}`);;

    const expectedOutputFilename = 'sintel_en--expected.vtt';
    const outputFilename = 'sintel_en.vtt';
    const outputStream = createWriteStream(`../demo/${outputFilename}`);

    convertToVtt({
        inputFilename,
        inputStream,
        outputStream,
    });

    const isExpectedOutput = sameContents(`../demo/${outputFilename}`, `../demo/${expectedOutputFilename}`);
    console.log({isExpectedOutput});
    process.exit(isExpectedOutput ? 0 : 1);
}

main();

/**
 * Both files contain the same contents?
 * 
 * @param {string} path1 
 * @param {string} path2 
 */
function sameContents(path1, path2) {
    // TODO: Maybe check that they exist and handle errors
    const buf1 = readFileSync(path1);
    const buf2 = readFileSync(path2);
    return buf1.equals(buf2);
}

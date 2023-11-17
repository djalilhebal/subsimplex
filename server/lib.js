import * as path from 'path';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);

console.debug({ ffmpegPath });

/**
 * WebVTT format as accepted by ffmpeg.
 */
const VTT_FORMAT = 'webvtt';

const VTT_CONTENT_TYPE = 'text/vtt';

/**
 * 
 * @param {{
 *  inputFilename: string,
 *  inputStream: import('stream').Readable,
 *  outputStream: import('stream').Writable,
 * }} options 
 */
function convertToVtt({ inputFilename, inputStream, outputStream }) {
    const inputFormat = path.extname(inputFilename).substring(1);
    const command = ffmpeg();
    command.input(inputStream);

    // TBD: Optional?
    if (inputFormat) {
        command.inputFormat(inputFormat);
    }

    command
        .outputFormat(VTT_FORMAT)
        .output(outputStream)
        .run();
}

export {
    convertToVtt,
    VTT_CONTENT_TYPE,
}

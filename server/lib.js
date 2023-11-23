import * as path from 'path';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

//console.debug({ ffmpegPath });
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * WebVTT's format as accepted by ffmpeg.
 */
const VTT_FORMAT = 'webvtt';

/**
 * WebVTT's media type.
 */
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

    // TBD: Can it be optional or automatically inferred?
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

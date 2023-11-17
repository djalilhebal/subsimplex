import { createReadStream } from 'fs';
import fetch from 'node-fetch';

const inputFilename = 'sintel_en.srt';
const inputStream = createReadStream(`../demo/${inputFilename}`);;

// TODO: use superagent and mocha
async function test() {

    const res = await fetch(`http://localhost:8084/api/convert-to-vtt/${inputFilename}`, {
        method: 'POST',
        body: inputStream,
    });
    const text = await res.text();

    console.log('res', res);
    console.log('text', text);
}

test();

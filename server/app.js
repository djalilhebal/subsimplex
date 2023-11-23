import express from 'express';
import cors from 'cors';

import { convertToVtt, VTT_CONTENT_TYPE } from './lib.js';

const app = express();

app.use(cors());

app.post('/api/v0/convert-to-vtt/:filename', (req, res) => {
    res.setHeader('Content-Type', VTT_CONTENT_TYPE);
    const inputFilename = req.params.filename;
    const inputStream = req;
    const outputStream = res;

    convertToVtt({
        inputFilename,
        inputStream,
        outputStream,
    });

});

const APP_PORT = 8084;
app.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}`);
});

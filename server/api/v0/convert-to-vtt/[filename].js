/**
 * @file
 * Serverless function
 * - File path: `subsimplex/server/api/v0/convert-to-vtt/[filename].js`
 */
import { convertToVtt } from '../../../lib.js';

// See https://vercel.com/guides/how-to-enable-cors
const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    // KAITO: Apparently reading the request header (e.g. req.method) makes the stream not readable, even though we are not reading the body.
    // Weird, since reading res returns only the body. You'd assume it is safe to read (still be "readable") if we only check headers.
    // Also, how does it know what handler to call if it does not read the request header ("GET /whatever HTTP 1.1" or something like that)?
    // I swear it used to say yes!
    //console.debug('1/ readable?', req.readable);
    //console.debug('1/ again readable?', req.readable);
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    //console.debug('2/ after reading .method, readable?', req.readable);

    return await fn(req, res)
}


/**
 * `convert-to-vtt` handler.
 * 
 * @param {any} req http.IncomingMessage
 * @param {any} res
 */
function handler(req, res) {

    // HACK: Make sure fluent-ffmpeg does not reject our input.
    // This works fine since it only checks that this prop exists and is true.
    // We know the input (req) hasn't actually been read, so it's safe to read it.
    // think: `req.readable = true`
    const proxiedReq = new Proxy(req, {
        get(target, prop, receiver) {
            if (prop === 'readable') {
                return true;
            } else {
                return target[prop];
            }
        }
    });

    console.log('New req', req.query.filename);
    //console.debug('3/ req readable?', req.readable);
    //console.debug('3/ proxiedReq readable?', proxiedReq.readable);
    convertToVtt({
        inputStream: proxiedReq,
        inputFilename: req.query.filename,
        outputStream: res,
    });
    console.log('Done');
}

export default allowCors(handler);

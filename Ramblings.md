# SubSimplex Ramblings

The main idea has always been to "just use FFmpeg" (since there doesn't seem to be any maintained alternative).

But when and where?

Where?
- Client side: Too big.
- Server side: Depends on a server.

When?
- I would do it (manually) beforehand using the CLI `ffmpeg -i x.srt x.vtt`.
- But for general use, I guess we need to do it when the user asks for it. \
But whene exactly? As soon as the src is set? or wait for the browser to call it?
Like, do we set it as a link to SubSimplex API or do we fetch the WebVTT file and set the src to an Object URL?


## Web components

### Compatibility with React

React supports both types of Web Components:
- Autonomous Custom Element: `<my-whatever>` like `<subsimplex-track>`
- Customized Built-In Element: `<whatever is="my-whatever">` like `<track is="subsimplex-track">`

See:
- ["Custom HTML elements", React DOM Components – React](https://react.dev/reference/react-dom/components#custom-html-elements)


### Browser compatibility

- `is` works with most modern browsers, except Safari, as of 2023-11-16. \
If you need to support Safari, use some polyfill like
[`@ungap/custom-elements`](https://github.com/ungap/custom-elements).


## Testing

- [ ] Expect the video to contain a subtitles track. \
But when? after the video is loaded? 10 seconds of page load? 5 seconds since the video starts playing?
```js
const $vid = document.querySelector('video');
// Assert that there is is a text track and has some cues.
$vid.textTracks.length > 0;
$vid.textTracks[0].cues.length > 0;
```


### Sintel downloads

Visit https://durian.blender.org/wp-content/content/download.html

- `https://www.peach.themazzone.com/durian/movies/<filename>`
    * [x] `sintel-2048-stereo.mp4`
    * [x] `sintel-1280-stereo.mp4`
    * [x] `sintel-1024-stereo.mp4`
    * [ ] .ogv
    
- [x] `sintel_fr.srt`
- [x] `sintel_en.srt`


## Dynamically adding tracks to `video` elements

- [x] Non-dynamic version

- [x] Adding a track child to the video (parent of the custom element).
It's a fine solution,
except it messes up React. We are manually modifying the (real) DOM of a React tree.

- [ ] customized track: Ignore src, fetch and generate src, set src.
```js
async function getAndSetUrl() {
    const subBlob = await fetch('https://subsimplex.vercel.app/api/v0/convert-to-vtt/test.subs').then(res => res.blob());
    const objUrl = URL.createObjectURL(subBlob);
    $track.src = objUrl;
}
```

Pros:
- Preserves HTML semantics.
- Works with React.

Cons:
- We have to use a customized built-in element, which is not natively supported by Safari (polyfillable though.)

- [ ] Create 2 tracks (`document.createElement('track')` and `$video.addTextTrack`).
Once the first once is loaded, copy its cues to the second one.


## Server-related stuff

- List supported subs formats. \
In `ffmpeg -codecs`, we are looking for lines that match `/^D.S/` (meaning, can decode subtitles).

- Can ffmpeg tell the subs format from just its content? \
`ffprobe` can (tested a few extensionless files: `.srt`, `.vtt`, `.ass`, and `.sub`).

- **Remember:**
We should not simply filter requests based on a simplistic content-type check. \
Rejecting non-"text/*" requests is a horrible idea because:
    - `.vtt` is "text/vtt"
    - `.srt` is "application/x-subrip"
    - Not sure about the media types of other formats.


### Ensuring `ffmpeg` is installed on your system or serverless image

In our case, we are using Vercel:

**Idea 1**: Use a platform-independent version of ffmpeg.

- [x] ~~ffmpeg.wasm~~ https://github.com/ffmpegwasm/ffmpeg.wasm
    + As of 2023-11-05, its FAQ states that the project does not work with nodejs.

**Idea 2**: Download the binary using npm.

- [ ] https://github.com/kribblo/node-ffmpeg-installer
    * [x] Tested locally on Windows 10.
    * [x] 2023-11-23 ~~Test on EC2 (local VM or Vercel)~~ Tested on Vercel. It works.

**Idea 3**: Install it "manually":

- [x] [Build image | Vercel Docs](https://vercel.com/docs/deployments/build-image)
    * TLDR: Vercel does not include `ffmpeg`. Gotta install it ourselves.

- [ ] [FFMPEG Install on EC2 - Amazon Linux | Server Fault](https://serverfault.com/questions/374912)


### FFmpeg versions

- ffmpeg.wasm https://github.com/ffmpegwasm/ffmpeg.wasm
    * 2023-11-XX Checked
    * ffmpeg-core size is 31MB.
    * ffmpeg version 5.1.3, built with emcc
    * `ffmpeg -i sintel_en.srt sintel_en--ffmpegwasm.vtt` worked.
        * Generates the expected output (`diff -q sintel_en--ffmpegwasm.vtt sintel_en--expected.vtt`).
    * `ffmpeg -i sintel_fr.srt sintel_fr--ffmpegwasm.vtt` failed. Not unexpected since the file's magic number is weird.
    Specifying the input format lets it handle it correctly (`ffmpeg -f srt -i sintel_fr.srt sintel_fr.vtt`).

- `@ffmpeg-installer`'s `/win32-x64/ffmpeg.exe`
    * 2023-11-XX Checked
    * ffmpeg version N-92722-gf22fcd4483, built with gcc 8.2.1


## Related projects

- https://github.com/vidstack/media-captions

---

FIN.

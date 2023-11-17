# SubSimplex Ramblings


## Web component

### Compatibility with React

React support both types:
- Autonomous Custom Element: `<my-whatever>` like `<subsimplex-track>`
- Customized Built-In Element: `<whatever is="my-whatever">` like `<track is="subsimplex-track">`

See:
- ["Custom HTML elements", React DOM Components – React](https://react.dev/reference/react-dom/components#custom-html-elements)


### Browser compatibility

- `is` works with most modern browsers, except Safari, as of 2023-11-16. \
If you need to support Safari, use some polyfill like
[`@ungap/custom-elements`](https://github.com/ungap/custom-elements).


## Usage

```diff
+<script src="subsimplex.js"></script>
<video src="film.mp4">
-    <track type="subtitles" src="film.srt" />
+    <SubSimplexTrack src="film.srt" />
```

Testing:
Expect the video to contain a subtitles track
But when? after the video is loaded? 10 seconds of page load? 5 seconds since the video starts playing?
```js
const vid = document.querySelector('video');
vid.tracks.length > 0
assert that vid.tracks[0] is a text track and has some cues(?)
```


## Sintel downloads

Visit https://durian.blender.org/wp-content/content/download.html

- `http://www.peach.themazzone.com/durian/movies/<filename>`
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
    const subBlob = await fetch('http://subsimplex/api/v0/test.vtt').then(res => res.blob());
    const objUrl = URL.createObjectURL(subBlob);
    $track.src = objUrl;
}
```
Pros:
Preserves HTML semantics.
Works with React.
Cons: We have to use a customized built-in element, which is not natively supported by Safari (polyfillable though.)

- [ ] Create 2 tracks (`document.createElement('track')` and `$video.addTextTrack`)
Once the first once is loaded, copy its cues to the second one.


## Server-related stuff

- List supported subs formats. \
In `ffmpeg -codecs`, we are looking for lines that match `/^D.S/` (meaning, can decode subtitles).

- Can ffmpeg tell the subs format from just its content? \
`ffprobe` can (tested a few extensionless files: `.srt`, `.vtt`, `.ass`, and `.sub`).

- **Remember:**
We should not simply filter requests based on a simplistic content-type check. \
Rejecting non-"text/*" requests is bad because:
    - .vtt is "text/vtt"
    - .srt is "application/x-subrip"
    - Not sure about the content-type of other supported formats.


## Related projects

- https://github.com/vidstack/media-captions

# SubSimplex

Simply convert subtitles to WebVTT. **WIP** x **POC**. \
_#serverles #nodejs #express #webcomponent #ffmpeg_

<details>
<summary>Tasteless intro</summary>

Lemme start by admitting that I have cancer.
No, not IRL, but the type that lets you stay alive and suffer for at least 40 or 50 more years.
IDK why I keep procrastinating, getting sidetracked, and never getting anything done.

As Lady Amalthea (A.K.A. The Last Unicorn) would say, <q lang="fr">Je sens ce corps mourir !</q>, which is French for "I can feel this whole body dying all around me!"...
</details>

Suppose you have a video or movie like The Last Unicorn (obtain through legitimate means like buying the DVD, obvio).
You want to embed it in a web page (say, PeerParty) in addition to the French subtitles file (e.g., `unicorn.fr.srt`).
Unfortunately, the web support only WebVTT (`*.vtt`).

This project is my attempt at coming up with a no-nonsense way to convert and view subtitles on the web.

- [ ] Used by [PeerParty](https://github.com/djalilhebal/peer-party).


## Demo

```html
<!-- Register the web component -->
<script src="./index.js"></script>

<video controls>
    <source src="sintel-1280-stereo.mp4" type="video/mp4" />
    <subsimplex-track default kind="subtitles" srclang="fr" src="sintel_fr.srt" />
</video>
```

Output:
![Screenshot of video with French subtitles](./demo-2023-11-17.jpg)

That assumes you are running the server locally:
```sh
cd server
npm start
```

As for the static server for demo:
```sh
cd demo
npx serve
```


## Technologies used

- [x] FFmpeg (https://ffmpeg.org/)
    * `fluent-ffmpeg`
    * https://github.com/fluent-ffmpeg/node-fluent-ffmpeg

- [x] Express ~~or Koa~~

- [ ] `supertest` and Mocha for testing

- [x] Web component

- [ ] React

- [ ] Vercel Serverless Functions


## Usage

### Client

`client/`

Just import the Web Component and use it as you would use `<track>`.
```html
<script src="dist/SubSimplexTrack.js"></script>

<video controls src="film.mp4">
    <!--
        <track src="film_fr.srt" />
    -->
    <subsimplex-track src="film_fr.srt" />
</video>
```

### Server

`server/`

Or "serverless".

Make sure you have `ffmpeg` installed on your serverless image(?).

In our case, we are using Vercel:

**Idea 1**: Use a platform-independent version of ffmpeg.

- [x] ~~ffmpeg.wasm~~ https://github.com/ffmpegwasm/ffmpeg.wasm
    + As of 2023-11-05, its FAQ states that the project does not work with nodejs.

**Idea 2**: Install it as a node package.

- [ ] https://github.com/kribblo/node-ffmpeg-installer
    * [x] Tested locally on Windows 10.
    * [ ] Test on EC2 (local VM or Vercel).

**Idea 3**: Install it "manually":

- [x] [Build image | Vercel Docs](https://vercel.com/docs/deployments/build-image)
    * TLDR: Vercel does not include `ffmpeg`. Gotta install it ourselves.

- [ ] [FFMPEG Install on EC2 - Amazon Linux - Server Fault](https://serverfault.com/questions/374912)


## Design

Design considerations:

- No-nonsense.

- It should be a straightforward replacement for `<track>`

- Should work well with React and other libraries/frameworks.

- Should respect the HTML5 standard.


### How it should work

Client:
```js
class SubSimplexTrack extends HTMLElement {
    static defaultApi = 'https://subsimplex.vercel.app';

    work() {
        // original = load the subtitles contents
        // converted = await fetch post to subsimplex
        // create a new track and add it or replace the old one
    }
}
```

Server:
```js
// inputs = get content and format (ext of the file) from the request
// converted = use ffmpeg to convert it to vtt
// output = return the output with correct headers
```


## Ramblings

More [Ramblings](./Ramblings.md)?


## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) © Abdeldjalil HEBAL

# Changelog

## v0.0.1 (2023-11-17)

Initial version.

Server:
- `POST /api/convert-to-vtt/:filename`.
    * Returns a WebVTT body with the correct Content-Type header.
    * Allows CORS.

- Client: `<subsimplex-track src="film_fr.srt" api="http://localhost:8084/api" ...otherProps />`
    * Web component.
    * Approach: Appending a new `track` to the video parent.
    * Attribute `api` is optional.

/**
 * WIP!
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
 */
class SubSimplexTrack extends HTMLElement {
    static get observedAttributes() {
        return ['src'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Custom logic when the observed attribute changes
        console.log(`${name} changed from ${oldValue} to ${newValue}`);
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    /*
     * Non of the following seem to work. The browser is not calling our `setAttribute*` methods.
    setAttribute() {
        console.log(`setAttribute called`, arguments);
        super.setAttribute(...arguments);
    }
    setAttributeNS() {
        console.log(`setAttributeNS called`, arguments);
        super.setAttributeNS(...arguments);
    }
    setAttributeNode() {
        console.log(`setAttributeNode called`, arguments);
        super.setAttributeNode(...arguments);
    }
    setAttributeNodeNS() {
        console.log(`setAttributeNodeNS called`, arguments);
        super.setAttributeNodeNS(...arguments);
    }
     */

    /**
     * @private
     */
    async appendingChildApproach() {
        // This works.
        // We are adding a new track as a child to `$video`.
        // XXX: Does this affect how React works? We are changing the real DOM by adding a new element. This may mess it up.
        const $newTrack = document.createElement('track');
        const attrsToCopy = 'default kind srclang'.split(' ');
        for (const attr of attrsToCopy) {
            if (this.hasAttribute(attr)) {
                $newTrack.setAttribute(attr, this.getAttribute(attr));
            }
        }
        $newTrack.setAttribute('src', await this.getConvertedUrl());
        const $video = this.parentElement;
        $video.appendChild($newTrack);
    }

    /**
     * @private
     */
    usingShadowDom() {
        // This does not work.
        // Kinda makes sense: <track> is not the direct child of <video>.
        // Tried making SubSimplexTrack extend HTMLTrackElement, but it turns out that's not allowed.
        // Tried overriding HTMLTrackElement setAttribute, but it seems to be ignored.
        const src = this.getAttribute('src');
        this.shadowRoot.innerHTML = `
            <style>
            </style>
            <track src="${src}" />
        `;
    }

    connectedCallback() {
        if (!this.checkCompliance()) {
            return;
        }

        this.appendingChildApproach();
    }

    static defaultApi = 'http://localhost:8084/api';

    /**
     * @private
     */
    async getConvertedUrl() {
        const originalBase = document.location.href;
        const originalSrc = this.getAttribute('src');
        console.log({originalBase, originalSrc});
        const originalFilename = new URL(originalSrc, originalBase).pathname.split('/').pop();
        const originalBlob = await fetch(originalSrc).then(res => res.blob());
        
        const apiBase = this.hasAttribute('api') ? this.getAttribute('api') : SubSimplexTrack.defaultApi;
        const apiCall = `${apiBase}/convert-to-vtt/${originalFilename}`;
        const convertedBlob = await fetch(apiCall, {method: 'POST', body: originalBlob}).then(res => res.blob());

        const convertedSrc = URL.createObjectURL(convertedBlob);
        return convertedSrc;
    }

    /**
     * Does it seem like a valid track element according to the spec?
     * @returns {boolean} seems valid?
     * @private
     */
    checkCompliance() {
        const $parent = this.parentElement;
        const $content = this.children;

        if (!($parent instanceof HTMLVideoElement || $parent instanceof HTMLAudioElement)) {
            console.error(`${SubSimplexTrack.name} can only be the direct child of a media element (<video> or <audio>).`);
            return false;
        }

        if ($content.length > 0) {
            console.error(`${SubSimplexTrack.name} should have no content.`);
            return false;
        }

        return true;
    }

}

customElements.define('subsimplex-track', SubSimplexTrack);


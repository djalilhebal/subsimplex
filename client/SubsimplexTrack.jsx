import { useRef } from 'react';

/**
 * WIP!
 */
export default function SubsimplexTrack({ src, ...otherProps }) {
    const trackRef = useRef(null);

    // TODO

    return <track ref={trackRef} {...otherProps} />;
}

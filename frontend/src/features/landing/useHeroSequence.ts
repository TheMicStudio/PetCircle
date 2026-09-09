import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Moment of the video where the phone screen takes over, in seconds.
 * Read on the frames : the paw reaches the screen at 5.1s and finishes its
 * first sweep around 6.1s. Ending later showed a second and a third sweep.
 */
const SWIPE_AT = 5.1;
const DURATION = SWIPE_AT + 1;

/** Given up waiting for the video after this delay, in ms. */
const LOAD_TIMEOUT = 4000;

/** Phone rectangle inside the video frame, as a ratio of the canvas size. */
const PHONE = { x: 0.566, y: 0.304, width: 0.244, height: 0.5 };

export type HeroStatus = 'idle' | 'loading' | 'playing' | 'done';

interface Point {
    x: number;
    y: number;
}

/** Where the dog sits on the page, measured when the sequence starts. */
interface HeroBox {
    left: number;
    top: number;
    size: number;
}

export interface HeroSequence {
    status: HeroStatus;
    cameraRef: RefObject<HTMLDivElement | null>;
    uiRef: RefObject<HTMLDivElement | null>;
    dogRef: RefObject<HTMLDivElement | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    videoRef: RefObject<HTMLVideoElement | null>;
    loopRef: RefObject<HTMLVideoElement | null>;
    start: () => void;
}

function clamp01(value: number): number {
    return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number): number {
    return value * value * (3 - 2 * value);
}

function lerp(from: number, to: number, ratio: number): number {
    return from + (to - from) * ratio;
}

function mix(from: Point, to: Point, ratio: number): Point {
    return { x: lerp(from.x, to.x, ratio), y: lerp(from.y, to.y, ratio) };
}

/**
 * Camera of the sequence : it zooms on the dog, then on the phone it holds,
 * then it goes through the screen. Returns a CSS transform.
 */
function cameraTransform(time: number, box: HeroBox): string {
    const segment = (from: number, to: number): number => smoothstep(clamp01((time - from) / (to - from)));
    const center: Point = {
        x: document.documentElement.clientWidth / 2,
        y: window.innerHeight / 2,
    };
    const head: Point = { x: box.left + 0.51 * box.size, y: box.top + 0.4 * box.size };
    const phone: Point = {
        x: box.left + (PHONE.x + PHONE.width / 2) * box.size,
        y: box.top + (PHONE.y + PHONE.height / 2) * box.size,
    };

    let scale: number;
    let focus: Point;
    let anchor: Point;
    if (time < 2.6) {
        const ratio = segment(0, 2.6);
        scale = lerp(1, 1.9, ratio);
        focus = head;
        anchor = mix(head, center, ratio);
    } else if (time < 3.8) {
        const ratio = segment(2.6, 3.8);
        scale = lerp(1.9, 2.3, ratio);
        focus = mix(head, phone, ratio);
        anchor = center;
    } else if (time < SWIPE_AT) {
        scale = lerp(2.3, 2.6, segment(3.8, SWIPE_AT));
        focus = phone;
        anchor = center;
    } else {
        // The canvas is 720px wide for a 1440px video, so above a factor of
        // 1.86 the pixels are stretched. The mockup went up to 6.5, but its
        // blur was hidden by the panel that slid over it.
        scale = lerp(2.6, 3.2, segment(SWIPE_AT, SWIPE_AT + 0.9));
        focus = phone;
        anchor = center;
    }

    const x = anchor.x - scale * focus.x;
    const y = anchor.y - scale * focus.y;
    return 'translate(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px) scale(' + scale.toFixed(4) + ')';
}

/** Above this brightness a border pixel is kept : it belongs to the subject. */
const EDGE_LIMIT = 130;

/**
 * The source video has a thin dark line where the white background meets the
 * torn paper. Keying the white leaves that line visible, so every dark pixel
 * touching a transparent one is cleared. Two passes are enough : the line is
 * about one pixel wide, measured on a real frame.
 */
function trimDarkEdge(pixels: Uint8ClampedArray, size: number): void {
    for (let pass = 0; pass < 2; pass += 1) {
        const doomed: number[] = [];
        for (let y = 1; y < size - 1; y += 1) {
            for (let x = 1; x < size - 1; x += 1) {
                const alpha = (y * size + x) * 4 + 3;
                if (pixels[alpha] === 0) {
                    continue;
                }
                const brightest = Math.max(pixels[alpha - 3], pixels[alpha - 2], pixels[alpha - 1]);
                if (brightest > EDGE_LIMIT) {
                    continue;
                }
                const above = alpha - size * 4;
                const below = alpha + size * 4;
                if (
                    pixels[alpha - 4] === 0 ||
                    pixels[alpha + 4] === 0 ||
                    pixels[above] === 0 ||
                    pixels[below] === 0
                ) {
                    doomed.push(alpha);
                }
            }
        }
        for (const alpha of doomed) {
            pixels[alpha] = 0;
        }
    }
}

/**
 * Copy one video frame on the canvas and cut the white background out, so the
 * dog looks like it stands on the page. The dark halo of the loop video is
 * cleaned too, outside of an ellipse around the dog.
 */
function keyFrame(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    isLoop: boolean,
): void {
    const size = canvas.width;
    context.drawImage(video, 0, 0, size, size);
    const frame = context.getImageData(0, 0, size, size);
    const pixels = frame.data;
    const centerX = size / 2;
    const centerY = 0.46 * size;
    const radiusX = 0.27 * size * (0.27 * size);
    const radiusY = 0.3 * size * (0.3 * size);

    for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
            const index = (y * size + x) * 4;
            const red = pixels[index];
            const green = pixels[index + 1];
            const blue = pixels[index + 2];
            const darkest = Math.min(red, green, blue);
            if (darkest > 230) {
                pixels[index + 3] = darkest >= 252 ? 0 : Math.floor(((252 - darkest) * 255) / 22);
                continue;
            }
            if (!isLoop) {
                continue;
            }
            const brightest = Math.max(red, green, blue);
            if (brightest >= 60) {
                continue;
            }
            const offsetX = x - centerX;
            const offsetY = y - centerY;
            if ((offsetX * offsetX) / radiusX + (offsetY * offsetY) / radiusY > 1) {
                pixels[index + 3] = brightest < 28 ? 0 : Math.floor(((brightest - 28) * 255) / 32);
            }
        }
    }

    trimDarkEdge(pixels, size);
    context.putImageData(frame, 0, 0);
}

/**
 * Drive the hero : an idle loop while nothing happens, then the full sequence
 * when the visitor asks for it, and finally the feed sliding over the page.
 */
export function useHeroSequence(): HeroSequence {
    const [status, setStatus] = useState<HeroStatus>('idle');
    const statusRef = useRef<HeroStatus>('idle');
    const cameraRef = useRef<HTMLDivElement | null>(null);
    const uiRef = useRef<HTMLDivElement | null>(null);
    const dogRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const loopRef = useRef<HTMLVideoElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const boxRef = useRef<HeroBox>({ left: 0, top: 0, size: 0 });
    const frameRef = useRef<number>(0);
    const loopFrameRef = useRef<number>(0);

    const paint = useCallback((video: HTMLVideoElement | null): void => {
        const canvas = canvasRef.current;
        if (video === null || canvas === null || video.readyState < 2) {
            return;
        }
        if (contextRef.current === null) {
            contextRef.current = canvas.getContext('2d', { willReadFrequently: true });
        }
        const context = contextRef.current;
        if (context === null) {
            return;
        }
        keyFrame(video, canvas, context, video === loopRef.current);
    }, []);

    const applyFrame = useCallback((time: number): void => {
        const camera = cameraRef.current;
        if (camera !== null) {
            camera.style.transform = cameraTransform(time, boxRef.current);
        }
        const ui = uiRef.current;
        if (ui !== null) {
            ui.style.opacity = String(1 - smoothstep(clamp01(time / 1.6)));
        }
    }, []);

    const runIdleLoop = useCallback((): void => {
        if (statusRef.current === 'playing' || statusRef.current === 'done') {
            return;
        }
        paint(loopRef.current);
        loopFrameRef.current = requestAnimationFrame(runIdleLoop);
    }, [paint]);

    const startIdleLoop = useCallback((): void => {
        cancelAnimationFrame(loopFrameRef.current);
        const loop = loopRef.current;
        if (loop !== null) {
            void loop.play().catch(() => undefined);
        }
        runIdleLoop();
    }, [runIdleLoop]);

    useEffect(() => {
        const loop = loopRef.current;
        if (loop === null) {
            return;
        }
        if (loop.readyState >= 2) {
            startIdleLoop();
        } else {
            loop.addEventListener('loadeddata', startIdleLoop, { once: true });
        }
        return () => {
            loop.removeEventListener('loadeddata', startIdleLoop);
            cancelAnimationFrame(loopFrameRef.current);
            cancelAnimationFrame(frameRef.current);
        };
    }, [startIdleLoop]);

    // While the sequence plays, the page must not scroll under the visitor.
    useEffect(() => {
        if (status !== 'playing') {
            return;
        }
        const block = (event: Event): void => event.preventDefault();
        window.addEventListener('wheel', block, { passive: false });
        window.addEventListener('touchmove', block, { passive: false });
        return () => {
            window.removeEventListener('wheel', block);
            window.removeEventListener('touchmove', block);
        };
    }, [status]);

    const start = useCallback((): void => {
        const video = videoRef.current;
        const dog = dogRef.current;
        if (statusRef.current !== 'idle' || video === null || dog === null) {
            return;
        }

        const run = (): void => {
            window.scrollTo(0, 0);
            const rect = dog.getBoundingClientRect();
            boxRef.current = { left: rect.left, top: rect.top + window.scrollY, size: rect.width };
            statusRef.current = 'playing';
            setStatus('playing');

            cancelAnimationFrame(loopFrameRef.current);
            const loop = loopRef.current;
            if (loop !== null) {
                loop.pause();
            }
            video.currentTime = 0;
            void video.play().catch(() => undefined);

            // The clock is picked once and never changes. Switching from the
            // wall clock to the video time in the middle made the timeline
            // jump backwards, and the dog played its swipe twice.
            const onVideoTime = video.error === null && Number.isFinite(video.duration);
            const startedAt = performance.now();
            let endedAt = 0;

            const tick = (now: number): void => {
                paint(video);
                let time: number;
                if (!onVideoTime || video.error !== null) {
                    time = (now - startedAt) / 1000;
                } else if (video.ended) {
                    endedAt = endedAt === 0 ? now : endedAt;
                    time = video.duration + (now - endedAt) / 1000;
                } else {
                    time = video.currentTime;
                }
                const capped = Math.min(time, DURATION);
                applyFrame(capped);
                if (capped < DURATION) {
                    frameRef.current = requestAnimationFrame(tick);
                    return;
                }
                video.pause();
                statusRef.current = 'done';
                setStatus('done');
            };
            frameRef.current = requestAnimationFrame(tick);
        };

        // The timeline follows the video, so the video has to be playable
        // first. Starting too early used to run the opening on the wall clock.
        if (video.readyState >= 3 || video.error !== null) {
            run();
            return;
        }
        statusRef.current = 'loading';
        setStatus('loading');
        let guard = 0;
        const onReady = (): void => {
            window.clearTimeout(guard);
            run();
        };
        guard = window.setTimeout(() => {
            video.removeEventListener('canplay', onReady);
            run();
        }, LOAD_TIMEOUT);
        video.addEventListener('canplay', onReady, { once: true });
    }, [applyFrame, paint]);

    return { status, cameraRef, uiRef, dogRef, canvasRef, videoRef, loopRef, start };
}

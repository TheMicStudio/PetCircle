import { HERO_CATEGORIES, LANDING_ASSETS } from '../landing.data';
import type { HeroSequence } from '../useHeroSequence';
import { ArrowIcon, BoneIcon, HeartIcon, PawIcon, SparklesIcon } from './icons';
import { LandingNav } from './landingNav';

interface HeroSceneProps {
    sequence: HeroSequence;
}

/**
 * First screen. The dog is drawn on a canvas from a video, so the camera can
 * zoom on it when the visitor asks to see the network.
 */
export function HeroScene({ sequence }: HeroSceneProps) {
    return (
        <div className="lp-stage">
            <div className="lp-stage__sticky">
                <div className="lp-camera" ref={sequence.cameraRef}>
                    <div className="lp-hero-ui" ref={sequence.uiRef}>
                        <LandingNav />

                        <div className="lp-hero">
                            <span className="lp-hero__eyebrow">Chiens, chats &amp; compagnie</span>
                            <h1 className="lp-hero__title">
                                Chaque animal mérite
                                <br />
                                <strong>
                                    son propre{' '}
                                    <span className="lp-hero__word">
                                        réseau
                                        <svg
                                            className="lp-hero__underline"
                                            viewBox="0 0 200 20"
                                            preserveAspectRatio="none"
                                            fill="none"
                                            stroke="#f2a41f"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M4 14c40-10 80-10 120-6s50 4 72-2" />
                                        </svg>
                                    </span>
                                </strong>
                            </h1>
                            <p className="lp-hero__text">
                                Partagez le quotidien de votre compagnon, suivez d’autres animaux et
                                retrouvez une communauté qui les aime autant que vous.
                            </p>
                        </div>

                        <button
                            className="lp-cta"
                            type="button"
                            onClick={sequence.start}
                            disabled={sequence.status === 'loading'}
                        >
                            {sequence.status === 'loading' ? 'Chargement' : 'Voir le réseau'}
                            <ArrowIcon />
                        </button>

                        <PawIcon className="lp-deco lp-deco--paw-left" color="#3f9b3a" />
                        <PawIcon className="lp-deco lp-deco--paw-right" color="#f2a41f" />
                        <BoneIcon className="lp-deco lp-deco--bone" />
                        <HeartIcon className="lp-deco lp-deco--heart" color="#3f9b3a" />
                        <SparklesIcon className="lp-deco lp-deco--sparkles" />

                        <div className="lp-tag lp-tag--profile">
                            <span className="lp-tag__avatar" />
                            @biscuit
                            <span className="lp-tag__breed">· Golden</span>
                        </div>
                        <div className="lp-tag lp-tag--like">
                            <HeartIcon color="#fff" size={14} />1 204
                        </div>

                        <div className="lp-categories">
                            {HERO_CATEGORIES.map((category) => (
                                <span key={category}>{category}</span>
                            ))}
                        </div>
                    </div>

                    <div className="lp-dog" ref={sequence.dogRef}>
                        <video
                            className="lp-dog__source"
                            ref={sequence.videoRef}
                            src={LANDING_ASSETS.dogVideo}
                            muted
                            playsInline
                            preload="auto"
                        />
                        <video
                            className="lp-dog__source"
                            ref={sequence.loopRef}
                            src={LANDING_ASSETS.dogLoopVideo}
                            muted
                            playsInline
                            loop
                            autoPlay
                            preload="auto"
                        />
                        <canvas className="lp-dog__canvas" ref={sequence.canvasRef} width={720} height={720} />
                    </div>
                </div>
            </div>
        </div>
    );
}


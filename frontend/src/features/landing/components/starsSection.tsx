import type { RefObject } from 'react';
import { Link } from 'react-router-dom';
import { STAR_PROFILES } from '../landing.data';
import { PawIcon, PlusIcon } from './icons';

interface StarsSectionProps {
    sectionRef: RefObject<HTMLElement | null>;
}

const DELAYS = ['', 'lp-delay-120', 'lp-delay-240'];

/** Podium of the three most followed pets of the week. */
export function StarsSection({ sectionRef }: StarsSectionProps) {
    return (
        <section className="lp-stars" ref={sectionRef}>
            <PawIcon className="lp-float lp-float--e" color="#3a2012" />
            <PawIcon className="lp-float lp-float--f" color="#3a2012" />

            <div className="lp-stars__inner">
                <div className="lp-stars__head" data-reveal>
                    <span className="lp-stars__eyebrow">Cette semaine</span>
                    <h2 className="lp-stars__title">
                        Les stars
                        <br />
                        de la semaine
                    </h2>
                    <p className="lp-stars__text">
                        Les profils les plus suivis par la communauté ces sept derniers jours.
                    </p>
                </div>

                <div className="lp-stars__grid">
                    {STAR_PROFILES.map((profile, index) => (
                        <div
                            key={profile.name}
                            className={'lp-star ' + DELAYS[index]}
                            data-reveal="pop"
                            data-lift
                        >
                            <span className="lp-star__rank">{profile.rank}</span>
                            <img className="lp-star__media" src={profile.image} alt={profile.name} />
                            <div className="lp-star__name">{profile.name}</div>
                            <div className="lp-star__meta">{profile.meta}</div>
                            <div className="lp-star__footer">
                                <span className="lp-star__followers">
                                    <b>{profile.followers}</b> abonnés
                                </span>
                                <Link
                                    className="lp-follow"
                                    to="/auth"
                                    aria-label={'Suivre ' + profile.name}
                                >
                                    <PlusIcon />
                                    SUIVRE
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

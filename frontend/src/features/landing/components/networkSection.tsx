import type { RefObject } from 'react';
import { Link } from 'react-router-dom';
import { LANDING_ASSETS } from '../landing.data';
import { ArrowIcon, PawIcon } from './icons';

interface NetworkSectionProps {
    catRef: RefObject<HTMLImageElement | null>;
}

/** Big statement of the page, with the cat peeking from the bottom. */
export function NetworkSection({ catRef }: NetworkSectionProps) {
    return (
        <section className="lp-network" id="reseau">
            <img className="lp-network__cat" ref={catRef} src={LANDING_ASSETS.cat} alt="" />

            <div className="lp-network__stage">
                <PawIcon className="lp-network__paw" color="#3a2012" />

                <h2 className="lp-network__title lp-network__title--left" data-reveal>
                    Ils ont
                    <br />
                    <span>enfin</span>
                </h2>
                <h2
                    className="lp-network__title lp-network__title--right lp-delay-100"
                    data-reveal
                    aria-hidden="true"
                >
                    leur
                    <br />
                    <span>propre</span>
                </h2>
                <div className="lp-network__word lp-delay-200" data-reveal="pop" aria-hidden="true">
                    RÉSEAU
                </div>

                <img className="lp-network__dog" src={LANDING_ASSETS.standingDog} alt="Un chien debout" />

                <div className="lp-network__note lp-delay-350" data-reveal>
                    <p>Publiez, aimez, commentez : ici les stars ont quatre pattes, des plumes ou des écailles.</p>
                    <Link className="lp-pill" to="/auth">
                        REJOINDRE
                        <span className="lp-pill__dot">
                            <ArrowIcon color="#f2a41f" size={12} />
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

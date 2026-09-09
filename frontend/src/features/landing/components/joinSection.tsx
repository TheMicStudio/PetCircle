import { Link } from 'react-router-dom';
import { JOIN_STATS } from '../landing.data';
import { ArrowIcon } from './icons';

/** Last call to action, with the numbers of the community. */
export function JoinSection() {
    return (
        <section className="lp-join" id="rejoindre">
            <div className="lp-join__scallop" aria-hidden="true" />

            <div className="lp-join__inner">
                <div className="lp-join__head" data-reveal>
                    <span className="lp-join__eyebrow">Rejoindre</span>
                    <h2 className="lp-join__title">
                        Rejoignez
                        <br />
                        la communauté
                    </h2>
                    <p className="lp-join__text">
                        Plus de 40 000 animaux partagent déjà leur quotidien sur PetCircle. Le profil de
                        votre compagnon est gratuit, à vie.
                    </p>
                    <Link className="lp-pill" to="/auth">
                        CRÉER UN PROFIL
                        <span className="lp-pill__dot">
                            <ArrowIcon color="#f2a41f" size={12} />
                        </span>
                    </Link>
                </div>

                <div className="lp-join__stats lp-delay-200" data-reveal>
                    {JOIN_STATS.map((stat) => (
                        <div className="lp-stat" key={stat.label}>
                            <span
                                className="lp-stat__value"
                                data-count={stat.count ?? undefined}
                                data-fmt={stat.count === null ? undefined : stat.format}
                            >
                                {stat.value}
                            </span>
                            <span className="lp-stat__label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

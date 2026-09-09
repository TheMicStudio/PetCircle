import { Link } from 'react-router-dom';
import { SERVICE_CARDS } from '../landing.data';
import { ArrowIcon, PawIcon } from './icons';

/** Two cards that explain what the product does. */
export function ServicesSection() {
    return (
        <section className="lp-services" id="services">
            <PawIcon className="lp-float lp-float--a" color="#f2a41f" />
            <PawIcon className="lp-float lp-float--b" color="#f2a41f" />
            <PawIcon className="lp-float lp-float--c" color="#f2a41f" />
            <PawIcon className="lp-float lp-float--d" color="#f2a41f" />

            <div className="lp-services__inner">
                <div className="lp-services__grid">
                    {SERVICE_CARDS.map((card, index) => (
                        <div
                            key={card.title}
                            className={index === 0 ? 'lp-card' : 'lp-card lp-delay-150'}
                            data-reveal="pop"
                        >
                            <div className="lp-card__frame" data-lift style={{ background: card.background }}>
                                <div className="lp-card__notch" />
                                <div className="lp-card__panel" />
                                <div className="lp-card__body">
                                    <h3 className="lp-card__title">{card.title}</h3>
                                    <p className="lp-card__text">{card.text}</p>
                                </div>
                                <img
                                    className={
                                        index === 0
                                            ? 'lp-card__media lp-card__media--narrow'
                                            : 'lp-card__media lp-card__media--wide'
                                    }
                                    src={card.image}
                                    alt={card.imageAlt}
                                />
                            </div>
                            <Link className="lp-link" to="/auth">
                                {card.linkLabel}
                                <ArrowIcon />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

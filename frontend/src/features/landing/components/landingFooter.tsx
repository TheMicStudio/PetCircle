import { Link } from 'react-router-dom';
import { LANDING_ASSETS, NAV_LINKS } from '../landing.data';

/** Footer of the landing. */
export function LandingFooter() {
    return (
        <footer className="lp-footer">
            <div className="lp-footer__inner">
                <div className="lp-footer__top">
                    <div className="lp-footer__brand">
                        <img className="lp-footer__logo" src={LANDING_ASSETS.logo} alt="PetCircle" />
                        <span className="lp-footer__tagline">Le réseau social de vos animaux.</span>
                    </div>
                    <div className="lp-footer__links">
                        {NAV_LINKS.map((link) => (
                            <a key={link.label} href={link.href}>
                                {link.label}
                            </a>
                        ))}
                        <Link to="/auth">Contact</Link>
                    </div>
                </div>

                <div className="lp-footer__bottom">
                    <span>© 2026 PetCircle. Tous droits réservés.</span>
                    <div className="lp-footer__legal">
                        <a href="#">Confidentialité</a>
                        <a href="#">Conditions</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

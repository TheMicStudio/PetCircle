import { Link } from 'react-router-dom';
import { LANDING_ASSETS, NAV_LINKS } from '../landing.data';

/** Top bar of the hero : links, logo in the middle, sign up on the right. */
export function LandingNav() {
    return (
        <nav className="lp-nav">
            <div className="lp-nav__links">
                {NAV_LINKS.map((link) => (
                    <a key={link.label} href={link.href}>
                        {link.label}
                    </a>
                ))}
            </div>
            <img className="lp-nav__logo" src={LANDING_ASSETS.logo} alt="PetCircle" />
            <div className="lp-nav__right">
                <Link className="lp-nav__join" to="/auth">
                    Rejoindre
                </Link>
            </div>
        </nav>
    );
}

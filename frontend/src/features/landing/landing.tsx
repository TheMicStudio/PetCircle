import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import type { SessionUser } from '@petcircle/contracts';
import { apiGet } from '../../shared/api/query/query';
import { useSession } from '../auth/session';
import { HeroScene } from './components/heroScene';
import { JoinSection } from './components/joinSection';
import { LandingFooter } from './components/landingFooter';
import { NetworkSection } from './components/networkSection';
import { ServicesSection } from './components/servicesSection';
import { StarsSection } from './components/starsSection';
import { useCatPeek } from './useCatPeek';
import { useHeroSequence } from './useHeroSequence';
import { useReveal } from './useReveal';
import './landing.css';

/** Marks the root while the destination page slides in. */
const ENTER_CLASS = 'lp-enter';

/**
 * Public landing page of PetCircle. It owns the two shared refs : the cat that
 * peeks over the stars section, and the sequence that drives the hero.
 */
export function LandingPage() {
    const sequence = useHeroSequence();
    const catRef = useRef<HTMLImageElement | null>(null);
    const starsRef = useRef<HTMLElement | null>(null);
    const leavingRef = useRef<boolean>(false);
    const { setUser } = useSession();
    const navigate = useNavigate();

    useReveal();
    useCatPeek(catRef, starsRef);

    // The sequence ends inside the network, so it always leaves the landing.
    useEffect(() => {
        if (sequence.status !== 'done' || leavingRef.current) {
            return;
        }
        leavingRef.current = true;

        const leave = async (): Promise<void> => {
            // The landing can stay open for a long time, and the session may
            // have expired or been closed in another tab. It is read again
            // here instead of trusting the value fetched on page load.
            let signedIn = false;
            try {
                const session = await apiGet<SessionUser>('/auth/me');
                signedIn = session.ok;
                setUser(session.ok ? session.data : null);
            } catch {
                setUser(null);
            }
            const path = signedIn ? '/feed' : '/auth';

            const startTransition = document.startViewTransition;
            if (typeof startTransition !== 'function') {
                // No View Transitions here : the page simply replaces the hero.
                navigate(path);
                return;
            }
            // The class scopes the animation, so the rest of the application
            // keeps its plain navigations.
            const root = document.documentElement;
            root.classList.add(ENTER_CLASS);
            const transition = startTransition.call(document, () => {
                // The router has to commit before the callback returns,
                // otherwise the browser captures the hero twice.
                flushSync(() => navigate(path));
            });
            // Removed whatever happens : a skipped transition rejects, and a
            // stalled one never settles. A class left behind would make every
            // later navigation slide.
            const clear = (): void => root.classList.remove(ENTER_CLASS);
            void transition.finished.then(clear, clear);
            window.setTimeout(clear, 1500);
        };

        // Runs outside the effect so flushSync is not called from a lifecycle.
        const timer = window.setTimeout(() => void leave(), 0);
        return () => window.clearTimeout(timer);
    }, [navigate, sequence.status, setUser]);

    return (
        <div className="lp">
            <HeroScene sequence={sequence} />
            <ServicesSection />
            <NetworkSection catRef={catRef} />
            <StarsSection sectionRef={starsRef} />
            <JoinSection />
            <LandingFooter />
        </div>
    );
}

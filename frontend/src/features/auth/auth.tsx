import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Brand } from "../../shared/components/Brand";
import { Inert } from "../../shared/components/Inert";
import { AppleIcon, BirdIcon, CatHeadIcon, DogHeadIcon, GoogleIcon, RabbitHeadIcon } from "../../shared/components/icons";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

// handoff design: which animal joins. Nothing is sent, the API only knows accounts.
const SPECIES = [
  { label: "Chien", icon: <DogHeadIcon size={15} /> },
  { label: "Chat", icon: <CatHeadIcon size={14} /> },
  { label: "Lapin", icon: <RabbitHeadIcon size={15} /> },
  { label: "Oiseau", icon: <BirdIcon size={14} /> },
];

const socialButton = "flex flex-[1_1_8rem] items-center justify-center gap-2 rounded-[0.6875rem] bg-pc-sand px-3 py-3.5 text-[0.875rem] font-medium text-pc-ink transition-colors hover:bg-pc-hover2";

const COPY = {
  signin: {
    title: "Bon retour",
    lead: "Connecte-toi pour voir ce que la meute a publié depuis ton départ.",
    switchLabel: "Nouveau ici ?",
    switchLink: "Créer un compte",
    switchTo: "/auth?mode=signup",
  },
  signup: {
    title: "Créer un compte",
    lead: "Un pseudo, un e-mail, un mot de passe : deux minutes et tu publies.",
    switchLabel: "Déjà une meute ?",
    switchLink: "Se connecter",
    switchTo: "/auth",
  },
};

// Split card from the handoff: the visual panel sits on the right when signing in, on the left
// when signing up. The DOM order never changes, the two panels slide past each other on
// desktop, so the switch animates. The card keeps one height, the form column scrolls inside.
export const AuthPage = () => {
  const [searchParams] = useSearchParams();

  const isSignup = searchParams.get("mode") === "signup";
  const copy = isSignup ? COPY.signup : COPY.signin;
  const [species, setSpecies] = useState("Chien");

  return (
    <div className="pc-app flex items-center justify-center p-[clamp(1rem,4vw,3.5rem)]">
      <div className="flex w-full max-w-[65rem] flex-col gap-2.5 rounded-[1.25rem] bg-pc-surface p-2.5 md:h-[min(52rem,calc(100vh-2*clamp(1rem,4vw,3.5rem)))] md:flex-row">
        <div
          className={`relative min-h-[min(34rem,60vh)] min-w-0 overflow-hidden rounded-[0.875rem] bg-pc-sage2 transition-transform duration-[620ms] ease-[cubic-bezier(.65,0,.35,1)] md:h-full md:min-h-0 md:flex-1 ${isSignup ? "" : "md:translate-x-[calc(100%+0.625rem)]"}`}
        >
          <img
            alt=""
            className="absolute inset-x-0 bottom-0 mx-auto h-[88%] w-auto max-w-none object-contain object-bottom"
            src="/landing/slot-dog-standing.webp"
          />
        </div>

        <div
          className={`relative z-[1] flex min-w-0 flex-col rounded-[0.875rem] bg-pc-surface transition-transform duration-[620ms] ease-[cubic-bezier(.65,0,.35,1)] md:h-full md:flex-1 md:overflow-y-auto md:[scrollbar-color:var(--color-pc-dot)_transparent] md:[scrollbar-width:thin] ${isSignup ? "" : "md:-translate-x-[calc(100%+0.625rem)]"}`}
        >
          {/* keyed by mode: a fresh subtree, so the rise animation replays on every switch */}
          <div className="pc-rise flex flex-col p-[clamp(1.5rem,3.4vw,2.625rem)] md:my-auto" key={isSignup ? "signup" : "signin"}>
          <div className="mb-[clamp(1.5rem,3vw,2.5rem)]">
            <Brand size="lg" />
          </div>

          <h1 className="font-display text-[clamp(1.875rem,4.4vw,2.75rem)] leading-[1.05] font-semibold tracking-[-0.025em]">
            {copy.title}
          </h1>
          <p className="mt-3 mb-7 max-w-[36ch] text-[0.9375rem] leading-[1.6] text-pc-muted">{copy.lead}</p>

          {isSignup && (
            <div className="mb-4 flex flex-col gap-2">
              <span className="text-[0.6875rem] font-semibold tracking-[0.1em] text-pc-label uppercase">Qui nous rejoint ?</span>
              <div className="flex flex-wrap gap-[7px]" role="group" aria-label="Espèce">
                {SPECIES.map((item) => (
                  <button
                    aria-pressed={species === item.label}
                    className={`flex cursor-pointer items-center gap-[7px] rounded-[0.5625rem] px-3.5 py-2.5 text-[0.78125rem] font-semibold transition-colors ${
                      species === item.label ? "bg-pc-forest text-pc-surface" : "bg-pc-sand text-pc-body hover:bg-pc-hover2"
                    }`}
                    key={item.label}
                    onClick={() => setSpecies(item.label)}
                    type="button"
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isSignup ? <RegisterForm /> : <LoginForm />}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-pc-hair2" />
            <span className="text-[0.71875rem] font-medium tracking-[0.1em] text-[#ae9578] uppercase">ou continuer avec</span>
            <div className="h-px flex-1 bg-pc-hair2" />
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Inert className={socialButton}>
              <AppleIcon />
              Apple
            </Inert>
            <Inert className={socialButton}>
              <GoogleIcon />
              Google
            </Inert>
          </div>

          <p className="mt-7 text-center text-[0.9rem] leading-[1.5] text-pc-muted">
            {copy.switchLabel}{" "}
            <Link className="font-semibold text-pc-accent no-underline hover:text-pc-accent2" to={copy.switchTo}>
              {copy.switchLink}
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

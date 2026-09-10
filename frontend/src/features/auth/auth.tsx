import { Link, useSearchParams } from "react-router-dom";
import { Brand } from "../../shared/components/Brand";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

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

// Split card from the handoff: the visual panel sits on the right when signing in, on the left when signing up.
export const AuthPage = () => {
  const [searchParams] = useSearchParams();

  const isSignup = searchParams.get("mode") === "signup";
  const copy = isSignup ? COPY.signup : COPY.signin;

  return (
    <div className="pc-app flex items-center justify-center p-[clamp(1rem,4vw,3.5rem)]">
      <div
        className={`flex w-full max-w-[65rem] flex-wrap gap-2.5 rounded-[1.25rem] bg-pc-surface p-2.5 ${isSignup ? "flex-row" : "flex-row-reverse"}`}
      >
        <div className="relative min-h-[min(34rem,60vh)] min-w-0 flex-[1_1_18.75rem] overflow-hidden rounded-[0.875rem] bg-pc-sage2">
          <img
            alt=""
            className="absolute inset-x-0 bottom-0 mx-auto h-[88%] w-auto max-w-none object-contain object-bottom"
            src="/landing/slot-dog-standing.webp"
          />
        </div>

        <div className="flex min-w-0 flex-[1_1_18.75rem] flex-col justify-center p-[clamp(1.5rem,3.4vw,2.625rem)]">
          <div className="mb-[clamp(1.5rem,3vw,2.5rem)]">
            <Brand size="lg" />
          </div>

          <h1 className="font-display text-[clamp(1.875rem,4.4vw,2.75rem)] leading-[1.05] font-semibold tracking-[-0.025em]">
            {copy.title}
          </h1>
          <p className="mt-3 mb-7 max-w-[36ch] text-[0.9375rem] leading-[1.6] text-pc-muted">{copy.lead}</p>

          {isSignup ? <RegisterForm /> : <LoginForm />}

          <p className="mt-7 text-center text-[0.9rem] leading-[1.5] text-pc-muted">
            {copy.switchLabel}{" "}
            <Link className="font-semibold text-pc-accent no-underline hover:text-pc-accent2" to={copy.switchTo}>
              {copy.switchLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

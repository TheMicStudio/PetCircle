import { Link, useSearchParams } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export const AuthPage = () => {
  const [searchParams] = useSearchParams();

  const isSignup = searchParams.get("mode") === "signup";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f1f1f1] p-6 [color-scheme:light]">
      <div className="w-full max-w-[24rem] rounded-[0.75rem] border border-solid border-[#00000014] bg-white p-8 shadow-[0_2px_4px_#0000000d,0_4px_8px_#0000001a]">
        <h1 className="text-[1.5rem] font-semibold tracking-tight text-[#111111]">
          {isSignup ? "Créer un compte" : "Se connecter"}
        </h1>
        <p className="mt-1 text-[0.875rem] text-[#525252]">
          {isSignup ? "Rejoins PetCircle en quelques secondes." : "Content de te revoir sur PetCircle."}
        </p>

        <div className="mt-6">{isSignup ? <RegisterForm /> : <LoginForm />}</div>

        <p className="mt-6 text-center text-[0.875rem] text-[#525252]">
          {isSignup ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
          <Link
            className="font-medium text-[#111111] underline underline-offset-2 hover:text-[#525252]"
            to={isSignup ? "/auth" : "/auth?mode=signup"}
          >
            {isSignup ? "Se connecter" : "S'inscrire"}
          </Link>
        </p>
      </div>
    </div>
  );
};

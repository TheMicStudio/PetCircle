import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "@petcircle/contracts";
import type { FieldErrors } from "../../shared/api/mutation/mutation";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";
import { Inert } from "../../shared/components/Inert";
import { ArrowIcon } from "../../shared/components/icons";
import { toFieldErrors } from "../../shared/validation";
import { useLogin } from "./useAuth";
import { useSession } from "./session";

export const LoginForm = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});

  const navigate = useNavigate();
  const { setUser } = useSession();

  const login = useLogin();
  const failure = login.state.status === "error" ? login.state : undefined;
  const fields = { ...failure?.fields, ...errors };
  const loading = login.state.status === "loading";

  const update = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }

    setErrors({});

    const result = await login.mutate(parsed.data);

    if (result.ok && result.data !== undefined) {
      setUser(result.data);
      navigate("/feed", { replace: true });
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => void handleSubmit(e)}>
      {failure && Object.keys(fields).length === 0 && (
        <p className="rounded-[0.625rem] bg-pc-danger-bg px-3.5 py-2.5 text-[0.8125rem] font-medium text-pc-danger" role="alert">
          {failure.message}
        </p>
      )}

      <Input
        label="E-mail"
        type="email"
        name="email"
        placeholder="vous@exemple.com"
        value={values.email}
        error={fields.email}
        onChange={update}
      />
      <Input
        label="Mot de passe"
        type="password"
        name="password"
        placeholder="••••••••"
        value={values.password}
        error={fields.password}
        onChange={update}
      />

      {/* handoff design: the session already persists, and no reset route exists */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3.5">
        <label className="flex cursor-pointer items-center gap-2 text-[0.875rem] text-pc-body2">
          <input className="m-0 h-4 w-4 accent-pc-forest" defaultChecked type="checkbox" />
          Rester connecté
        </label>
        <Inert className="text-[0.875rem] font-medium text-pc-accent hover:text-pc-accent2">Mot de passe oublié ?</Inert>
      </div>

      <Button className="mt-2 h-[3.25rem]" type="submit" fullWidth disabled={loading}>
        {loading ? "Connexion…" : "Se connecter à PetCircle"}
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pc-ink text-pc-cta">
          <ArrowIcon />
        </span>
      </Button>
    </form>
  );
};

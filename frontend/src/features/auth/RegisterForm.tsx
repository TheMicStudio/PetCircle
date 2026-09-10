import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerSchema } from "@petcircle/contracts";
import type { FieldErrors } from "../../shared/api/mutation/mutation";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";
import { ArrowIcon } from "../../shared/components/icons";
import { toFieldErrors } from "../../shared/validation";
import { useRegister } from "./useAuth";
import { useSession } from "./session";

export const RegisterForm = () => {
  const [values, setValues] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});

  const navigate = useNavigate();
  const { setUser } = useSession();

  const register = useRegister();
  const failure = register.state.status === "error" ? register.state : undefined;
  const fields = { ...failure?.fields, ...errors };
  const loading = register.state.status === "loading";

  const update = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }

    setErrors({});

    const result = await register.mutate(parsed.data);

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
        label="Pseudo"
        name="username"
        placeholder="mathys"
        value={values.username}
        error={fields.username}
        onChange={update}
      />
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
        hint="8 caractères minimum"
        value={values.password}
        error={fields.password}
        onChange={update}
      />

      {/* handoff design: a pledge, not stored anywhere */}
      <label className="mt-1 flex cursor-pointer items-start gap-2.5 text-[0.84375rem] leading-[1.5] text-pc-body2">
        <input className="mt-0.5 h-4 w-4 shrink-0 accent-pc-forest" defaultChecked type="checkbox" />
        Je veille à des publications bienveillantes et à des photos qui lui appartiennent.
      </label>

      <Button className="mt-2 h-[3.25rem]" type="submit" fullWidth disabled={loading}>
        {loading ? "Création…" : "Créer mon compte"}
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pc-ink text-pc-cta">
          <ArrowIcon />
        </span>
      </Button>
    </form>
  );
};

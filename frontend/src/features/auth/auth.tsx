
import { useState } from "react";
import { useRegister, useLogin } from "./useAuth";

export const RegisterPage = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    register.mutate({ username, email, password });
  };

  return (
    <div>

      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" >Register</button>

      </form>

    </div>
  );
};

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login.mutate({ email, password });
  };

  return (
    <div>

      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" >Login</button>
      </form>

    </div>
  );
};

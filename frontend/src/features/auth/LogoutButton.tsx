import { LogoutIcon } from "../../shared/components/icons";
import { useSession } from "./session";
import { useLogout } from "./useAuth";

export const LogoutButton = () => {
  const { setUser } = useSession();
  const logout = useLogout();
  const loading = logout.state.status === "loading";

  const handleClick = async () => {
    const result = await logout.mutate();

    if (result.ok) {
      setUser(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {logout.state.status === "error" && (
        <span className="text-[0.75rem] font-medium text-pc-danger">{logout.state.message}</span>
      )}
      <button
        className="flex cursor-pointer rounded-[0.625rem] p-2.5 text-pc-body2 transition-colors hover:bg-pc-hover hover:text-pc-danger disabled:cursor-not-allowed disabled:opacity-50"
        disabled={loading}
        onClick={() => void handleClick()}
        title="Se déconnecter"
        type="button"
      >
        <LogoutIcon />
      </button>
    </div>
  );
};

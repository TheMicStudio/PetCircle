
import { useGetProfile } from "./useProfile";
import { useParams } from "react-router-dom";


export const ProfilePage = () => {
  const { id } = useParams();
  const profile = useGetProfile(id??'');

  if (!id) return <p>Profil introuvable.</p>;

  if (profile.status === 'loading') return <p>Chargement du profil...</p>;
  if (profile.status === 'error') return <p>{profile.message  }  </p>;
  if (profile.status === 'empty') return <p>Profil introuvable.</p>;

  return <div>
    <h1>Utilisateur : {profile.data.username}</h1>
    <p>Nombre de posts : {profile.data.postCount}</p>
    <p>Nombre de followers : {profile.data.followerCount}</p>
    <p>Nombre de following : {profile.data.followingCount}</p>
    <p>Compte créé le : {profile.data.createdAt}</p>

  </div>
};

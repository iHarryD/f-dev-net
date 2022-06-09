import ProfileSection from "../components/profileSection/ProfileSection";
import profileStyles from "../styles/Profile.module.css";

export default function Profile() {
  return (
    <main className={profileStyles.profilePageMain}>
      <ProfileSection />
    </main>
  );
}

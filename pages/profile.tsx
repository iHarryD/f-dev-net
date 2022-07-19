import ProfileSection from "../components/profileSection/ProfileSection";
import profileStyles from "../styles/Profile.module.css";

export default function Profile() {
  return (
    <div className={profileStyles.profilePageContainer}>
      <ProfileSection />
    </div>
  );
}

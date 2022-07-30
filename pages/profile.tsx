import { useSelector } from "react-redux";
import PrivateRouteAlert from "../components/privateRouteAlert/PrivateRouteAlert";
import ProfileSection from "../components/profileSection/ProfileSection";
import { RootState } from "../store";
import profileStyles from "../styles/Profile.module.css";

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.userSlice);
  return user ? (
    <div className={profileStyles.profilePageContainer}>
      <ProfileSection />
    </div>
  ) : (
    <PrivateRouteAlert />
  );
}

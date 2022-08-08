import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, updateUser } from "../../features/userSlice";
import { UserAuthStatus } from "../../interfaces/Common.interface";
import { AppDispatch, RootState } from "../../store";
import InitialFullPageLoader from "../initialFullPageLoader/InitialFullPageLoader";

export default function AuthUIHandler({ children }: { children: JSX.Element }) {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.userSlice);
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      dispatch(login({ user: JSON.parse(user), token: token }));
      dispatch(updateUser());
    } else {
      dispatch(logout());
    }
  }, []);
  return status === UserAuthStatus.LOADING ? (
    <InitialFullPageLoader />
  ) : (
    children
  );
}

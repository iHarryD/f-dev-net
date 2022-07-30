import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import privateRouteAlertStyles from "./PrivateRouteAlert.module.css";

export default function PrivateRouteAlert() {
  const [redirectIn, setRedirectIn] = useState<number>(5);
  const intervalID = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    intervalID.current = setInterval(() => {
      setRedirectIn((prev) => prev - 1);
    }, 1000);

    return () => {
      if (intervalID.current) {
        clearInterval(intervalID.current);
      }
    };
  }, []);

  useEffect(() => {
    if (redirectIn === 0) {
      if (intervalID.current) {
        clearInterval(intervalID.current);
      }
      Router.push("/");
    }
  }, [redirectIn]);

  return (
    <div className={privateRouteAlertStyles.alertTextContainer}>
      <p>This is a private route. You need to login to view this route.</p>
      <p>You will be redirected to our home page in {redirectIn}.</p>
    </div>
  );
}

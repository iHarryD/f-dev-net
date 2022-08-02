import useInMobileView from "../../hooks/useInMobileView";
import MacroPageNavbar from "../macroPageNavbar/MacroPageNavbar";
import MiniPageNavbar from "../miniPageNavbar/MiniPageNavbar";

export default function HomePageNavbar() {
  const { inMobileView } = useInMobileView();

  return inMobileView ? <MiniPageNavbar /> : <MacroPageNavbar />;
}

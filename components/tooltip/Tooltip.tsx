import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useState } from "react";
import tooltipStyles from "./Tooltip.module.css";

export default function Tooltip({
  tooltipItems,
}: {
  tooltipItems: {
    tooltipChild: ReactNode;
    tooltipOnClickHandler: () => void;
  }[];
}) {
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  return (
    <div className={tooltipStyles.tooltipContainer}>
      <button onClick={() => setIsMenuVisible((prev) => !prev)}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>
      {isMenuVisible && (
        <div className={tooltipStyles.tooltipMenu}>
          {tooltipItems.map((item, index) => (
            <button
              key={index}
              className={tooltipStyles.tooltipMenuItem}
              onClick={() => item.tooltipOnClickHandler()}
            >
              {item.tooltipChild}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

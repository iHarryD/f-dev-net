import { LegacyRef } from "react";
import { PostCategories } from "../../interfaces/Common.interface";
import commonStyles from "../../styles/Common.module.css";

export default function PostCategoryDropdown({
  background,
  selectRef,
}: {
  background?: string;
  selectRef: LegacyRef<HTMLSelectElement>;
}) {
  return (
    <select
      ref={selectRef}
      className={commonStyles.styledDropdown}
      style={{ background: background ? background : "#fff" }}
    >
      <option value={PostCategories.GENERAL}>General</option>
      <option value={PostCategories.QUERY}>Query</option>
    </select>
  );
}

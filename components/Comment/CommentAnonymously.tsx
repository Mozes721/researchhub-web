import { ReactElement } from "react";
import Switch from "@mui/material/Switch";
import { ID } from "~/config/types/root_types";
import { css, StyleSheet } from "aphrodite";

type Props = {
  id: ID;
  isAnonymous: boolean;
  onToggle: () => void;
};

const AnonymousToggle = ({ id, isAnonymous, onToggle }: Props): ReactElement => {
  return (
    <div className={css(styles.toggleContainer)}>
      {"toggle anonymity"}
      <Switch onChange={onToggle} checked={isAnonymous} />
    </div>
  );
};

export default AnonymousToggle;

const styles = StyleSheet.create({
  toggleContainer: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
    boxSizing: "border-box",
  },
});
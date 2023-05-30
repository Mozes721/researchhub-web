import { useState, useEffect, ReactElement } from "react";
import { ToggleSlider } from "react-toggle-slider";
import { toggleUserAsAnnonymous } from "./api/setUserAsAnnonymous";
import { css,StyleSheet } from "aphrodite";
import {emptyFncWithMsg} from "~/config/utils/nullchecks";

type Props = {
  id: string;
  annonymous: boolean;
  onToggle: () => void;
};

const AnnonymousToggle = ({
  id,
  annonymous,
  onToggle,
}: Props): ReactElement => {
  const [active, setActive] = useState(annonymous);

  useEffect(() => {
    setActive(annonymous);
    toggleUserAsAnnonymous(onerror, id)
  }, [id, annonymous, active]);

  const handleToggle = (state: boolean) => {
    setActive(state);
    onToggle();
  };
  return (
    <div className={css(styles.toggleContainer)}>
      <ToggleSlider onToggle={handleToggle} active={active} />
    </div>
  );
};

export default AnnonymousToggle;

const styles = StyleSheet.create({
    toggleContainer: {
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: 4,
      boxSizing: "border-box",
      position: "absolute",
    },
  });
import { useState, useEffect, ReactElement } from "react";
import { AnnonymousRevealedIcon, AnnonymousHiddenIcon } from "../Icons/AnnonymousToggle";

type Props = { annonymous: boolean };

export const AnnonymousButton = ({ annonymous  }: Props): ReactElement => {
    const [isAnnonymous, setIsAnnonymous] = useState(annonymous);

    useEffect(() => {
        setIsAnnonymous(annonymous);
      }, [annonymous]);

    return (
    <>
      {isAnnonymous ? <AnnonymousRevealedIcon /> : <AnnonymousHiddenIcon />}
    </>
  );
};
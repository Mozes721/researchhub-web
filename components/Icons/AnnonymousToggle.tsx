import React from "react";
import Image from "next/image";

type Args = {
  width?: number;
  height?: number;
  alt?: string;
};

export const AnnonymousRevealedIcon = ({ height = 20, width = 20 }: Args) => {
  return (
    <Image
      width={height}
      height={width}
      src="/static/icons/visibility_icon.svg"
      alt="annonymous revelead"
    />
  );
};


export const AnnonymousHiddenIcon = ({ height = 20, width = 20 }: Args) => {
    return (
        <Image
        width={height}
        height={width}
        src="/static/icons/annonymous_icon.svg"
        alt="annonymous hidden"
      />
    );
  };
  
  
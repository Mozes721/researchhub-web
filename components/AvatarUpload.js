import { useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import dynamic from "next/dynamic";

// Components
import BaseModal from "~/components/modal/BaseModal";

// Config
import colors from "~/config/themes/colors";
import ResearchHubIcon from "../static/ResearchHubIcon";

const AvatarEdit = dynamic(() => import("react-avatar-edit"), { ssr: false });

const AvatarUpload = (props) => {
  let { isOpen, closeModal, saveButton, section } = props;
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  let onClose = () => {
    setPreview(null);
  };

  let onCrop = (preview) => {
    setPreview(preview);
  };

  let onBeforeFileLoad = (elem) => {
    // if(elem.target.files[0].size > 71680){
    //   alert("File is too big!");
    //   elem.target.value = "";
    // };
  };

  return (
    <BaseModal
      title={"Upload Profile Picture"}
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div className={css(styles.modalContainer)}>
        <AvatarEdit
          height={200}
          onCrop={onCrop}
          onClose={onClose}
          onBeforeFileLoad={onBeforeFileLoad}
          src={image}
        />
        {/* <div className={css(styles.preview)}>Preview</div>
        {preview && <img width={80} hieght={80} src={preview} alt="Preview" />} */}
      </div>
      <div
        className={css(styles.actions, !preview && styles.disable)}
        disable={!preview}
      >
        {saveButton(section, { picture: preview })}
      </div>
      <div className={css(styles.icon)}>
        <ResearchHubIcon />
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  preview: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 500,
    fontSize: 26,
  },
  uploadInstructions: {
    marginBottom: 5,
    fontWeight: 500,
    fontSize: 33,
  },
  icon: {
    marginTop: 16,
  },
  modalContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  actions: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  disable: {
    opacity: 0.5,
  },
});

export default AvatarUpload;

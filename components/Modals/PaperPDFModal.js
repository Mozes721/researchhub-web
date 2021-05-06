import React, { useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Component
import BaseModal from "./BaseModal";

// Redux
import { ModalActions } from "~/redux/modals";

// Config
import { convertHttpToHttps } from "~/config/utils";

const PaperPDFModal = (props) => {
  const { paper, paperId, modals, openPaperPDFModal } = props;
  const [paperPDF, setPaperPDF] = useState(getPaperPDF(paper));

  useEffect(() => setPaperPDF(getPaperPDF(paper)), [
    paper,
    paperId,
    modals.openPaperPDFModal,
  ]);

  function getPaperPDF(paper) {
    const { file, pdf_url } = paper;
    const paperFile = file || pdf_url;

    return paperFile ? convertHttpToHttps(paperFile) : closeModal();
  }

  function closeModal() {
    document.body.style.overflow = "scroll";
    return openPaperPDFModal(false);
  }

  return (
    <BaseModal
      isOpen={modals.openPaperPDFModal}
      closeModal={closeModal}
      removeDefault={true}
    >
      <div className={css(styles.root)}>
        <img
          src={"/static/icons/close.png"}
          className={css(styles.closeButton)}
          onClick={closeModal}
          alt="Close Button"
        />
        <iframe src={paperPDF} height={"95%"} width={"100%"} frameBorder="0" />
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    height: "90vh",
    width: "90vw",
    background: "rgb(50, 54, 57)",
  },
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: -6,
    right: 0,
    padding: 16,
    cursor: "pointer",
  },
});

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = {
  openPaperPDFModal: ModalActions.openPaperPDFModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperPDFModal);

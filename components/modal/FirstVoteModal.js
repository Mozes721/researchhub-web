import { Fragment, useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import { useDispatch, useStore } from "react-redux";
import Confetti from "react-confetti";

// Component
import BaseModal from "./BaseModal";
import Loader from "../Loader/Loader";
import Button from "../Form/Button";

// Redux
import { AuthActions } from "~/redux/auth";
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";

const FirstVoteModal = (props) => {
  const dispatch = useDispatch();
  const store = useStore();
  const [userFirstVote, setFirstVote] = useState(
    store.getState().auth.user.has_seen_first_vote_modal
  );
  const [recycle, setRecycle] = useState(true);
  const [reveal, toggleReveal] = useState(false);
  const [showButton, toggleButton] = useState(false);

  useEffect(() => {
    if (store.getState().modals.openFirstVoteModal) {
      dispatch(AuthActions.getUser());
      setTimeout(() => {
        toggleReveal(true);
        setTimeout(() => {
          toggleButton(true);
          recycle && setRecycle(false);
        }, 1500);
      }, 1500);
    }
  }, [store.getState().modals.openFirstVoteModal]);

  function userHasFirstSeen(e) {
    e.stopPropagation();
    let config = {
      has_seen_first_vote_modal: true,
    };
    fetch(API.USER_FIRST_VOTE, API.PATCH_CONFIG(config))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        if (res.has_seen_first_vote_modal) {
          closeModal();
        }
      });
  }

  function closeModal() {
    dispatch(ModalActions.openFirstVoteModal(false));
    setRecycle(true);
    toggleReveal(false);
    toggleButton(false);
    enableParentScroll();
  }

  function enableParentScroll() {
    document.body.style.overflow = "scroll";
  }

  function openLinkInTab(e) {
    e.stopPropagation();
    let url =
      "https://www.notion.so/researchhub/ResearchCoin-21d1af8428824915a4d1f7c0b6b77cb4";
    let win = window.open(url, "_blank");
    win.focus();
  }

  return (
    <BaseModal
      isOpen={store.getState().modals.openFirstVoteModal}
      closeModal={closeModal}
      title={"Congrats on your first upvote!"}
      subtitle={() => {
        return (
          <div className={css(styles.row)}>
            Here's a Research Coin
            <img
              className={css(styles.coinIcon)}
              src={"/static/icons/coin.png"}
            />
          </div>
        );
      }}
    >
      <div className={css(styles.modalBody)}>
        <Confetti recycle={recycle} numberOfPieces={300} height={260} />
        <div className={css(styles.body, reveal && styles.reveal)}>
          <div className={css(styles.hyperlink)} onClick={openLinkInTab}>
            Click here to learn how to earn more.
          </div>
          <div className={css(styles.button, showButton && styles.showButton)}>
            <Button label={"Close"} onClick={userHasFirstSeen} />
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  coinIcon: {
    height: 20,
    marginLeft: 8,
  },
  row: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    whiteSpace: "pre-wrap",
    marginTop: 15,
    transition: "all ease-in-out 0.3s",
    opacity: 0,
    height: 0,
  },
  hyperlink: {
    color: colors.BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  reveal: {
    opacity: 1,
    height: 90,
    zIndex: 3,
  },
  button: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
    transition: "all ease-in-out 0.3s",
    opacity: 0,
  },
  showButton: {
    opacity: 1,
  },
});

export default FirstVoteModal;

import { Fragment, useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import { useDispatch, useStore } from "react-redux";
import Confetti from "react-confetti";

// Component
import BaseModal from "./BaseModal";
import Loader from "../Loader/Loader";
import Button from "../Form/Button";
import GoogleLoginButton from "../GoogleLoginButton";

// Redux
import { AuthActions } from "~/redux/auth";
import { ModalActions } from "~/redux/modals";

// Config
import { RHLogo } from "~/config/themes/icons";

const SignUpModal = (props) => {
  const dispatch = useDispatch();
  const store = useStore();
  const [userFirstVote, setFirstVote] = useState();
  // store.getState().auth.user.has_seen_first_coin_modal
  const [reveal, toggleReveal] = useState(false);
  const [showButton, toggleButton] = useState(false);

  useEffect(() => {
    if (store.getState().modals.openSignUpModal) {
      let firstTime = !store.getState().auth.user.has_seen_first_coin_modal;
    }
  }, [store.getState().modals.openSignUpModal]);

  function closeModal() {
    dispatch(ModalActions.openSignUpModal(false));
    enableParentScroll();
  }

  function enableParentScroll() {
    document.body.style.overflow = "scroll";
  }

  function renderDivider() {
    return (
      <div className={css(styles.row, styles.divider)}>
        <div className={css(styles.line)} />
        <div className={css(styles.lineText)}>or</div>
        <div className={css(styles.line)} />
      </div>
    );
  }

  return (
    <BaseModal
      isOpen={store.getState().modals.openSignUpModal}
      closeModal={closeModal}
      title={() => {
        return <RHLogo iconStyle={styles.logo} />;
      }}
      modalStyle={styles.modalStyle}
      modalContentStyle={styles.modalContentStyle}
      subtitle={() => {
        return (
          <div className={css(styles.title)}>Welcome to our community!</div>
        );
      }}
    >
      <div className={css(styles.modalBody)}>
        <div className={css(styles.subtitle)}>
          Join today and earn 50 RHC
          <img
            className={css(styles.coinIcon)}
            src={"/static/icons/coin-filled.png"}
          />
        </div>

        <div className={css(styles.googleButton)}>
          <GoogleLoginButton customLabel={"Sign up with Google"} />
        </div>
        {renderDivider()}
        <div className={css(styles.loginContainer)}>
          {"Already a member? "}
          <GoogleLoginButton customLabel={"Log in"} hideButton={true} />
        </div>
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    "@media only screen and (max-width: 665px)": {
      width: "unset",
    },
  },
  modalContentStyle: {
    overflow: "hidden",
    width: 400,
    boxSizing: "border-box",
    padding: 25,
  },
  title: {
    paddingTop: 15,
    fontSize: 24,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    width: "100%",
  },
  titleText: {},
  coinIcon: {
    height: 20,
    marginLeft: 8,
  },
  logo: {
    width: 120,
    objectFit: "contain",
  },
  subtitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
  },
  row: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 400,
  },
  divider: {
    padding: "20px 15px",
    boxSizing: "border-box",
    justifyContent: "space-between",
  },
  line: {
    backgroundColor: "#DBDBDB",
    height: 1,
    width: "42%",
  },
  lineText: {
    color: "#8E8E8E",
    textTransform: "uppercase",
    fontSize: 13,
    fontWeight: 600,
  },
  modalBody: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    zIndex: 9999999,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  googleButton: {
    marginTop: 20,
  },
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    fontSize: 15,
    whiteSpace: "pre-wrap",
    cursor: "default",
  },
});

export default SignUpModal;

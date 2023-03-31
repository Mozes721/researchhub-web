import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/pro-regular-svg-icons";
import { css, StyleSheet } from "aphrodite";
import CommentVote from "./CommentVote";
import { TopLevelDocument } from "~/config/types/root_types";
import { Comment } from "./lib/types";
import Image from "next/image";
import IconButton from "../Icons/IconButton";
import colors from "./lib/colors";
import WidgetContentSupport from "../Widget/WidgetContentSupport";
import { useSelector } from "react-redux";
import { RootState } from "~/redux";
import { parseUser } from "~/config/types/root_types";
import { isEmpty } from "~/config/utils/nullchecks";
import ContentSupportModal from "../Modals/ContentSupportModal";
type Args = {
  toggleReply: Function;
  comment: Comment;
  document: TopLevelDocument;
  isReplyOpen: boolean;
};

const CommentActions = ({
  comment,
  document,
  toggleReply,
  isReplyOpen,
}: Args) => {
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.actionsWrapper)}>
        <div className={`${css(styles.action)} vote-btn`}>
          <CommentVote
            comment={comment}
            score={comment.score}
            userVote={comment.userVote}
            documentType={document.documentType}
            documentID={document.id}
          />
        </div>
        <div className={`${css(styles.action)} tip-btn`}>
          <IconButton onClick={() => null}>
            <Image
              src="/static/icons/tip.png"
              height={18}
              width={19}
              alt="Tip"
            />
            <span className={css(styles.actionText)}>Tip</span>
          </IconButton>

          {currentUser?.id !== comment.createdBy.id &&
            <WidgetContentSupport
                data={{
                  created_by: comment.createdBy.raw,
                }}
                metaData={{
                  contentType: "researchhub_comment", objectId: comment.id  
                }}
              />          
          }
        </div>



        {/* <div className={`${css(styles.action)} award-btn`}>
          <IconButton onClick={() => null}>
            <FontAwesomeIcon icon={faCrown} style={{fontSize: 16}} />
            <span className={css(styles.actionText)}>
              Award
            </span>
          </IconButton>
        </div>         */}

        <div className={`${css(styles.action, styles.actionReply)} reply-btn`}>
          <IconButton onClick={() => toggleReply()}>
            <Image
              src="/static/icons/reply.png"
              height={13}
              width={15}
              alt="Reply"
            />
            <span className={css(styles.actionText)}>Reply</span>
          </IconButton>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
  action: {
    display: "flex",
    columnGap: "5px",
    alignItems: "center",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
  },
  actionReply: {
    marginLeft: "auto",
  },
  editAction: {},
  actionText: {
    color: colors.secondary.text,
  },
  actionsWrapper: {
    columnGap: "10px",
    display: "flex",
  },
});

export default CommentActions;

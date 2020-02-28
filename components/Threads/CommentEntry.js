import React, { Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Component
import VoteWidget from "../VoteWidget";
import ThreadActionBar from "./ThreadActionBar";
import DiscussionPostMetadata from "../DiscussionPostMetadata";
import ReplyEntry from "./ReplyEntry";
import ThreadLine from "./ThreadLine";
import ThreadTextEditor from "./ThreadTextEditor";

// Config
import colors from "~/config/themes/colors";
import { UPVOTE, DOWNVOTE } from "~/config/constants";
import { checkVoteTypeChanged, getNestedValue } from "~/config/utils";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

// Redux
import DiscussionActions from "../../redux/discussion";
import { MessageActions } from "~/redux/message";
import { transformReplies } from "~/redux/discussion/shims";

class CommentEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elementHeight: 0,
      revealReply: false,
      hovered: false,
      collapsed: false,
      score: 0,
      selectedVoteType: "",
      // Pagination
      page: 2, // we assume page 1 is already present
      fetching: false, // when true, we show loading state,
      replies: [],
      // Removed
      removed: this.props.comment.isRemoved,
    };
    this.commentRef = null;
  }

  componentDidMount() {
    const selectedVoteType = getNestedValue(this.props, [
      "comment",
      "user_vote",
      "vote_type",
    ]);
    // const revealReply =
    //   this.props.comment.replies.length > 0 &&
    //   this.props.comment.replies.length < 5;
    const score = this.props.comment.score;
    this.setState(
      {
        replies: this.props.comment.replies,
        // revealReply,
        selectedVoteType,
        score,
        highlight: this.props.comment.highlight && true,
      },
      () => {
        this.calculateThreadHeight();
        this.props.calculateThreadHeight();
        this.props.comment.highlight &&
          setTimeout(() => {
            this.setState({ highlight: false }, () => {
              this.props.comment.highlight = false;
            });
          }, 10000);
      }
    );
  }

  componentDidUpdate(prevProps) {
    this.calculateThreadHeight();
    this.handleVoteTypeUpdate(prevProps);
  }

  handleVoteTypeUpdate = (prevProps) => {
    const stateToSet = {};

    const nextSelectedVoteType = this.getNextSelectedVoteType(prevProps);
    const nextReplyVoteType = this.getNextReplyVoteType(prevProps);
    const nextReplies = this.getNextReplies();

    if (nextSelectedVoteType !== undefined) {
      // If this component's vote has changed, downstream votes *may* have
      // changed too, so we update the state of the downstream children.
      stateToSet["selectedVoteType"] = nextSelectedVoteType;
      stateToSet["replies"] = nextReplies;
    }
    if (nextReplyVoteType !== undefined) {
      // In this case we *know* the downstream votes have changed.
      stateToSet["replies"] = nextReplies;
    }

    // Update state only if we detect a difference
    if (Object.keys(stateToSet).length > 0) {
      this.setState({
        ...stateToSet,
      });
    }
  };

  getNextSelectedVoteType = (prevProps) => {
    return checkVoteTypeChanged(prevProps.comment, this.props.comment);
  };

  getNextReplyVoteType = (prevProps) => {
    const prevReplies = getNestedValue(prevProps, ["comment", "replies"], []);
    const prevReply = prevReplies[0];
    const nextReplies = this.getNextReplies();
    const nextReply = nextReplies[0];
    return checkVoteTypeChanged(prevReply, nextReply);
  };

  getNextReplies = () => {
    return getNestedValue(this.props, ["comment", "replies"], []);
  };

  calculateThreadHeight = (height) => {
    if (this.commentRef) {
      if (height) {
        return this.setState(
          {
            elementHeight: height,
          },
          () => {
            this.props.calculateThreadHeight &&
              this.props.calculateThreadHeight();
          }
        );
      }
      if (this.commentRef.clientHeight !== this.state.elementHeight) {
        this.setState(
          {
            elementHeight: this.commentRef.clientHeight,
          },
          () => {
            this.props.calculateThreadHeight &&
              this.props.calculateThreadHeight();
          }
        );
      }
    }
  };

  fetchReplies = (e) => {
    e && e.stopPropagation();
    this.setState(
      {
        fetching: true,
      },
      () => {
        let { data, comment } = this.props;
        let discussionThreadId = data.id;
        let commentId = comment.id;
        let paperId = data.paper;
        let page = this.state.page;

        fetch(
          API.THREAD_COMMENT_REPLY(
            paperId,
            discussionThreadId,
            commentId,
            page
          ),
          API.GET_CONFIG()
        )
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res) => {
            this.setState({
              replies: [
                ...this.state.replies,
                ...transformReplies(res.results),
              ],
              page: this.state.page + 1,
              fetching: false,
            });
          })
          .catch((err) => {
            let { setMessage, showMessage } = this.props;
            setMessage("Hm something went wrong");
            showMessage({ show: true, error: true, clickoff: true });
            this.setState({ fetching: false });
          });
      }
    );
  };

  renderViewMore = () => {
    if (this.state.replies.length < this.props.comment.replyCount) {
      let fetching = this.state.fetching;
      let totalCount = this.props.comment.replyCount;
      let currentCount = this.state.replies.length;
      let fetchCount =
        totalCount - currentCount >= 10 ? 10 : totalCount - currentCount;
      return (
        <div className={css(styles.viewMoreContainer)}>
          <div
            className={css(styles.viewMoreButton)}
            onClick={!fetching ? this.fetchReplies : null}
          >
            {fetching ? (
              <span className={css(styles.loadingText)}>loading...</span>
            ) : (
              `View ${fetchCount} More`
            )}
          </div>
        </div>
      );
    }
  };

  upvote = async () => {
    let { data, comment, postUpvote, postUpvotePending } = this.props;
    let discussionThreadId = data.id;
    let paperId = data.paper;
    let commentId = comment.id;

    postUpvotePending();

    await postUpvote(paperId, discussionThreadId, commentId);

    this.updateWidgetUI();
  };

  downvote = async () => {
    let { data, comment, postDownvote, postDownvotePending } = this.props;
    let discussionThreadId = data.id;
    let paperId = data.paper;
    let commentId = comment.id;

    postDownvotePending();

    await postDownvote(paperId, discussionThreadId, commentId);

    this.updateWidgetUI();
  };

  updateWidgetUI = () => {
    let voteResult = this.props.vote;
    const success = voteResult.success;
    const vote = getNestedValue(voteResult, ["vote"], false);

    if (success) {
      const voteType = vote.voteType;
      let score = this.state.score;
      if (voteType === UPVOTE) {
        if (voteType) {
          if (this.state.selectedVoteType === null) {
            score += 1;
          } else {
            score += 2;
          }
        } else {
          score += 1;
        }
        this.setState({
          selectedVoteType: UPVOTE,
          score,
        });
      } else if (voteType === DOWNVOTE) {
        if (voteType) {
          if (this.state.selectedVoteType === null) {
            score -= 1;
          } else {
            score -= 2;
          }
        } else {
          score -= 1;
        }
        this.setState({
          selectedVoteType: DOWNVOTE,
          score,
        });
      }
    }
  };

  submitReply = async (text, plain_text, callback) => {
    let { data, comment, postReply, postReplyPending } = this.props;
    let paperId = data.paper;
    let discussionThreadId = data.id;
    let commentId = comment.id;
    postReplyPending();
    await postReply(paperId, discussionThreadId, commentId, text, plain_text);
    if (this.props.discussion.donePosting && this.props.discussion.success) {
      let newReply = { ...this.props.discussion.postedReply };
      newReply.highlight = true;
      let replies = [newReply, ...this.state.replies];
      this.setState(
        {
          revealReply: true,
          replies,
        },
        () => {
          callback && callback();
        }
      );
    }
  };

  createUsername = ({ createdBy }) => {
    if (createdBy) {
      const { firstName, lastName } = createdBy;
      return `${firstName} ${lastName}`;
    }
    return null;
  };

  formatMetaData = () => {
    let { data, comment } = this.props;
    return {
      threadId: data.id,
      commentId: comment.id,
      paperId: data.paper,
      comment: comment.userFlag,
    };
  };

  handleStateRendering = () => {
    if (this.state.removed) {
      return false;
    }
    if (!this.state.collapsed) {
      return true;
    }
  };

  toggleReplyView = () => {
    this.setState(
      {
        revealReply: !this.state.revealReply,
      },
      () => {
        this.calculateThreadHeight();
      }
    );
  };

  toggleHover = (e) => {
    e && e.stopPropagation();
    this.setState({ hovered: !this.state.hovered });
  };

  toggleCollapsed = (e) => {
    e && e.stopPropagation();
    this.setState({ collapsed: !this.state.collapsed });
  };

  removePostUI = () => {
    this.setState(
      {
        removed: true,
      },
      () => {
        //Todo: clean this part of code, temp use
        this.props.comment.isRemoved = true;
      }
    );
  };

  renderReplies = () => {
    let { data, hostname, path, discussion, comment } = this.props;
    let replies =
      this.state.replies.length < 1
        ? this.props.comment.replies
        : this.state.replies;
    return replies.map((reply, i) => {
      return (
        <ReplyEntry
          data={data}
          hostname={hostname}
          path={path}
          key={`disc${reply.id}-${i}`}
          calculateThreadHeight={this.calculateThreadHeight}
          comment={comment}
          reply={reply}
        />
      );
    });
  };

  render() {
    const {
      data,
      hostname,
      hoverEvents,
      path,
      comment,
      mobileView,
    } = this.props;
    let threadId = comment.id;
    let commentCount =
      this.state.replies.length > comment.replyCount
        ? this.state.replies.length
        : comment.replyCount;

    let date = comment.createdDate;
    let body = comment.text;
    let username = this.createUsername(comment);
    let metaIds = this.formatMetaData();

    return (
      <div
        className={css(styles.row, styles.commentCard)}
        ref={(element) => (this.commentRef = element)}
        onClick={() =>
          this.setState({ elementHeight: this.commentRef.clientHeight })
        }
      >
        <div className={css(styles.column, styles.left)}>
          <VoteWidget
            styles={styles.voteWidget}
            score={this.state.score}
            onUpvote={this.upvote}
            onDownvote={this.downvote}
            selected={this.state.selectedVoteType}
            fontSize={"12px"}
            width={"40px"}
          />
          {!this.state.collapsed && (
            <ThreadLine
              parent={this.commentRef}
              offset={60}
              parentHeight={this.state.elementHeight}
              onClick={this.toggleReplyView}
              hovered={this.state.hovered}
              active={this.state.revealReply}
            />
          )}
        </div>
        <div className={css(styles.column, styles.metaData)}>
          <span
            className={css(
              styles.highlight,
              this.state.highlight && styles.active
            )}
          >
            {!this.state.removed && (
              <div className={css(styles.row, styles.topbar)}>
                <DiscussionPostMetadata
                  authorProfile={getNestedValue(comment, [
                    "createdBy",
                    "authorProfile",
                  ])}
                  username={username}
                  date={date}
                  smaller={true}
                  onHideClick={this.toggleCollapsed}
                  hideState={this.state.collapsed}
                  dropDownEnabled={true}
                  // Moderator
                  metaData={metaIds}
                  onRemove={this.removePostUI}
                />
              </div>
            )}
            {this.handleStateRendering() && (
              <Fragment>
                <div className={css(styles.content)}>
                  <ThreadTextEditor
                    readOnly={true}
                    initialValue={body}
                    body={true}
                  />
                </div>
                <div className={css(styles.row, styles.bottom)}>
                  <ThreadActionBar
                    hostname={hostname}
                    count={commentCount}
                    comment={true}
                    threadHeight={this.state.elementHeight}
                    calculateThreadHeight={this.calculateThreadHeight}
                    onClick={this.toggleReplyView}
                    onSubmit={this.submitReply}
                    small={true}
                    showChildrenState={this.state.revealReply}
                    onCountHover={this.toggleHover}
                    isRemoved={this.state.removed}
                  />
                </div>
              </Fragment>
            )}
            {this.state.removed && (
              <Fragment>
                <div className={css(styles.content)}>
                  <div className={css(styles.removedText)}>
                    Comment Removed By Moderator
                  </div>
                </div>
                <div className={css(styles.row, styles.bottom)}>
                  <ThreadActionBar
                    hostname={hostname}
                    count={commentCount}
                    comment={true}
                    threadHeight={this.state.elementHeight}
                    calculateThreadHeight={this.calculateThreadHeight}
                    onClick={this.toggleReplyView}
                    onSubmit={this.submitReply}
                    small={true}
                    showChildrenState={this.state.revealReply}
                    onCountHover={this.toggleHover}
                    isRemoved={this.state.removed}
                  />
                </div>
              </Fragment>
            )}
          </span>
          {!this.state.collapsed &&
            (this.state.revealReply && (
              <Fragment>
                {this.renderReplies()}
                {this.renderViewMore()}
              </Fragment>
            ))}
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
  },
  left: {
    alignItems: "center",
    width: 44,
  },
  commentCard: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    marginBottom: 5,
    overflow: "visible",
  },
  topbar: {
    width: "100%",
    margin: "15px 0px 5px 0",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  content: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    overflowWrap: "break-word",
    lineHeight: 1.6,
  },
  metaData: {
    width: "calc(100% - 44px)",
  },
  highlight: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 5,
    padding: "0px 10px 10px 8px",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  active: {
    backgroundColor: colors.LIGHT_YELLOW(),
    ":hover": {
      backgroundColor: colors.LIGHT_YELLOW(),
    },
  },
  bottom: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    margin: 0,
    padding: 0,
    fontSize: 20,
  },
  body: {
    margin: 0,
  },
  replyContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: "100%",
  },
  voteWidget: {
    margin: 0,
    backgroundColor: "#FFF",
  },
  viewMoreContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 8,
    marginLeft: 20,
  },
  viewMoreButton: {
    fontSize: 13,
    fontWeight: 400,
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  loadingText: {
    color: colors.BLUE(),
  },
  removedText: {
    fontStyle: "italic",
    fontSize: 13,
  },
});

const mapStateToProps = (state) => ({
  discussion: state.discussion,
  vote: state.vote,
});

const mapDispatchToProps = {
  postReply: DiscussionActions.postReply,
  postReplyPending: DiscussionActions.postReplyPending,
  postUpvotePending: DiscussionActions.postUpvotePending,
  postUpvote: DiscussionActions.postUpvote,
  postDownvotePending: DiscussionActions.postDownvotePending,
  postDownvote: DiscussionActions.postDownvote,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentEntry);

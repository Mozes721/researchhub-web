import * as actions from "./actions";
import * as shims from "./shims";
import API from "~/config/api";
import * as utils from "../utils";

export function fetchThread(paperId, threadId) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD(paperId, threadId),
      API.GET_CONFIG()
    ).catch(utils.handleCatch);

    let action = actions.setThreadFailure();

    if (response.ok) {
      const body = await response.json();
      const thread = shims.thread(body);
      action = actions.setThread(thread);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

export function updateThread(paperId, threadId, body) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD(paperId, threadId),
      API.PATCH_CONFIG(body)
    ).catch(utils.handleCatch);

    let action = actions.setUpdateThreadFailure();

    if (response.ok) {
      const body = await response.json();
      const thread = shims.thread(body);
      action = actions.setUpdateThread(thread);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

export function fetchComments(paperId, threadId, page) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD_COMMENT(paperId, threadId, page),
      API.GET_CONFIG()
    ).catch(utils.handleCatch);

    let action = actions.setCommentsFailure();

    if (response.ok) {
      const body = await response.json();
      const comments = shims.comments(body);
      comments.page = page;
      action = actions.setComments(comments);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

export function postComment(paperId, threadId, text, plain_text) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD_COMMENT(paperId, threadId),
      API.POST_CONFIG({
        text,
        parent: threadId,
        plain_text,
      })
    ).catch(utils.handleCatch);

    let action = actions.setPostCommentFailure();

    if (response.ok) {
      const body = await response.json();
      const comment = shims.comment(body);
      action = actions.setPostCommentSuccess(comment);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

export function updateComment(paperId, threadId, commentId, text, plain_text) {
  return async (dispatch) => {
    const response = await fetch(
      API.PAPER_CHAIN(paperId, threadId, commentId),
      API.PATCH_CONFIG({ text, plain_text })
    ).catch(utils.handleCatch);

    let action = actions.setUpdateCommentFailure();

    if (response.ok) {
      const body = await response.json();
      const comment = shims.comment(body);
      action = actions.setUpdateComment(comment);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

export function fetchReplies(paperId, threadId, commentId, page) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD_COMMENT_REPLY(paperId, threadId, commentId, page),
      API.GET_CONFIG()
    ).catch(utils.handleCatch);

    let action = actions.setRepliesFailure();

    if (response.ok) {
      const body = await response.json();
      const replies = shims.replies(body);
      replies.page = page;
      action = actions.setReplies(replie);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

export function postReply(paperId, threadId, commentId, text, plain_text) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD_COMMENT_REPLY(paperId, threadId, commentId),
      API.POST_CONFIG({
        text,
        parent: commentId,
        plain_text,
      })
    ).catch(utils.handleCatch);

    let action = actions.setPostReplyFailure();

    if (response.ok) {
      const body = await response.json();
      const reply = shims.reply(body);
      action = actions.setPostReplySuccess(reply);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

export function updateReply(
  paperId,
  threadId,
  commentId,
  replyId,
  text,
  plain_text
) {
  return async (dispatch) => {
    const response = await fetch(
      API.PAPER_CHAIN(paperId, threadId, commentId, replyId),
      API.PATCH_CONFIG({ text, plain_text })
    ).catch(utils.handleCatch);

    let action = actions.setUpdateReplyFailure();

    if (response.ok) {
      const body = await response.json();
      const reply = shims.reply(body);
      action = actions.setUpdateReply(reply);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

export function postUpvote(paperId, threadId, commentId, replyId) {
  const isUpvote = true;

  return async (dispatch) => {
    const response = await fetch(
      API.UPVOTE(paperId, threadId, commentId, replyId),
      API.POST_CONFIG()
    ).catch(utils.handleCatch);

    let action = actions.setPostVoteFailure(isUpvote);

    if (response.ok) {
      const body = await response.json();
      const vote = shims.vote(body);
      action = actions.setPostVoteSuccess(vote);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

export function postDownvote(paperId, threadId, commentId, replyId) {
  const isUpvote = false;

  return async (dispatch) => {
    const response = await fetch(
      API.DOWNVOTE(paperId, threadId, commentId, replyId),
      API.POST_CONFIG()
    ).catch(utils.handleCatch);

    let action = actions.setPostVoteFailure(isUpvote);

    if (response.ok) {
      const body = await response.json();
      const vote = shims.vote(body);
      action = actions.setPostVoteSuccess(vote);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

const DiscussionActions = {
  fetchThread,
  fetchThreadPending: actions.setThreadPending,
  updateThread,
  updateThreadPending: actions.setUpdateThreadPending,
  fetchComments,
  fetchCommentsPending: actions.setCommentsPending,
  postComment,
  postCommentPending: actions.setPostCommentPending,
  updateComment,
  updateCommentPending: actions.setUpdateCommentPending,
  fetchReplies,
  fetchRepliesPending: actions.setRepliesPending,
  postReply,
  postReplyPending: actions.setPostReplyPending,
  updateReply,
  updateReplyPending: actions.setUpdateReplyPending,
  postUpvote,
  postUpvotePending: () => actions.setPostVotePending(true),
  postDownvote,
  postDownvotePending: () => actions.setPostVotePending(false),
};

export default DiscussionActions;

import * as actions from "./actions";
import * as shims from "./shims";
import API from "~/config/api";
import * as utils from "../utils";
import { ModalActions } from "~/redux/modals";

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
      action = actions.setPostVoteSuccess(isUpvote, vote);
    } else {
      utils.logFetchError(response);
    }

    // const store = useStore();
    // console.log("store", store.getState().auth.user.has_seen_first_vote_modal)
    // if (!store.getState().auth.user.has_seen_first_vote_modal) {
    //   console.log('called')
    // dispatch(ModalActions.openFirstVoteModal(true))
    // }

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
      action = actions.setPostVoteSuccess(isUpvote, vote);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

const VoteActions = {
  postUpvote,
  postUpvotePending: () => actions.setPostVotePending(true),
  postDownvote,
  postDownvotePending: () => actions.setPostVotePending(false),
};

export default VoteActions;

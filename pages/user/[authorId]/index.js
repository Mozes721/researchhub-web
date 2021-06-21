import Router from "next/router";
import killswitch from "~/config/killswitch/killswitch";
import { redirect } from "~/config/utils";

const isServer = () => typeof window === "undefined";

function AuthorPageRedirect(props) {
  // TODO: Does this need to be a dynamic route or hard refresh?
  Router.push(props.redirectPath);
  return null;
}

AuthorPageRedirect.getInitialProps = async (ctx) => {
  let { query, store } = ctx;
  if (!isServer()) {
    let authorProfile = store.getState().auth.user.author_profile;
    let redirectTab = killswitch("newPostTypes") ? "posts" : "discussions";
    return { redirectPath: `${authorProfile.id}/${redirectTab}` };
  } else {
    let redirectPath = "contributions";
    redirect(ctx, "authorId", redirectPath);
    return { redirectPath };
  }
};

export default AuthorPageRedirect;

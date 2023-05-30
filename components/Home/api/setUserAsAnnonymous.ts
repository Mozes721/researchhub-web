import { buildApiUri } from "~/config/utils/buildApiUri";
import { Helpers } from "@quantfive/js-web-config";
import { setUserAsN } from "./api/setU";
import API from "~/config/api";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";

type Args = {
  id: string;
  // eslint-disable-next-line no-unused-vars
  onError: (error: Error) => void;
};

export function toggleUserAsAnnonymous({ onError, id}: Args): void {
  fetch(
    buildApiUri({
      apiPath: `annonymize/${id}/`,
    }),
    API.POST_CONFIG({})
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .catch((error: any): void => {
      onError(error);
    });
}
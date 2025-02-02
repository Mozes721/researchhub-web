import { createContext } from "react";
import { filterOpts, sortOpts } from "./options";
import { Comment } from "./types";

type CommentTreeContext = {
  sort: string | null;
  filter: string | null;
  context: "sidebar" | "drawer" | null;
  onCreate: Function;
  onUpdate: Function;
  onRemove: Function;
  onFetchMore: Function;
  comments: Comment[];
};

export const CommentTreeContext = createContext<CommentTreeContext>({
  sort: sortOpts[0].value,
  filter: filterOpts[0].value,
  comments: [],
  context: null,
  // These functions are defined in the component the context is used.
  // they will receive their value in there since their definition depends on state.
  onCreate: () => null,
  onRemove: () => null,
  onUpdate: () => null,
  onFetchMore: () => null,
});

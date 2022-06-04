import { FLAG_REASON } from "~/components/Flag/config/constants"
import { parseContentType, ContentType } from "./contentType"
import { parseHub, Hub } from "./hub"
import { AuthorProfile, CreatedBy, ID, KeyOf, parseAuthorProfile, parseUnifiedDocument, UnifiedDocument } from "./root_types"


export type CommentContributionItem = {
  unifiedDocument: UnifiedDocument,
  plainText: string,
  createdBy: CreatedBy | null,
  createdDate: string,
  id: ID,
}

export type PaperContributionItem = {
  unifiedDocument: UnifiedDocument,
  title: string,
  slug: string,
  createdBy: CreatedBy | null,
  createdDate: string,
  id: ID,
}

export type HypothesisContributionItem = {
  unifiedDocument: UnifiedDocument,
  title: string,
  slug: string,
  createdBy: CreatedBy | null,
  createdDate: string,
  id: ID,
}

export type PostContributionItem = {
  unifiedDocument: UnifiedDocument,
  title: string,
  slug: string,
  createdBy: CreatedBy | null,
  createdDate: string,
  id: ID,
}
export type FlaggedBy = {
  firstName: string,
  lastName: string,
  id: ID,
  authorProfile: AuthorProfile,
}

export type Verdict = {
  createdBy: CreatedBy | null,
  verdictChoice: string,
  createdDate: string,
}

export type Contribution = {
  item: PaperContributionItem | PostContributionItem | HypothesisContributionItem | CommentContributionItem,
  createdDate: Date,
  contentType: ContentType,
  flaggedBy?: FlaggedBy | null,
  verdict?: Verdict,
  reason?: string,  
  reasonChoice?: KeyOf<typeof FLAG_REASON>,
  id?: ID,
  hubs: Array<Hub>,
}

export const parseCreatedBy = (raw: any): CreatedBy | null => {

  if (!raw || !raw?.author_profile) {
    return null;
  }

  if (raw.first_name && !raw.author_profile.first_name) {
    raw.author_profile.first_name = raw.first_name;
  }
  if (raw.last_name && !raw.author_profile.last_name) {
    raw.author_profile.last_name = raw.last_name;
  } 

  const mapped = {
    "id": raw.id,
    "firstName": raw.first_name,
    "lastName": raw.last_name,
    "authorProfile": parseAuthorProfile(raw.author_profile)
  }
  
  return mapped;
}

export const parseVerdict = (raw: any): Verdict => {

  const mapped = {
    "verdictChoice": raw.verdict_choice,
    "createdBy": parseCreatedBy(raw.created_by),
    "createdDate": raw.created_date,
  }

  return mapped;
}

export const parseFlaggedBy = (raw: any): FlaggedBy | null => {
  return parseCreatedBy(raw);
}

export const parseContribution = (raw: any): Contribution => {
  let mapped = {
    "createdDate": raw.created_date,
    "contentType": parseContentType(raw.content_type),
    "id": raw.id,
    "hubs": raw.hubs.map(h => parseHub(h)),
  }

  if (["thread", "comment", "reply"].includes(raw.content_type.name)) {
    mapped["item"] = parseCommentContributionItem(raw.item);
  }
  else if (raw.content_type.name === "paper") {
    mapped["item"] = parsePaperContributionItem(raw.item);
  }
  else if (raw.content_type.name === "researchhubpost") {
    mapped["item"] = parsePostContributionItem(raw.item);
  }
  else if (raw.content_type.name === "hypothesis") {
    mapped["item"] = parseHypothesisContributionItem(raw.item);
  }
  else {
    throw Error("Could not parse object with content_type=" + raw.content_type.name)
  }

  if (raw.flagged_by) {
    mapped["flaggedBy"] = parseFlaggedBy(raw.flagged_by);
  }
  if (raw.verdict) {
    mapped["verdict"] = parseVerdict(raw.verdict);
  }
  if (raw.reason) {
    mapped["reason"] = raw.reason;
  }
  if (raw.reason_choice) {
    mapped["reasonChoice"] = raw.reason_choice;
  }      

  /* @ts-ignore */
  return mapped;
}

export const parseCommentContributionItem = (raw: any): CommentContributionItem => {
  const mapped = {
    "plainText": raw.plain_text,
    "createdBy": parseCreatedBy(raw.created_by),
    "unifiedDocument": parseUnifiedDocument(raw.unified_document),
    "id": raw.id,
    "createdDate": raw.created_date,
  }

  return mapped;
}

export const parsePaperContributionItem = (raw: any): PaperContributionItem => {
  
  raw.unified_document.documents = {
    "id": raw.id,
    "title": raw.title,
    "slug": raw.slug,
  }

  const mapped = {
    "id": raw.id,
    "title": raw.title,
    "slug": raw.slug,
    "createdBy": parseCreatedBy(raw.uploaded_by),
    "unifiedDocument": parseUnifiedDocument(raw.unified_document),
    "createdDate": raw.created_date,
  }

  return mapped;
}

export const parseHypothesisContributionItem = (raw: any): HypothesisContributionItem => {
  const mapped = {
    "title": raw.title,
    "slug": raw.slug,
    "createdBy": parseCreatedBy(raw.created_by),
    "unifiedDocument": parseUnifiedDocument(raw.unified_document),
    "id": raw.id,
    "createdDate": raw.created_date,
  }

  return mapped;
}

export const parsePostContributionItem = (raw: any): PostContributionItem => {
  const mapped = {
    "title": raw.title, 
    "slug": raw.slug,
    "createdBy": parseCreatedBy(raw.created_by),
    "unifiedDocument": parseUnifiedDocument(raw.unified_document),
    "id": raw.id,
    "createdDate": raw.created_date,
  }

  return mapped;
}


import type {RequestPayload} from './workspace';

export type RequestReview = {key:string; payload:RequestPayload; approved:boolean};

export function createRequestReview(key:string,payload:RequestPayload):RequestReview {
  return {key,payload:structuredClone(payload),approved:false};
}

export function hasReviewApproval(review:RequestReview|null,key:string):review is RequestReview {
  return !!review && review.key===key && review.approved===true;
}

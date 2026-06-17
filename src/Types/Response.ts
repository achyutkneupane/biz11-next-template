export interface PaginationMeta {
  nextCursor: string | null;
  prevCursor: string | null;
  perPage: number;
  hasMore: boolean;
}

export interface DataResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
}

export interface PaginationMeta {
  nextCursor: string | null;
  prevCursor: string | null;
  perPage: number;
  hasMore: boolean;
  total?: number;
}

export interface OrdersMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
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
  errors?: Record<string, string[]>;
}

export interface ServiceResult<T = unknown | null> {
  data: T;
  error: unknown | null;
}

const emptyArray = [] as const;

export function usePaginatedResult<T>(
  result: T[] | undefined,
  currentPage: number,
  pageSize = 10
) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const defaultResult = result ?? emptyArray;

  return {
    paginatedResult: defaultResult.slice(startIndex, endIndex),
  };
}

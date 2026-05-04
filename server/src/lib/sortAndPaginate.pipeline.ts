/**
 * Build $sort + $skip + $limit stages for an aggregation pipeline.
 *
 * Query params:
 *  - page (default 1)
 *  - limit (default 10)
 *  - sortBy: field name to sort by (defaults to createdAt). Whitelisted by caller.
 *  - sortOrder: 'asc' | 'desc' (default desc)
 *
 * `allowedSortFields` is a whitelist. If `sortBy` isn't in it, we fall back to
 * `createdAt` to prevent injection of arbitrary field names.
 */
const sortAndPaginatePipeline = (
  query: Record<string, unknown>,
  allowedSortFields: string[] = ['createdAt']
) => {
  let page = 1;
  let limit = 10;
  let sortBy = 'createdAt';
  let sortOrder: -1 | 1 = -1;

  if (query.limit) {
    limit = Number(query.limit);
  }

  if (query.page) {
    page = Number(query.page);
  }

  if (typeof query.sortBy === 'string' && allowedSortFields.includes(query.sortBy)) {
    sortBy = query.sortBy;
  }

  if (query.sortOrder) {
    sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  }

  return [
    {
      $sort: {
        [sortBy]: sortOrder
      }
    },
    {
      $skip: limit * (page - 1)
    },
    {
      $limit: limit
    }
  ];
};

export default sortAndPaginatePipeline;

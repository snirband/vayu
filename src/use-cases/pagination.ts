import { DbService } from '../db/db.service';

export async function getDataPaginated(
  tableName: string,
  page: number = 1,
  limit: number = 10
) {
  const offset = (page - 1) * limit;

  const dbService = DbService.getInstance();

  const { data, countResult } = await dbService.getDataFromDb(
    tableName,
    limit,
    offset
  );

  const total =
    countResult && countResult[0] && 'total' in countResult[0]
      ? Number((countResult[0] as { total: number | string }).total)
      : 0;

  return {
    data,
    pagination: {
      page,
      total: total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

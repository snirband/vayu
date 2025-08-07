import { DbService } from '../db/db.service';
import { updatedUser } from '../models/user-models';

export const updateMultipleUsersStatuses = async (users: updatedUser[]) => {
  const dbService = DbService.getInstance();

  try {
    await dbService.updateMultipleUsersStatuses(users);
    return { message: 'Users updated successfully' };
  } catch (error: any) {
    throw new Error(`Failed to update users: ${error.message}`);
  }
};

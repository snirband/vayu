import { DbService } from '../db/db.service';
import { updatedUser, UserStatus } from '../models/user';

export const updateMultipleUsersStatuses = async (users: updatedUser[]) => {
  const dbService = DbService.getInstance();

  try {
    await dbService.updateMultipleUsersStatuses(users);
    return { message: 'Users updated successfully' };
  } catch (error: any) {
    console.error(`Error updating users: ${error}`);
    throw new Error(`Failed to update users: ${error.message}`);
  }
};

import { Knex } from 'knex';
import { db } from './db';
import { updatedUser, UserStatus } from '../models/user';

export class DbService {
  private static instance: DbService;
  private constructor(private readonly db: Knex) {}

  static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService(db);
    }
    return DbService.instance;
  }

  async getDataFromDb(tableName: string, limit: number, offset: number) {
    const [data, countResult] = await Promise.all([
      this.db(tableName).select('*').limit(limit).offset(offset),
      this.db(tableName).count('* as total'),
    ]);

    return {
      data,
      countResult,
    };
  }

  async removeUserFromGroup(userId: number): Promise<void> {
    try {
      await this.db.transaction(async trx => {
        const user = await trx('user_groups')
          .select('group_id')
          .where({ user_id: userId })
          .first();

        if (!user) {
          throw new Error(`User ${userId} is not in any group.`);
        }

        const groupId = user.group_id;

        await trx('user_groups')
          .where({ user_id: userId, group_id: groupId })
          .del();

        const countResult = await trx('user_groups')
          .where({ group_id: groupId })
          .count<[{ count: number }]>('user_id as count');

        const userCount = Number(countResult[0]?.count);

        await trx('groups')
          .where({ id: groupId })
          .update({ status: userCount === 0 ? 'empty' : 'notEmpty' });
      });
    } catch (error) {
      console.error(`Error removing user from group: ${error}`);
      throw new Error(`Failed to remove user from group: ${error}`);
    }
  }

  async updateMultipleUsersStatuses(users: updatedUser[]): Promise<void> {
    try {
      await db.transaction(async trx => {
        const updatePromises = users.map(({ id, status }) =>
          trx('users').where({ id }).update({ status })
        );

        console.log(`Updating statuses for ${updatePromises} users...`);
        await Promise.all(updatePromises);
      });
    } catch (error: any) {
      console.error(`Error updating users: ${error}`);
      throw new Error(`Failed to update users: ${error.message}`);
    }
  }
}

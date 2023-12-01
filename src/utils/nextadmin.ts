import { NextAdminOptions } from '@premieroctet/next-admin';

export const options: NextAdminOptions = {
  basePath: '/admin',
  model: {
    User: {
      toString: (user) => user.email ?? user.id,
      list: {
        display: ['id', 'email', 'name', 'role', 'createdAt'],
        search: ['email', 'name'],
      },
    },
    Team: {
      list: {
        display: ['id', 'name', 'memberships', 'createdAt'],
        search: ['name'],
      },
    },
    Link: {
      list: {
        display: ['id', 'title', 'description', 'url'],
        search: ['url'],
      },
    },
    Digest: {
      list: {
        display: ['id', 'title', 'description', 'isFeatured', 'createdAt'],
      },
    },
  },
};

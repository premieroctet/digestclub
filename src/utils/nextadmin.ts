import { NextAdminOptions } from '@premieroctet/next-admin';

export const options: NextAdminOptions = {
  basePath: '/admin',
  model: {
    User: {
      toString: (user) => user.email ?? user.id,
      list: {
        display: ['id', 'email', 'name', 'role', 'createdAt'],
        search: ['id', 'email', 'name'],
        fields: {
          createdAt: {
            formatter: (date) => new Date(date).toLocaleString('fr'),
          },
        }
      },
      edit: {
        display: ['id', 'createdAt', 'email', 'name', 'emailVerified', 'accounts', 'role', 'defaultTeam'],
        fields: {
          defaultTeam: {
            optionFormatter: (team) => team?.name!
          },
        },
      },
    },
    Team: {
      list: {
        display: ['id', 'name', 'memberships', 'createdAt'],
        search: ['name'],
        fields: {
          createdAt: {
            formatter: (date) => new Date(date).toLocaleString('fr'),
          }
        }
      },
      edit: {
        fields: {
          memberships: {
            optionFormatter: (membership) => `User ${membership?.userId?.slice(0, 5)}...`
          },
          bookmarks: {
            optionFormatter: (bookmark) => `Bookmark ${bookmark?.id?.slice(0, 5)}...`
          },
          color: {
            format: 'color'
          }
        }
      },
    },
    Link: {
      list: {
        display: ['id', 'title', 'description', 'url'],
        search: ['url'],
      },
      edit: {
        fields: {
          url: {
            format: 'uri'
          },
          bookmark: {
            optionFormatter: (bookmark) => `Bookmark ${bookmark?.id?.slice(0, 5)}...`
          },
        }
      },
    },
    Digest: {
      toString: (digest) => digest.title ?? digest.id,
      list: {
        display: ['id', 'title', 'description', 'isFeatured', 'createdAt'],
        fields: {
          createdAt: {
            formatter: (date) => new Date(date).toLocaleString('fr'),
          }
        }
      },
      edit: {
        fields: {
          team: {
            optionFormatter: (team) => team?.name!
          },
        }
      }
    },
  },
};

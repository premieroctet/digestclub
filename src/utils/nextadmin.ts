import { NextAdminOptions } from '@premieroctet/next-admin';

export const options: NextAdminOptions = {
  basePath: '/admin',
  title: 'Digest.club Admin',
  model: {
    User: {
      aliases: {
        emailVerified: 'Email verified date',
        defaultTeam: 'Default team',
      },
      icon: 'UserIcon',
      toString: (user) => user.email ?? user.id,
      list: {
        display: ['id', 'email', 'name', 'role', 'createdAt'],
        search: ['id', 'email', 'name'],
        fields: {
          createdAt: {
            formatter: (date) => new Date(date).toLocaleString('fr'),
          },
        },
      },
      edit: {
        display: [
          'id',
          'createdAt',
          'email',
          'name',
          'emailVerified',
          'accounts',
          'role',
          'defaultTeam',
        ],
        fields: {
          defaultTeam: {
            optionFormatter: (team) => team?.name!,
          },
        },
      },
    },
    Team: {
      aliases: {
        bookmarks: 'Links',
        createdAt: 'Created at',
        slackToken: 'Slack token',
        slackTeamId: 'Slack team',
        typefullyToken: 'Typefully token',
        apiKey: 'API key',
        nextSuggestedDigestTitle: 'Next suggested digest title',
        subscriptionId: 'Subscription',
      },
      icon: 'UserGroupIcon',
      list: {
        display: ['id', 'name', 'memberships', 'createdAt'],
        search: ['name'],
        fields: {
          createdAt: {
            formatter: (date) => new Date(date).toLocaleString('fr'),
          },
        },
      },
      edit: {
        fields: {
          memberships: {
            optionFormatter: (membership) =>
              membership?.user?.email ??
              `User ${membership?.user?.id?.slice(0, 5)}...`,
          },
          bookmarks: {
            optionFormatter: (bookmark) =>
              bookmark.link.title ?? `Bookmark ${bookmark?.id?.slice(0, 5)}...`,
          },
          color: {
            format: 'color',
          },
          apiKey: {
            format: 'password',
          },
        },
      },
    },
    Link: {
      aliases: {
        bookmark: 'Teams',
      },
      icon: 'LinkIcon',
      list: {
        display: ['id', 'title', 'description', 'url'],
        search: ['url'],
      },
      edit: {
        fields: {
          url: {
            format: 'uri',
          },
          bookmark: {
            optionFormatter: (bookmark) =>
              bookmark.team.name ?? `Bookmark ${bookmark?.id?.slice(0, 5)}...`,
          },
        },
      },
    },
    Digest: {
      toString: (digest) => digest.title ?? digest.id,
      icon: 'NewspaperIcon',
      list: {
        display: ['id', 'title', 'description', 'isFeatured', 'createdAt'],
        fields: {
          createdAt: {
            formatter: (date) => new Date(date).toLocaleString('fr'),
          },
        },
      },
      edit: {
        fields: {
          team: {
            optionFormatter: (team) => team?.name!,
          },
          digestBlocks: {
            optionFormatter: (digestBlock) =>
              digestBlock.title ??
              `DigestBlock ${digestBlock?.id?.slice(0, 5)}...`,
          },
        },
      },
    },
  },
  externalLinks: [
    {
      label: 'Digest.club',
      url: 'https://digest.club',
    },
  ],
};

import { NextAdminOptions } from '@premieroctet/next-admin';

export const options: NextAdminOptions = {
  title: 'Digest.club Admin',
  model: {
    User: {
      aliases: {
        emailVerified: 'Email verified date',
        defaultTeam: 'Default team',
        createdAt: 'Created at',
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
          'name',
          'email',
          'emailVerified',
          'role',
          'accounts',
          'defaultTeam',
        ],
        styles: {
          _form: 'grid-cols-3 gap-6',
          id: 'col-span-2',
          createdAt: 'col-span-1',
          name: 'col-span-2',
          email: 'row-start-3 col-span-2',
          emailVerified: 'row-start-3 col-span-1',
          role: 'col-span-2',
          accounts: 'col-span-2',
          defaultTeam: 'col-span-2',
        },
        fields: {
          createdAt: {
            format: 'date-time',
          },
          emailVerified: {
            format: 'date-time',
          },
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
        display: [
          'id',
          'createdAt',
          'name',
          'slug',
          'color',
          'bio',
          'memberships',
          'subscriptions',
          'users',
          'Digest',
          'bookmarks',
          'slackTeamId',
          'slackToken',
          'typefullyToken',
          'nextSuggestedDigestTitle',
          'apiKey',
          'prompt',
        ],
        styles: {
          _form: 'grid-cols-3 gap-6',
          id: 'col-span-2',
          name: 'col-span-2',
          slug: 'col-span-1 row-start-3',
          color: 'col-span-1 row-start-3',
          memberships: 'col-span-2',
          subscriptions: 'col-span-2',
          users: 'col-span-2',
          Digest: 'col-span-3',
          bookmarks: 'col-span-2',
          slackToken: 'col-span-1',
          slackTeamId: 'col-span-2',
          typefullyToken: 'col-span-2',
          bio: 'col-span-3',
          apiKey: 'col-span-2',
          nextSuggestedDigestTitle: 'col-span-2',
          prompt: 'col-span-3',
        },
        fields: {
          memberships: {
            display: 'list',
            optionFormatter: (membership) =>
              membership?.user?.email ??
              `User ${membership?.user?.id?.slice(0, 5)}...`,
          },
          bookmarks: {
            display: 'list',
            optionFormatter: (bookmark) =>
              bookmark.link.title ?? `Bookmark ${bookmark?.id?.slice(0, 5)}...`,
          },
          color: {
            format: 'color',
          },
          Digest: {
            display: 'table',
          },
          apiKey: {
            format: 'password',
          },
          users: {
            display: 'list',
          },
          createdAt: {
            format: 'date-time',
          },
          bio: {
            format: 'textarea',
          },
          prompt: {
            format: 'textarea',
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
        styles: {
          _form: 'grid-cols-3 gap-6',
          id: 'col-span-2',
          title: 'row-start-2 col-span-2',
          description: 'row-start-3 col-span-3',
          createdAt: 'row-start-1 col-start-3 col-span-1',
          url: 'col-span-2',
          image: 'col-span-2',
          bookmark: 'row-start-8 col-span-2',
          blurHash: 'col-span-3',
          logo: 'row-start-6 col-start-3 col-span-1',
          tags: 'row-start-4 col-span-2',
          updatedAt: 'row-start-9 col-span-1',
        },
        fields: {
          url: {
            format: 'uri',
          },
          description: {
            format: 'textarea',
          },
          createdAt: {
            format: 'date-time',
          },
          blurHash: {
            format: 'textarea',
          },
          bookmark: {
            display: 'list',
            optionFormatter: (bookmark) =>
              bookmark.team.name ?? `Bookmark ${bookmark?.id?.slice(0, 5)}...`,
          },
        },
      },
    },
    Digest: {
      toString: (digest) => digest.title ?? digest.id,
      aliases: {
        isFeatured: 'Featured',
        createdAt: 'Created at',
        isTemplate: 'Template',
        hasSentNewsletter: 'Sent newsletter',
      },
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
        styles: {
          _form: 'grid-cols-3 gap-6',
          id: 'col-span-2',
          createdAt: 'row-start-1 col-start-3 col-span-1',
          publishedAt: 'row-start-2 col-start-3 col-span-1',
          title: 'row-start-2 col-span-2',
          slug: 'row-start-3 col-span-2',
          description: 'row-start-4 col-span-3',
          team: 'row-start-5 col-span-2',
          digestBlocks: 'row-start-6 col-span-2',
          hasSentNewsletter: 'row-start-7 col-span-1',
          isFeatured: 'row-start-7 col-start-2 col-span-1',
          isTemplate: 'row-start-7 col-start-3 col-span-1',
          typefullyThreadUrl: 'row-start-8 col-span-2',
          views: 'row-start-9 col-span-1',
          updatedAt: 'row-start-10 col-span-1',
        },
        fields: {
          team: {
            optionFormatter: (team) => team?.name!,
          },
          description: {
            format: 'textarea',
          },
          createdAt: {
            format: 'date-time',
          },
          views: {
            handler: {
              get: (views) => views ?? 0,
            },
          },
          digestBlocks: {
            display: 'list',
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

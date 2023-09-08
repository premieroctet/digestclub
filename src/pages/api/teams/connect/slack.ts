import db from '@/lib/db';
import { checkAuth, checkTeam } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import axios from 'axios';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router
  .use(checkTeam)
  .get(async (req, res) => {
    const code = req.query.code as string;

    if (!code) {
      return res.status(403).end();
    }

    const payload = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXTAUTH_URL!}/api/teams/connect/slack`,
      code,
    }).toString();

    const { data } = await axios.post(
      `https://slack.com/api/oauth.v2.access`,
      payload,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (data.ok) {
      const { access_token: slackToken, team: slackTeam } = data;
      const teams = await db.team.findMany({
        where: { slackTeamId: slackTeam.id },
      });

      if (teams.length > 0) {
        const team = await db.team.findUnique({
          where: { id: req.teamId },
        });

        return res
          .status(302)
          .redirect(
            `/teams/${team!.slug}/settings?error=slack_team_already_connected`
          );
      }

      const team = await db.team.update({
        where: { id: req.teamId },
        data: {
          slackTeamId: slackTeam.id,
          slackToken,
        },
      });

      return res.status(302).redirect(`/teams/${team.slug}/settings`);
    }

    return res.status(400).json({ error: true });
  })
  .delete(async (req, res) => {
    const team = await db.team.update({
      where: { id: req.teamId },
      data: {
        slackTeamId: null,
        slackToken: null,
      },
    });

    return res.status(200).json({ team });
  });

export default router.handler({});

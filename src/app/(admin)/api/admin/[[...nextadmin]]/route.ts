import client from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { options } from '@/utils/nextadmin';
import { createHandler } from '@premieroctet/next-admin/appHandler';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const { run } = createHandler({
  apiBasePath: '/api/admin',
  prisma: client,
  options,
  onRequest: async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'SUPERADMIN';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  },
});

export { run as DELETE, run as GET, run as POST };

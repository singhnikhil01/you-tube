import { DEFAULT_LIMIT } from "@/constants";
import UserView from "@/modules/users/ui/views/user-view";
import { trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    userid: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { userid } = await params;

  void trpc.users.getOne.prefetch({ id: userid });
  void trpc.videos.getMany.prefetchInfinite({
    userId: userid,
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <UserView userId={userid} />
    </HydrateClient>
  );
};

export default Page;

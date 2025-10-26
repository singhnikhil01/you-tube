import { DEFAULT_LIMIT } from "@/constants";
import UserView from "@/modules/users/ui/views/user-view";
import { trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;
  void trpc.users.getOne.prefetch({ id: userId });
  void trpc.videos.getMany.prefetchInfinite({
    userId: userId,
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
};

export default Page;

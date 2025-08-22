import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-3 justify-center items-center h-screen">
      <div className="loader"></div>
    </div>
  );
}

import { AdminCourseType } from "@/app/data/admin-get-courses";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRightIcon,
  EyeIcon,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";

interface iAppProps {
  data: AdminCourseType;
}

export function AdminCourseCard({ data }: iAppProps) {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="hover:bg-muted transition-colors"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/courses/${data.id}/edit`}
                className="flex items-center gap-2"
              >
                <Pencil className="size-4" />
                Edit Topic
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/courses/${data.slug}`}
                className="flex items-center gap-2"
              >
                <EyeIcon className="size-4" />
                Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`admin/courses/${data.id}/delete`}
                className="flex items-center gap-2"
              >
                <Trash2 className="size-4 text-destructive" />
                Delete Topic
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={data.fileKey}
        alt="Thumbnail Url"
        width={600}
        height={400}
        className="w-full rounded-t-lg aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.smallDescription}
        </p>

        <Link
          href={`/admin/courses/${data.id}/edit`}
          className={buttonVariants({
            className: "w-full flex items-center justify-center gap-2 mt-4",
          })}
        >
          Edit Topic <ArrowRightIcon className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

/* eslint-disable @next/next/no-img-element */

import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import DesktopSidebar from "./DesktopSidebar";
import { ChangelogItem, NavigationItem } from "./types";

import {
  ArchiveIcon,
  BellIcon,
  ChartLineIcon,
  DatabaseIcon,
  FlaskConicalIcon,
  Home,
  ListTreeIcon,
  LockIcon,
  ScrollTextIcon,
  SheetIcon,
  ShieldCheckIcon,
  TagIcon,
  TestTube2,
  UsersIcon,
  Webhook,
} from "lucide-react";
import { useOrg } from "../org/organizationContext";

interface SidebarProps {
  setOpen: (open: boolean) => void;
  changelog: ChangelogItem[];
  sidebarRef: React.RefObject<HTMLDivElement>;
}

const Sidebar = ({ changelog, setOpen, sidebarRef }: SidebarProps) => {
  const router = useRouter();
  const { pathname } = router;
  const user = useUser();
  const org = useOrg();
  const NAVIGATION: NavigationItem[] = useMemo(
    () => [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
        current: pathname.includes("/dashboard"),
      },
      {
        name: "Requests",
        href: "/requests",
        icon: SheetIcon,
        current: pathname.includes("/requests"),
      },

      {
        name: "Segments",
        href: "/segments",
        icon: null,
        current: false,
        subItems: [
          {
            name: "Sessions",
            href: "/sessions",
            icon: ListTreeIcon,
            current: pathname.includes("/sessions"),
          },
          {
            name: "Properties",
            href: "/properties",
            icon: TagIcon,
            current: pathname.includes("/properties"),
          },

          {
            name: "Users",
            href: "/users",
            icon: UsersIcon,
            current: pathname.includes("/users"),
          },
        ],
      },
      {
        name: "Improve",
        href: "/improve",
        icon: null,
        current: false,
        subItems: [
          {
            name: "Prompts",
            href: "/prompts",
            icon: ScrollTextIcon,
            current: pathname.includes("/prompts"),
            isNew: true,
          },
          {
            name: "Experiments",
            href: "/experiments",
            icon: FlaskConicalIcon,
            current: pathname.includes("/experiments"),
          },
          {
            name: "Evaluators",
            href: "/evaluators",
            icon: ChartLineIcon,
            current: pathname.includes("/evaluators"),
          },
          {
            name: "Datasets",
            href: "/datasets",
            icon: DatabaseIcon,
            current: pathname.includes("/datasets"),
          },
          {
            name: "Playground",
            href: "/prompts/fromPlayground",
            icon: TestTube2,
            current: pathname.includes("/prompts/fromPlayground"),
          },
        ],
      },

      {
        name: "Developer",
        href: "/developer",
        icon: null,
        current: pathname.includes("/developer"),
        subItems: [
          {
            name: "Cache",
            href: "/cache",
            icon: ArchiveIcon,
            current: pathname.includes("/cache"),
          },
          {
            name: "Rate Limits",
            href: "/rate-limit",
            icon: ShieldCheckIcon,
            current: pathname === "/rate-limit",
          },
          {
            name: "Alerts",
            href: "/alerts",
            icon: BellIcon,
            current: pathname.includes("/alerts"),
          },
          {
            name: "Webhooks",
            href: "/webhooks",
            icon: Webhook,
            current: pathname.includes("/webhooks"),
          },
        ],
      },
      ...(org?.currentOrg?.tier === "enterprise"
        ? [
            {
              name: "Enterprise",
              href: "/enterprise",
              current: pathname.includes("/enterprise"),
              icon: null,
              subItems: [
                {
                  name: "Vault",
                  href: "/vault",
                  icon: LockIcon,
                  current: pathname.includes("/vault"),
                },
              ],
            },
          ]
        : []),
      // {
      //   name: "Settings",
      //   href: "/settings",
      //   icon: Cog6ToothIcon,
      //   current: false,
      //   subItems: [
      //     {
      //       name: "Organization",
      //       href: "/settings/organization",
      //       icon: null,
      //       current: false,
      //     },
      //     {
      //       name: "API Keys",
      //       href: "/settings/api-keys",
      //       icon: null,
      //       current: false,
      //     },
      //     ...(!user?.email?.includes("@helicone.ai")
      //       ? []
      //       : [
      //           {
      //             name: "Connections",
      //             href: "/settings/connections",
      //             icon: null,
      //             current: pathname.includes("/settings/connections"),
      //           },
      //         ]),
      //     {
      //       name: "Members",
      //       href: "/settings/members",
      //       icon: null,
      //       current: false,
      //     },
      //     {
      //       name: "Billing",
      //       href: "/settings/billing",
      //       icon: null,
      //       current: pathname.includes("/settings/billing"),
      //     },
      //   ],
      // },
    ],
    [pathname, org?.currentOrg?.tier]
  );

  return (
    <DesktopSidebar
      sidebarRef={sidebarRef}
      changelog={changelog}
      NAVIGATION={NAVIGATION}
      setOpen={setOpen}
    />
  );
};

export default Sidebar;

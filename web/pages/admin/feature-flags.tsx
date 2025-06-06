import { User } from "@supabase/auth-helpers-nextjs";
import { ReactElement } from "react";
import AdminLayout from "../../components/layout/admin/adminLayout";
import { withAuthSSR } from "../../lib/api/handlerWrappers";
import { getSupabaseServer } from "../../lib/supabaseServer";
import { AdminFeatureFlags } from "../../components/templates/admin/adminFeatureFlags";

interface AdminProps {
  user: User;
}

const Admin = (props: AdminProps) => {
  const { user } = props;

  return <AdminFeatureFlags />;
};

Admin.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Admin;

export const getServerSideProps = withAuthSSR(async (options) => {
  const {
    userData: { user },
  } = options;

  // const { data } = await jawn.GET("/v1/admin/admins/query");

  const { data, error } = await getSupabaseServer().from("admins").select("*");

  const admins = data?.map((admin) => admin.user_id || "") || [];

  if (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!admins.includes(user?.id || "")) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
});

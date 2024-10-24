import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";

const AdminBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="my-4 px-4">
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to="/admin/home">
            Home
          </Link>
        </BreadcrumbItem>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <BreadcrumbItem key={to}>
              <Link to={to}>
                {decodeURIComponent(value)}
              </Link>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </div>
  );
};

export default AdminBreadcrumb;

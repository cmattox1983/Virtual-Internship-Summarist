import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="wrapper">
        <Search />
        <div className="row">
          <div className="container">{children}</div>
        </div>
      </div>
    </>
  );
}

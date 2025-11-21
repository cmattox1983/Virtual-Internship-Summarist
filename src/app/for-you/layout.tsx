import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";

export default function ForYouLayout({
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
          <div className="container">
            <div className="for-you__wrapper">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}

import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="wrapper">
        <Search />
        <div className="container">
          <div className="row">
            <div className="section__title page__title">Settings</div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="p-4 bg-gray-100 border-b border-gray-200 fixed top-0 w-full z-10">
      <div className="flex items-center justify-between mx-auto">
        <Link href="/dashboard" className="h-8 flex items-center gap-2">
          <Logo color="brand" />
          <span className="font-semibold text-[28px] text-[#002856]">StudioSwarm</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;

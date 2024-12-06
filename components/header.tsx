import Link from "next/link";
import Logo from "./Logo";
import { SearchBar } from "./search-bar";
import { SearchModal } from "./search-modal";

const Header = () => {
  return (
    <header className="p-2 fixed top-0 w-full z-10 bg-gradient-to-r from-[#002856] to-[#1a4c8b] shadow-md">
      <div className="flex items-center justify-between mx-auto">
        <Link href="/dashboard" className="h-5 flex items-center gap-1.5">
          <Logo color="white" />
          <span className="font-semibold text-[18px] text-white">StudioSwarm</span>
        </Link>
        <div className="flex-1 flex justify-center">
          <SearchModal />
        </div>
      </div>
    </header>
  );
};

export default Header;

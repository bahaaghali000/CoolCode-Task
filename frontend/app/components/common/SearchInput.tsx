import { IoSearchOutline } from "react-icons/io5";

const SearchInput = ({ setSearch }: { setSearch: any }) => {
  return (
    <div className=" flex items-center gap-2 px-3 py-2 rounded-lg bg-white w-max ">
      <IoSearchOutline />
      <input
        type="text"
        className="outline-none "
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;

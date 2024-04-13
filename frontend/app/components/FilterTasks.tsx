import Link from "next/link";
import { IoIosAdd } from "react-icons/io";

interface Props {
  setStatus: (e: string) => void;
  setCategory: (e: string) => void;
}

const FilterTasks: React.FC<Props> = ({ setStatus, setCategory }) => {
  return (
    <div className=" max-sm:px-2 px-10 flex max-sm:flex-wrap justify-between items-center mt-5">
      <h2 className=" font-bold text-xl">DashBoard</h2>
      <div className="flex items-center gap-2">
        <select
          className="px-2 py-1 rounded-md focus:ring-2 outline-none  focus:ring-indigo-600 "
          onChange={(e: any) => setStatus(e.target.value)}
        >
          <option value="">none</option>
          <option value="DONE">Done</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
        </select>

        <select
          className="px-2 py-1 rounded-md focus:ring-2 outline-none  focus:ring-indigo-600 "
          onChange={(e: any) => setCategory(e.target.value)}
        >
          <option value="">all</option>
          <option value="work">work</option>
          <option value="personal">personal</option>
          <option value="shopping">shopping</option>
        </select>

        <Link href="/tasks/add">
          <IoIosAdd className="text-2xl  text-black" />
        </Link>
      </div>
    </div>
  );
};

export default FilterTasks;

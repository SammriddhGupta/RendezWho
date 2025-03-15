
export default function NameInput() {
  return (
    <div className="w-[210px] h-[30px] flex mt-2 bg-gray-100 rounded-md items-center justify-left">
      <input
        className="w-full pl-2 py-2 text-sm rounded-md text-gray-700"
        type="text"
        placeholder="Enter your name"
      />
      <button className="w-[80px] h-full bg-violet-500 text-white rounded-md text-sm">
        Add
      </button>
    </div>
  );
}

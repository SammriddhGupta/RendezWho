
export default function NameInput() {
  return (
    <div className="w-[120px] h-[30px] gap-4 flex mt-2 bg-gray-100 rounded-md items-center justify-left">
      <input
        className="w-full px-4 py-2 rounded-md text-gray-700"
        type="text"
        placeholder="Enter your name"
      />
      <button className="w-20 h-8 bg-amber-300 text-black rounded-md text-sm">
        Add
      </button>
    </div>
  );
}

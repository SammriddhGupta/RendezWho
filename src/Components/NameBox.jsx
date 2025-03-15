
export default function NameBox({ name }) {
  const inital = name.charAt(0).toUpperCase();
  return (
    <div className="w-[120px] h-[30px] gap-4 flex mt-2 bg-gray-100 rounded-md items-center justify-left">
      <div className="flex w-[25px] h-[25px] bg-[#4379F2] text-white rounded-full border items-center justify-center border-black">
        {inital}
      </div>
      <div>{name}</div>
    </div>
  );
}
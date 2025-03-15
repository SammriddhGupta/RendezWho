
export default function NameBox({ name }) {
  const inital = name.charAt(0).toUpperCase();
  return (
    <div className="w-[120px] h-[30px] gap-4 flex mt-2 bg-gray-100 rounded-bl-2xl rounded-tl-2xl rounded-r-lg items-center justify-left">
      <div className="flex w-[25px] h-[25px] bg-amber-300 text-black rounded-full items-center justify-center">
        {inital}
      </div>
      <div>{name}</div>
    </div>
  );
}
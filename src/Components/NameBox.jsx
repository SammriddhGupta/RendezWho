
export default function NameBox({ name }) {
  const inital = name.charAt(0).toUpperCase();

  return (
    <div className="w-[200px] h-[50px] gap-4 flex mt-2 bg-amber-200 rounded-md items-center justify-center">
      <div className="flex w-[25px] h-[25px] rounded-full border items-center justify-center border-black">
        {inital}
      </div>
      <div>{name}</div>
    </div>
  );
}
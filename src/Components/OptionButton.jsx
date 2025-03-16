export default function OptionButton({
  option,
  votes = 0,
  isSelected,
  onVote,
}) {
  return (
    <button
      className={`flex items-center justify-between h-4 text-lg font-semibold border-2 rounded-lg w-full p-3 py-5 transition-all duration-200 ${
        isSelected
          ? "bg-purple-400 text-white border-purple-200"
          : "bg-purple-200 text-purple-500 border-purple-400"
      }`}
      onClick={onVote} // Clicking follows the toggle-vote logic
    >
      <span>{option}</span>
      <span className="text-sm px-2 py-1 text-purple-500 bg-white bg-opacity-100 rounded-full isolation-isolate">
        {votes} vote{votes !== 1 ? "s" : ""}
      </span>
    </button>
  );
}

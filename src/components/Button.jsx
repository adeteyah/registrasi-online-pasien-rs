export function Button({
  type = "button",
  text,
  onClick,
  disabled = false,
  variant = "solid", // 'solid' | 'outlined'
  color = "blue", // 'blue' | 'zinc'
}) {
  const baseStyle = "px-5 py-4 rounded-xl shadow";

  const styleMap = {
    solid: {
      blue: disabled
        ? "bg-blue-300 text-blue-100 cursor-not-allowed shadow shadow-blue-500"
        : "bg-blue-500 text-blue-100 hover:bg-blue-600 shadow-blue-200 cursor-pointer",
      zinc: disabled
        ? "bg-zinc-400 text-zinc-200 cursor-not-allowed"
        : "bg-zinc-700 text-zinc-50 hover:bg-zinc-700 shadow-zinc-300 cursor-pointer",
    },
    outlined: {
      blue: disabled
        ? "border border-blue-300 text-blue-300 cursor-not-allowed"
        : "border border-blue-200 text-blue-500 bg-white hover:bg-blue-50 cursor-pointer",
      zinc: disabled
        ? "border border-zinc-400 text-zinc-400 cursor-not-allowed"
        : "border border-zinc-300 text-zinc-600 bg-white hover:bg-zinc-100 cursor-pointer",
    },
  };

  return (
    <button
      className={`${baseStyle} ${styleMap[variant][color]}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;

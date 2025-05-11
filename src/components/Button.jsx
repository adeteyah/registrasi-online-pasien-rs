export function Button({
  type = "button",
  text,
  onClick,
  disabled = false,
  variant = "solid",
}) {
  const baseStyle = "w-full px-5 py-2.5 rounded-xl shadow hover:cursor-pointer";

  const styles = {
    solid: disabled
      ? "bg-zinc-400 text-zinc-200 cursor-not-allowed"
      : "bg-blue-500 text-blue-200 hover:bg-blue-600 shadow-blue-200",
    outlined: disabled
      ? "border border-zinc-400 text-zinc-400 cursor-not-allowed"
      : "border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50",
  };

  return (
    <button
      className={`${baseStyle} ${styles[variant]}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

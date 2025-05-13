export default function Table({
  columns,
  data,
  variant = "default", // 'default' | 'same-width'
  density = "normal", // 'normal' | 'compact'
}) {
  const isSameWidth = variant === "same-width";
  const isCompact = density === "compact";

  const tdClass = `${isCompact ? "p-2 text-sm " : "p-3"}`;
  const thClass = `${isCompact ? "p-2 text-sm" : "p-3"} font-semibold`;

  return (
    <div className="border border-zinc-200 rounded-2xl overflow-hidden">
      <table className="w-full table-fixed">
        <thead className="bg-zinc-100 outline outline-zinc-200 text-zinc-900 text-left">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`${thClass} ${
                  isSameWidth ? "w-1/" + columns.length : ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={tdClass}>
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 outline outline-zinc-100"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`${tdClass} ${
                      isSameWidth ? "w-1/" + columns.length : ""
                    }`}
                  >
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

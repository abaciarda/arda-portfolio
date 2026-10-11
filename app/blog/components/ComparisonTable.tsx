export default function ComparisonTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: { _key: string; cells: string[] }[];
}) {
  return (
    <div className="my-6 border border-foreground/10 rounded overflow-x-auto">
      <table className="w-full text-left min-w-100">
        <thead className="text-[10px] uppercase tracking-widest text-foreground/30 bg-foreground/5 border-b border-foreground/10">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-3 font-medium border-r last:border-r-0 border-foreground/10"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row._key}
              className="border-b last:border-b-0 border-foreground/10"
            >
              {row.cells.map((cell, index) => (
                <td
                  key={index}
                  className="px-4 py-3 text-sm text-foreground/60 font-light border-r last:border-r-0 border-foreground/10"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

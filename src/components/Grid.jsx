export function GridY({ children }) {
  return <div className="grid grid-flow-row gap-3.5">{children}</div>;
}

export function GridX({ children }) {
  const childrenArray = Array.isArray(children) ? children : [children];
  const isOdd = childrenArray.length % 2 !== 0;

  return (
    <div className="grid grid-cols-2 gap-3.5">
      {childrenArray.map((child, index) => {
        const isLast = index === childrenArray.length - 1;
        if (isLast && isOdd) {
          return (
            <div key={index} className="col-span-2">
              {child}
            </div>
          );
        }
        return <div key={index}>{child}</div>;
      })}
    </div>
  );
}

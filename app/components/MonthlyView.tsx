export default function MonthlyView() {
  return (
    <>
      <div className="flex h-screen w-3/4 bg-white">
        <div className="grid grid-cols-7 grid-rows-4 bg-transparent">
            {Array.from({ length: 31 }, (_, i) => (
            <div
                key={i}
                className="w-48 h-48 
                        bg-transparent border-2 
                        border-black m-2 p-0"
            >
                <p>{i + 1}</p>
            </div>
            ))}
        </div>
      </div>
    </>
  );
}

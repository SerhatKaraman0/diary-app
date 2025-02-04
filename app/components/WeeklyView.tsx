export default function WeeklyView() {
    return (
        <>
        <div className="flex h-screen w-3/4 bg-white">
          <div className="grid grid-cols-3 grid-rows-3 bg-transparent">
              {Array.from({ length: 7 }, (_, i) => (
              <div
                  key={i}
                  className="w-80 h-80 gap-y-0 
                          bg-transparent border-2 
                          border-black m-1 p-0"
              >
                  <p>{i + 1}</p>
              </div>
              ))}
          </div>
        </div>
      </>
    );
}
  
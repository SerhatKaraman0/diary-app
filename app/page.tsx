
import MonthlyView from "./components/MonthlyView";
import WeeklyView from "./components/WeeklyView";

export default function Home() {
  return (
    <div className="flex h-full w-full">
      <div className="flex border-1 h-screen w-1/4 bg-white text-white items-center justify-center">
        <h1 className="text-center text-black">January</h1>
      </div> 
        <MonthlyView />        
    </div>
  );
}

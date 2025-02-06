
import CalendarComponent from "./components/CalendarComponent";
import CalendarComp from "./components/CalendarComponent";
import GoDateButton from "./components/GoDateButton";


export default function Home() {
  return (
    <div className="flex h-full w-full"> 
        <GoDateButton />
        <CalendarComponent />        
    </div>
  );
}

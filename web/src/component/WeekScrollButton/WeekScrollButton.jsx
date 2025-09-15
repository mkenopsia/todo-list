import './WeekScrollButton.css'
import { useTasks } from '../../provider/TasksProvider';

function WeekScrollButton() {

    const {incrementOffsetWeeks, decrementOffsetWeeks} = useTasks();

    return (
        <div className="scroll-button-container">
            <button onClick={decrementOffsetWeeks}>&lt;</button>
            <button onClick={incrementOffsetWeeks}>&gt;</button>
        </div>
    )
}

export default WeekScrollButton;
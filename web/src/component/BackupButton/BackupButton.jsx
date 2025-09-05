import { useTasks } from "../../provider/TasksProvider";

function BackupButton() {
    const { exportTasksAsJson } = useTasks();

    return (
        <button onClick={exportTasksAsJson}>
            💾
        </button>
    )
}

export default BackupButton;
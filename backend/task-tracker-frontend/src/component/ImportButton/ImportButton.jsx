import { useTasks } from "../../provider/TasksProvider";

function ImportButton() {

    const {loadTasksFromJson} = useTasks();

    function handleImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (file) => {
            loadTasksFromJson(file.target.files[0])
        }

        input.click();
    }

    return (
        <button onClick={handleImport}>
            💿
        </button>
    )
}

export default ImportButton;
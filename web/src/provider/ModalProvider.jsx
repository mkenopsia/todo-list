import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useTasks must be used within TasksProvider');
    return context;
}

export function ModalProvider({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaveMode, setIsSaveMode] = useState(true);
    const [modalDate, setModalDate] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'active'
    });

    function openEditingModal(date, task) {
        setModalDate(date);
        setFormData({ taskId: task.id, name: task.name, description: task.description, status: task.status });
        setIsSaveMode(false);
        setIsModalOpen(true);
    }

    function openCreatingModal(date) {
        setIsSaveMode(true);
        setModalDate(date);
        setFormData({ name: '', description: '', status: 'active' });
        setIsModalOpen(true);
    };

    function closeModal() {
        setIsModalOpen(false);
        setModalDate('');
    };

    return (
        <ModalContext.Provider value={{ isModalOpen, modalDate, formData, setFormData, openCreatingModal, closeModal, openEditingModal, isSaveMode }}>
            {children}
        </ModalContext.Provider>
    );
}
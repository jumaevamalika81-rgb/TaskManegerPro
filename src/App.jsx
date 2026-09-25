import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  // 1. Хранилище задач
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('pro_tasks_db');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Поля формы
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    category: 'IT Проект',
    priority: 'medium',
    dueDate: '',
  });

  // 3. Поиск и Фильтр
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  // Сохранение при изменениях
  useEffect(() => {
    localStorage.setItem('pro_tasks_db', JSON.stringify(tasks));
  }, [tasks]);

  // Обработка ввода в форму
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Создание или Обновление задачи (Create / Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return;

    if (formData.id) {
      // UPDATE (Редактирование существующей)
      setTasks(tasks.map((t) => (t.id === formData.id ? formData : t)));
    } else {
      // CREATE (Создание новой)
      const newTask = { ...formData, id: Date.now() };
      setTasks([newTask, ...tasks]);
    }

    // Очистка формы
    setFormData({ id: null, title: '', description: '', category: 'IT Проект', priority: 'medium', dueDate: '' });
  };

  // Подготовка к редактированию
  const handleEdit = (task) => {
    setFormData(task);
  };

  // Удаление (Delete)
  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Фильтрация и Поиск
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="app-layout">
      <header className="header">
        <div>
          <h2>Task Manager Pro</h2>
          <p style={{ fontSize: '12px', opacity: 0.8 }}>Управление задачами высокого уровня</p>
        </div>
        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px' }}>
          Всего: {tasks.length}
        </span>
      </header>

      <main className="main-grid">
        {/* ФОРМА СОЗДАНИЯ И РЕДАКТИРОВАНИЯ */}
        <section className="card-form">
          <h3 style={{ marginBottom: '16px' }}>
            {formData.id ? ' Редактировать задачу' : ' Создать задачу'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Название *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Введите название..."
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Описание</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Подробности..."
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Категория</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="input-field">
                <option value="IT Проект"> IT Проект</option>
                <option value="Обучение"> Обучение</option>
                <option value="Работа"> Работа</option>
                <option value="Личное"> Личное</option>
              </select>
            </div>

            <div className="form-group">
              <label>Приоритет</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange} className="input-field">
                <option value="low"> Низкий</option>
                <option value="medium"> Средний</option>
                <option value="high"> Высокий</option>
              </select>
            </div>

            <div className="form-group">
              <label>Срок (Дедлайн) *</label>
              <input
                type="date"
                name="dueDate"
                required
                value={formData.dueDate}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <button type="submit" className="btn-primary">
              {formData.id ? 'Сохранить изменения' : 'Создать задачу'}
            </button>

            {formData.id && (
              <button
                type="button"
                onClick={() => setFormData({ id: null, title: '', description: '', category: 'IT Проект', priority: 'medium', dueDate: '' })}
                style={{ width: '100%', marginTop: '8px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                Отмена
              </button>
            )}
          </form>
        </section>

        {/* СПИСОК ЗАДАЧ, ПОИСК И ФИЛЬТРЫ */}
        <section>
          <div className="controls-bar">
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field search-input"
            />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="input-field"
              style={{ width: 'auto' }}
            >
              <option value="all">Все приоритеты</option>
              <option value="high">Только высокие</option>
              <option value="medium">Только средние</option>
              <option value="low">Только низкие</option>
            </select>
          </div>

          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '14px', border: '1px dashed #cbd5e1', color: '#94a3b8' }}>
                Задачи не найдены.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className={`badge priority-${task.priority}`}>{task.priority}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{task.category}</span>
                  </div>

                  <h4 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '4px' }}>{task.title}</h4>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>{task.description || 'Без описания'}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#94a3b8' }}>
                    <span> До: {task.dueDate}</span>
                    <div className="actions-group">
                      <button onClick={() => handleEdit(task)} className="btn-icon btn-edit">Редактировать</button>
                      <button onClick={() => handleDelete(task.id)} className="btn-icon btn-delete">Удалить</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

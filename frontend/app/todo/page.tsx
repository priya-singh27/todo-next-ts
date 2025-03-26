'use client';

import { useState, useEffect } from 'react';
import './todo.css';

function TodoManager() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'x-auth-token': `${token}`
    };
  };

  const fetchTodos = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/todo/get', {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Your session has expired. Please login again.');
        }
        throw new Error('Failed to fetch todos');
      }
      
      const data = await response.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
      
      if (error.message.includes('session has expired')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      let url = 'http://localhost:3001/todo/create';
      let method = 'POST';
      let body = { title, description, completed: false };
      
      if (editingId) {
        url = 'http://localhost:3001/todo/update';
        method = 'PUT';
        body = { ...body, id: editingId };
      }
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Your session has expired. Please login again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operation failed');
      }
      
      setTitle('');
      setDescription('');
      setEditingId(null);
      await fetchTodos();
    } catch (error) {
      console.error('Submit error:', error);
      setError(error.message);
      
      if (error.message.includes('session has expired')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/todo/delete', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Your session has expired. Please login again.');
        }
        throw new Error('Failed to delete todo');
      }
      
      await fetchTodos();
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.message);
      
      if (error.message.includes('session has expired')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setEditingId(todo.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <main className="todo-container">
      <header className="todo-header">
        <h1>Todo Manager</h1>
        <nav>
          <button 
            onClick={handleLogout}
            className="logout-button"
            aria-label="Logout"
          >
            Logout
          </button>
        </nav>
      </header>
      
      {error && (
        <section className="error-message" role="alert">
          {error}
        </section>
      )}
      
      <section>
        <h2 className="visually-hidden">Add or Edit Todo</h2>
        <form onSubmit={handleSubmit} className="todo-form">
          <div className="form-group">
            <label htmlFor="todo-title" className="visually-hidden">Todo Title</label>
            <input
              id="todo-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Todo title"
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="todo-description" className="visually-hidden">Todo Description</label>
            <input
              id="todo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="input-field"
            />
          </div>
          <div className="button-group">
            <button 
              type="submit" 
              disabled={isLoading}
              className="submit-button"
            >
              {editingId ? 'Update Todo' : 'Add Todo'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setTitle('');
                  setDescription('');
                  setEditingId(null);
                }}
                className="cancel-button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2 className="visually-hidden">Todo List</h2>
        {isLoading && !todos.length ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <ul className="todo-list">
            {todos.length === 0 ? (
              <li className="empty-list">No todos yet. Create one above!</li>
            ) : (
              todos.map(todo => (
                <li key={todo.id} className="todo-item">
                  <article>
                    <h3 className="todo-title">{todo.title}</h3>
                    {todo.description && <p className="todo-description">{todo.description}</p>}
                    <footer className="todo-actions">
                      <button 
                        onClick={() => startEditing(todo)}
                        className="edit-button"
                        aria-label={`Edit todo: ${todo.title}`}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(todo.id)}
                        className="delete-button"
                        aria-label={`Delete todo: ${todo.title}`}
                      >
                        Delete
                      </button>
                    </footer>
                  </article>
                </li>
              ))
            )}
          </ul>
        )}
      </section>
    </main>
  );
}

export default TodoManager;
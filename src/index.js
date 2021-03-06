import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import TodoItem from './todo-item';
import './styles.css'

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            todo: "",
            todos: []
        }
    }
    componentDidMount() {
        fetch("http://mc-flask-todo-api.herokuapp.com/todos")
            .then(response => response.json())
            .then(data => {
                this.setState({
                    todos: data
                })
            })
    }
    handleChange = (e) => {
        this.setState({
            todo: e.target.value
        })
    }
    addTodo = (e) => {
        e.preventDefault()
        axios({
            method: "post",
            url: "http://mc-flask-todo-api.herokuapp.com/todo",
            headers: { "content-type": "application/json" },
            data: {
                title: this.state.todo,
                done: false
            }
        })
        .then(data => {
            this.setState({
                todos: [...this.state.todos, data.data],
                todo: ""
            })
        })
        .catch(error => {
            console.log("add todo error: ", error)
        })
    }
    renderTodos = () => {
        return this.state.todos.map((todo) => {
            return <TodoItem key={todo.id} todo={todo} deleteItem={this.deleteItem}/>
        })
    }
    deleteItem = id => {
        fetch(`http://http://mc-flask-todo-api.herokuapp.com/todo/${id}`, {
            method: "DELETE"
        })
        .then(
            this.setState({
                todos: this.state.todos.filter(item => {
                    return item.id !== id
                })
            })
        )
        .catch(error => {
            console.log('deleteItem error', error)
        })
    }
    render() {
        return (
            <div className="app">
                <h1>ToDo List</h1>
                <form className="add-todo" onSubmit={this.addTodo}>
                    <input
                        type="text"
                        placeholder="Add Todo"
                        onChange={this.handleChange}
                        value={this.state.todo}
                    />
                    <button type="submit">Add</button>
                </form>
                {this.renderTodos()}
            </div>
        )
    }
}
const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
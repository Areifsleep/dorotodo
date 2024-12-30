import React, { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TodoItem } from "@/types/storage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Circle,
  ListTodo,
  ChevronDown,
  ChevronUp,
  Edit3,
  Check,
  X,
} from "lucide-react";

interface ExpandedTodoState {
  [key: number]: boolean;
}

const STORAGE_KEY = "todo-list";

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>(STORAGE_KEY, []);
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTodos, setExpandedTodos] = useState<ExpandedTodoState>({});
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState<string>("");

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      setError("Task cannot be empty");
      return;
    }

    const todo: TodoItem = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
    };

    setTodos((prev) => [...prev, todo]);
    setNewTodo("");
    setError("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const toggleExpand = (id: number) => {
    setExpandedTodos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const editTodo = (id: number) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      setEditTodoId(id);
      setEditedText(todo.text);
    }
  };

  const saveEdit = (id: number) => {
    if (!editedText.trim()) {
      setError("Task cannot be empty");
      return;
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: editedText.trim() } : todo
      )
    );
    setEditTodoId(null);
    setEditedText("");
    setError("");
  };

  const cancelEdit = () => {
    setEditTodoId(null);
    setEditedText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && editTodoId !== null) {
      saveEdit(editTodoId);
    }
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .filter((todo) =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ListTodo className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xl">Todo</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium px-3 py-1 bg-blue-50 rounded-full">
              {todos.filter((t) => !t.completed).length} active
            </span>
            <span className="text-sm font-medium px-3 py-1 bg-green-50 rounded-full">
              {todos.filter((t) => t.completed).length} completed
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <form onSubmit={addTodo} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 rounded-xl border-2 bg-white/60 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
            />
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
              className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <Button
              type="submit"
              className="rounded-xl px-6 py-6 flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-600 hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="w-6 h-6" />
              <span className="ml-2">Add</span>
            </Button>
          </form>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="rounded-xl"
            >
              All Tasks
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              onClick={() => setFilter("active")}
              className="rounded-xl"
            >
              Active
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              onClick={() => setFilter("completed")}
              className="rounded-xl"
            >
              Completed
            </Button>
            {todos.some((todo) => todo.completed) && (
              <Button
                variant="outline"
                onClick={clearCompleted}
                className="ml-auto rounded-xl"
              >
                Clear Completed
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`group p-4 rounded-xl transition-all duration-300 hover:shadow-md
                  ${todo.completed ? "bg-white/50" : "bg-white/70"}
                  ${todo.priority === "high" ? "border-l-4 border-red-500" : ""}
                  ${
                    todo.priority === "medium"
                      ? "border-l-4 border-yellow-500"
                      : ""
                  }
                  ${
                    todo.priority === "low" ? "border-l-4 border-green-500" : ""
                  }
                `}
              >
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => toggleExpand(todo.id)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTodo(todo.id);
                    }}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                    )}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`transition-all duration-300 ${
                        todo.completed
                          ? "line-through text-gray-500"
                          : "text-gray-700"
                      } ${expandedTodos[todo.id] ? "" : "truncate"}`}
                      style={{ wordWrap: "break-word", maxWidth: "98%" }}
                    >
                      {editTodoId === todo.id ? (
                        <input
                          type="text"
                          value={editedText}
                          onKeyDown={handleKeyDown}
                          onChange={(e) => setEditedText(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 bg-white/60 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                        />
                      ) : (
                        todo.text
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 px-2 py-1 bg-white/60 rounded-full hidden sm:inline-block">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                    {editTodoId === todo.id ? (
                      <div className="flex flex-col sm:flex-row gap-0 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveEdit(todo.id)}
                          className="rounded-xl w-full sm:w-auto"
                        >
                          <Check className="text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl w-full sm:w-auto"
                          onClick={cancelEdit}
                        >
                          <X className=" text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          editTodo(todo.id);
                          e.stopPropagation();
                        }}
                      >
                        <Edit3 className="w-4 h-4 text-blue-500" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTodo(todo.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    {expandedTodos[todo.id] ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Mobile date display */}
                {expandedTodos[todo.id] && (
                  <div className="mt-2 sm:hidden">
                    <span className="text-xs text-gray-500 px-2 py-1 bg-white/60 rounded-full">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredTodos.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <ListTodo className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">
                {searchTerm ? "No matching tasks found" : "No tasks yet"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoList;

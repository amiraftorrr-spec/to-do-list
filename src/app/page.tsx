import { TodoProvider } from "@/context/TodoContext";
import { TodoDashboard } from "@/components/todos/TodoDashboard";

export default function Home() {
  return (
    <TodoProvider>
      <TodoDashboard />
    </TodoProvider>
  );
}

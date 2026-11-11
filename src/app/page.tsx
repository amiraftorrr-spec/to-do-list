import { TodoProvider } from "@/context/TodoContext";
import { TodoDashboard } from "@/components/todos/TodoDashboard";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <TodoProvider>
        <TodoDashboard />
      </TodoProvider>
    </ErrorBoundary>
  );
}

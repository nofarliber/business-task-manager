import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "@/utils/useUser";
import { CheckCircle, Circle, Calendar, User, LogOut } from "lucide-react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const queryClient = useQueryClient();

  // Fetch client data
  const { data: clientData, isLoading: clientLoading } = useQuery({
    queryKey: ["client"],
    queryFn: async () => {
      const response = await fetch("/api/clients");
      if (!response.ok) {
        throw new Error("Failed to fetch client data");
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch tasks
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      return response.json();
    },
    enabled: !!clientData?.client,
  });

  // Toggle task mutation
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleToggleTask = (taskId, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    toggleTaskMutation.mutate({ taskId, status: newStatus });
  };

  const getBusinessTypeLabel = (businessType) => {
    const labels = {
      law_firm: "Law Firm",
      web_designer: "Web Designer",
      beautician: "Beautician / Cosmetician",
      online_sales: "Online Sales Business",
      fitness_instructor: "Fitness Instructor",
    };
    return labels[businessType] || businessType;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilDue = (dueDateString) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTaskPriorityColor = (dueDateString, status) => {
    if (status === "completed")
      return "text-green-600 bg-green-50 border-green-200";

    const daysUntil = getDaysUntilDue(dueDateString);
    if (daysUntil < 0) return "text-red-600 bg-red-50 border-red-200"; // Overdue
    if (daysUntil <= 3) return "text-orange-600 bg-orange-50 border-orange-200"; // Due soon
    return "text-blue-600 bg-blue-50 border-blue-200"; // Normal
  };

  // Redirect to onboarding if no client exists
  useEffect(() => {
    if (!clientLoading && clientData && !clientData.client) {
      if (typeof window !== "undefined") {
        window.location.href = "/onboarding";
      }
    }
  }, [clientData, clientLoading]);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/account/signin";
      }
    }
  }, [user, userLoading]);

  if (userLoading || clientLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !clientData?.client) {
    return null; // Will redirect in useEffect
  }

  const client = clientData.client;
  const tasks = tasksData?.tasks || [];
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const pendingTasks = tasks.filter((task) => task.status === "pending");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg">
                <User size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getBusinessTypeLabel(client.business_type)} Dashboard
                </h1>
                <p className="text-gray-600">{client.business_name}</p>
              </div>
            </div>
            <a
              href="/account/logout"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">
                  {tasks.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {completedTasks.length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600">
                  {pendingTasks.length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Circle className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Monthly Tasks
            </h2>
            <p className="text-gray-600 mt-1">
              Click on tasks to mark them as complete
            </p>
          </div>

          <div className="p-6">
            {tasksLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No tasks available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => {
                  const daysUntil = getDaysUntilDue(task.due_date);
                  const priorityColor = getTaskPriorityColor(
                    task.due_date,
                    task.status,
                  );

                  return (
                    <div
                      key={task.id}
                      className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${priorityColor}`}
                      onClick={() => handleToggleTask(task.id, task.status)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {task.status === "completed" ? (
                            <CheckCircle className="text-green-600" size={24} />
                          ) : (
                            <Circle className="text-gray-400" size={24} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-lg font-medium ${task.status === "completed" ? "line-through text-gray-500" : "text-gray-900"}`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p
                              className={`mt-1 ${task.status === "completed" ? "text-gray-400" : "text-gray-600"}`}
                            >
                              {task.description}
                            </p>
                          )}

                          <div className="mt-2 flex items-center space-x-4 text-sm">
                            <span className="flex items-center space-x-1">
                              <Calendar size={16} />
                              <span>Due: {formatDate(task.due_date)}</span>
                            </span>

                            {task.status === "pending" && (
                              <span
                                className={`font-medium ${
                                  daysUntil < 0
                                    ? "text-red-600"
                                    : daysUntil <= 3
                                      ? "text-orange-600"
                                      : "text-blue-600"
                                }`}
                              >
                                {daysUntil < 0
                                  ? `${Math.abs(daysUntil)} days overdue`
                                  : daysUntil === 0
                                    ? "Due today"
                                    : `${daysUntil} days remaining`}
                              </span>
                            )}

                            {task.status === "completed" &&
                              task.completed_at && (
                                <span className="text-green-600 font-medium">
                                  Completed {formatDate(task.completed_at)}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;

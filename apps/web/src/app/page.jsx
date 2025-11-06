import { useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  CheckCircle,
  Users,
  Calendar,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!userLoading && user) {
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard";
      }
    }
  }, [user, userLoading]);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  const businessTypes = [
    { name: "Law Firms", icon: "⚖️", color: "from-blue-500 to-blue-600" },
    {
      name: "Web Designers",
      icon: "💻",
      color: "from-purple-500 to-purple-600",
    },
    { name: "Beauticians", icon: "💄", color: "from-pink-500 to-pink-600" },
    { name: "Online Sales", icon: "🛒", color: "from-green-500 to-green-600" },
    {
      name: "Fitness Instructors",
      icon: "💪",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const features = [
    {
      icon: <Calendar className="text-blue-600" size={24} />,
      title: "Monthly Task Planning",
      description:
        "Get a customized monthly task list based on your business type with clear due dates.",
    },
    {
      icon: <CheckCircle className="text-green-600" size={24} />,
      title: "Progress Tracking",
      description:
        "Mark tasks as complete and watch them turn green. Track your promotional progress easily.",
    },
    {
      icon: <TrendingUp className="text-purple-600" size={24} />,
      title: "Business Growth",
      description:
        "Stay consistent with your marketing efforts and watch your business grow month by month.",
    },
    {
      icon: <Users className="text-orange-600" size={24} />,
      title: "Industry-Specific",
      description:
        "Tasks are tailored to your specific business type for maximum relevance and impact.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
                <CheckCircle size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Business Task Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/account/signin"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </a>
              <a
                href="/account/signup"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Promote Your Business
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              With Confidence
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get a personalized monthly task list designed specifically for your
            business type. Stay consistent with your marketing efforts and watch
            your business grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/account/signup"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Free Today</span>
              <ArrowRight size={20} />
            </a>
            <a
              href="/account/signin"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium text-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Designed for Your Business
            </h2>
            <p className="text-lg text-gray-600">
              We support five key business types with industry-specific
              promotional tasks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {businessTypes.map((business, index) => (
              <div key={index} className="text-center">
                <div
                  className={`bg-gradient-to-r ${business.color} text-white p-6 rounded-xl mb-4 mx-auto w-20 h-20 flex items-center justify-center text-2xl`}
                >
                  {business.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{business.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600">
              Simple, effective tools to keep your business promotion on track
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="bg-gray-50 p-3 rounded-lg w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Tasks Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sample Monthly Tasks
            </h2>
            <p className="text-lg text-gray-600">
              Here's what your task list might look like
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="space-y-4">
              {[
                {
                  title: "Post on Facebook",
                  description:
                    "Share business updates or tips with your audience",
                  completed: true,
                },
                {
                  title: "Upload client testimonial video",
                  description:
                    "Record and share a satisfied client's experience",
                  completed: true,
                },
                {
                  title: "Update website content",
                  description: "Refresh your services and contact information",
                  completed: false,
                },
                {
                  title: "Create promotional campaign",
                  description: "Launch a special offer or seasonal promotion",
                  completed: false,
                },
                {
                  title: "Network with other professionals",
                  description: "Attend industry events or connect online",
                  completed: false,
                },
              ].map((task, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${task.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle
                      className={
                        task.completed ? "text-green-600" : "text-gray-400"
                      }
                      size={20}
                    />
                    <div>
                      <h4
                        className={`font-medium ${task.completed ? "text-green-900 line-through" : "text-gray-900"}`}
                      >
                        {task.title}
                      </h4>
                      <p
                        className={`text-sm ${task.completed ? "text-green-700" : "text-gray-600"}`}
                      >
                        {task.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of business owners who are staying consistent with
            their promotional efforts
          </p>
          <a
            href="/account/signup"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-50 transition-all inline-flex items-center space-x-2"
          >
            <span>Get Started Free</span>
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
                <CheckCircle size={20} />
              </div>
              <h3 className="text-lg font-semibold">Business Task Manager</h3>
            </div>
            <p className="text-gray-400">
              Helping businesses stay consistent with their promotional efforts
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainComponent;

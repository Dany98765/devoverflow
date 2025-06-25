import LogoutButton from "@/components/logout-button/page";
import SearchBar from "@/components/search-bar/page";
import ROUTES from "@/routes";
import FilterButtons from "@/components/filter-buttons/page";
import "./globals.css";
import QuestionCard from "@/components/question-card/page";
import logger from "@/utils/logger";

export default async function Home({searchParams}) {
  const questions = [
    {
      id: 1,
      title: "What is the best way to learn React?",
      tags: ["React", "JavaScript", "Frontend"],
      author: "John Doe",
      createdAt: "2025-06-01",
      upvotes: 120,
      answers: 5,
      views: 450,
      description: "React is one of the most popular JavaScript libraries for building user interfaces. This question explores the best practices and resources for learning React effectively. It covers topics like tutorials, documentation, and hands-on projects. Beginners and experienced developers alike can benefit from the insights shared here.",
    },
    {
      id: 2,
      title: "How do I optimize performance in a Next.js app?",
      tags: ["Next.js", "Performance", "Optimization"],
      author: "Jane Smith",
      createdAt: "2025-06-05",
      upvotes: 95,
      answers: 3,
      views: 300,
      description: "Next.js is known for its performance, but there are always ways to optimize further. This question dives into techniques for improving load times, reducing bundle sizes, and leveraging server-side rendering. It also discusses caching strategies and tools for monitoring performance. Developers looking to enhance their Next.js apps will find valuable tips here.",
    },
    {
      id: 3,
      title: "What are the differences between React and Vue?",
      tags: ["React", "Vue", "Comparison"],
      author: "Alice Johnson",
      createdAt: "2025-06-10",
      upvotes: 80,
      answers: 4,
      views: 250,
      description: "React and Vue are two of the most popular frontend frameworks, but they have distinct differences. This question compares their syntax, performance, and ecosystem to help developers choose the right tool for their projects. It also highlights the pros and cons of each framework. Whether you're new to web development or experienced, this comparison is insightful.",
    },
    {
      id: 4,
      title: "How can I manage state in a large React application?",
      tags: ["React", "State Management", "Redux"],
      author: "Bob Brown",
      createdAt: "2025-06-12",
      upvotes: 110,
      answers: 6,
      views: 400,
      description: "State management is a critical aspect of building scalable React applications. This question explores various approaches, including Redux, Context API, and third-party libraries. It provides insights into handling complex state logic and improving maintainability. Developers working on large projects will find practical solutions here.",
    },
    {
      id: 5,
      title: "What are the best practices for writing unit tests in JavaScript?",
      tags: ["JavaScript", "Testing", "Best Practices"],
      author: "Charlie Davis",
      createdAt: "2025-06-15",
      upvotes: 70,
      answers: 2,
      views: 200,
      description: "Unit testing is essential for ensuring code quality and reliability in JavaScript applications. This question discusses best practices for writing effective tests, including choosing the right testing frameworks and tools. It also covers strategies for organizing test cases and improving test coverage. Developers aiming to enhance their testing skills will find this helpful.",
    },
  ];
  const test = async () => {
    try {
      //return await api.users.getAll()
    } catch (error) {
      return logger.error(error)
    }
  };
  const allUsers = await test()
  logger.info(allUsers)
  const query = await searchParams?.query
  console.log(query + " from search params..............");
  
  const filtered = query
      ? questions.filter((q) => q.title.toLowerCase().includes(query.toLowerCase()))
      : questions;
  
  return (
    <div>
      <div className="ask-question-section">
        <button className="ask-question-button">Ask a Question</button>
      </div>
      <h2>All Questions</h2>
      <SearchBar placeholder="Search Questions..." route={ROUTES.HOME} />
      <br />
      <br />
      <FilterButtons />
      <br />
      <LogoutButton />
      <br />
      {filtered.map((q) => (
      <QuestionCard
        key={q.id}
        id={q.id}
        title={q.title}
        description={q.description}
        tags={q.tags}
        author={q.author}
        createdAt={q.createdAt}
        upvotes={q.upvotes}
        answers={q.answers}
        views={q.views}
      />
    ))}
    </div>
  );
}

// import { useParams, useNavigate } from "react-router-dom";
// import YearCard from "@/components/YearCard";
// import ExamCard from "@/components/ExamCard";
// import FlashcardList from "@/components/FlashcardList";
// import { flashcards } from "@/data/flashcards";

// const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
// const exams = ["Mid-Sem", "End-Sem"];

// export default function DetailPage() {
//   const { dept, year, exam } = useParams();
//   const navigate = useNavigate();

//   // 1️⃣ Department level → show years
//   if (dept && !year) {
//     return (
//       <div className="p-6">
//         <h1 className="text-3xl font-bold">{dept.toUpperCase()}</h1>
//         <div className="grid grid-cols-2 gap-6 mt-6">
//           {years.map((yr, idx) => (
//             <YearCard
//               key={yr}
//               year={yr}
//               onClick={() => navigate(`/detail/${dept}/${idx + 1}`)}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // 2️⃣ Year level → show exams
//   if (dept && year && !exam) {
//     return (
//       <div className="p-6">
//         <h1 className="text-2xl font-bold">{dept.toUpperCase()} - Year {year}</h1>
//         <div className="grid grid-cols-2 gap-6 mt-6">
//           {exams.map((ex) => (
//             <ExamCard
//               key={ex}
//               exam={ex}
//               onClick={() => navigate(`/detail/${dept}/${year}/${ex.toLowerCase()}`)}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // 3️⃣ Exam level → show flashcards
//   if (dept && year && exam) {
//     const filteredCards = flashcards.filter(
//       (card) =>
//         card.dept === dept &&
//         card.year === Number(year) &&
//         card.exam === exam
//     );

//     return (
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">
//           {dept.toUpperCase()} - Year {year} - {exam.toUpperCase()}
//         </h1>
//         <FlashcardList cards={filteredCards} />
//       </div>
//     );
//   }

//   return <p className="p-6">Invalid selection</p>;
// }

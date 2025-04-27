const studyMaterials = [
    {
      id: 1,
      studyMaterialName: "Mind Boost Workbook",
      recommendedFor: ["Dyslexia", "ADHD"],
      title: "Improving Focus and Reading Skills",
      author: "Dr. Emily Carter",
      description:
        "A workbook to help children with reading and attention challenges through interactive exercises.",
    },
    {
      id: 2,
      studyMaterialName: "Visual Learning Flashcards",
      recommendedFor: ["Dysgraphia", "Visual Processing Disorder"],
      title: "Enhancing Memory with Visual Aids",
      author: "Prof. James L. Brooks",
      description:
        "Flashcards designed to strengthen visual memory and writing skills using vivid illustrations.",
    },
    {
      id: 3,
      studyMaterialName: "Memory Mastery Guide",
      recommendedFor: ["Auditory Processing Disorder"],
      title: "Building Stronger Memory Pathways",
      author: "Sophia Turner",
      description:
        "Exercises and strategies to improve auditory memory and listening comprehension.",
    },
    {
      id: 4,
      studyMaterialName: "Attention Trainer App",
      recommendedFor: ["ADHD"],
      title: "Boosting Concentration and Focus",
      author: "NeuroFocus Labs",
      description:
        "An interactive mobile app with games specifically designed to enhance attention span in young learners.",
    },
    {
      id: 5,
      studyMaterialName: "Reading Rockets Handbook",
      recommendedFor: ["Dyslexia"],
      title: "Mastering Reading Fundamentals",
      author: "Karen Mitchell",
      description:
        "Step-by-step methods to build phonics, vocabulary, and comprehension skills in children with reading difficulties.",
    },
    {
      id: 6,
      studyMaterialName: "Cognitive Skills Builder",
      recommendedFor: ["Memory Retention Issues", "Learning Disabilities"],
      title: "Strengthening Cognitive Abilities",
      author: "Dr. Leo Graham",
      description:
        "A structured program offering memory drills, logical reasoning puzzles, and focus-enhancing tasks.",
    },
  ];
  
  export default function StudyMaterialCard() {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6">
        {studyMaterials.map((material) => (
          <div
            key={material.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col gap-4 transition duration-300"
          >
            <div className="text-xl font-bold text-indigo-600">
              {material.studyMaterialName}
            </div>
            <div className="text-gray-600 text-sm">
              Recommended For:{" "}
              <span className="font-semibold">
                {material.recommendedFor.join(", ")}
              </span>
            </div>
            <div className="text-lg font-semibold">{material.title}</div>
            <div className="text-gray-700">Author: {material.author}</div>
            <p className="text-gray-500 text-sm">{material.description}</p>
          </div>
        ))}
      </div>
    );
  }
  
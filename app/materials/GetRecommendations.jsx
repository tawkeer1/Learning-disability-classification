export function getRecommendations(finalPrediction, features) {
    const recommendations = [];
  
    if (finalPrediction.includes("ADHD")) {
      if (features["Attention Span"] < 50) {
        recommendations.push({
          title: "Focus-building Games",
          desc: "Try interactive games that improve attention span.",
          link: "https://www.education.com/games/attention/",
        });
      }
      if (features["Memory Retention"] < 50) {
        recommendations.push({
          title: "Memory Improvement Tasks",
          desc: "Use flashcards and repetition-based memory drills.",
          link: "https://www.memorygames.online/",
        });
      }
    }
  
    if (finalPrediction.includes("Dyslexia")) {
      if (features["Reading Score"] < 50) {
        recommendations.push({
          title: "Phonics & Reading Tools",
          desc: "Use phonics apps or guided reading activities.",
          link: "https://www.starfall.com/h/learn-to-read/",
        });
      }
      if (features["Spelling Accuracy"] < 50) {
        recommendations.push({
          title: "Spelling Practice",
          desc: "Play spelling games and practice with word cards.",
          link: "https://www.spellingtraining.com/",
        });
      }
    }
  
    if (finalPrediction.includes("None")) {
      // Still give improvement tips for weak areas
      if (features["Math Score"] < 50) {
        recommendations.push({
          title: "Math Skills Booster",
          desc: "Practice key math skills with interactive exercises.",
          link: "https://www.khanacademy.org/math",
        });
      }
    }
  
    // Generic wellness tip
    if (features["Sleep Quality"] === "Poor") {
      recommendations.push({
        title: "Improve Sleep Habits",
        desc: "Establish a consistent sleep schedule for better focus.",
        link: "https://kidshealth.org/en/kids/sleep.html",
      });
    }
  
    return recommendations;
  }
  
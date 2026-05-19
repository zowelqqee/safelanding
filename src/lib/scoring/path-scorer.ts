import type { PathFinderAnswers, PathMatchResult, IncomeRange } from "@/types";
import { getLegalPathsForCountry } from "@/lib/data/legal-paths";

function incomeValue(range: IncomeRange | ""): number {
  const map: Record<string, number> = {
    under_1000: 500,
    "1000_2000": 1500,
    "2000_3000": 2500,
    "3000_5000": 4000,
    "5000_plus": 6000,
    "": 0,
  };
  return map[range] ?? 0;
}

export function scorePathsForCountry(
  countryId: string,
  answers: PathFinderAnswers
): PathMatchResult[] {
  const income = incomeValue(answers.monthlyIncome);
  const paths = getLegalPathsForCountry(countryId);

  return paths
    .map((path) => {
      let score = 25;
      const reasons: string[] = [];
      const weakPoints: string[] = [];

      if (path.requires_remote_income) {
        if (answers.worksRemotely && answers.foreignIncome) {
          score += 28;
          reasons.push("You already have remote income outside the destination country");
        } else if (answers.worksRemotely || answers.foreignIncome) {
          score += 10;
          weakPoints.push("This route still depends on clean remote-income proof");
        } else {
          score -= 28;
          weakPoints.push("This route usually depends on remote income from outside the destination country");
        }
      }

      if (path.requires_admission) {
        if (answers.hasAdmission || answers.hasSchoolAdmission) {
          score += 26;
          reasons.push("You already have a study anchor or admission progress");
        } else if (answers.readyToStudy) {
          score += 10;
          weakPoints.push("Admission is still the missing piece");
        } else {
          score -= 24;
          weakPoints.push("This route is hard to use without a real study plan or admission");
        }
      }

      if (path.requires_local_employer || path.requires_sponsor) {
        if (answers.hasJobOffer) {
          score += 28;
          reasons.push("You already have an employer or sponsor-style anchor");
        } else {
          score -= 22;
          weakPoints.push("This route usually depends on a real employer or sponsor");
        }
      }

      switch (path.scenario) {
        case "remote": {
          if (answers.worksRemotely) score += 12;
          if (income >= 3000) {
            score += 10;
            reasons.push("Your income profile looks closer to a remote-route case");
          } else if (income > 0) {
            weakPoints.push("Income thresholds must be verified before relying on this route");
          }
          if (answers.hasSavings) score += 6;
          break;
        }
        case "study": {
          if (answers.readyToStudy) {
            score += 18;
            reasons.push("Study is already part of your move plan");
          }
          if (answers.hasSavings) score += 8;
          break;
        }
        case "work": {
          if (income >= 3000) {
            score += 8;
            reasons.push("Your profile suggests some professional earning power");
          }
          if (!answers.worksRemotely) score += 4;
          break;
        }
        case "exploration": {
          if (answers.moveSoon === false) {
            score += 24;
            reasons.push("You want to explore before making a long-term commitment");
          }
          if (!answers.worksRemotely && !answers.readyToStudy && !answers.hasJobOffer) {
            score += 10;
            reasons.push("This is a reasonable first step while your long-term route is still unclear");
          }
          if (answers.moveSoon) {
            score -= 10;
            weakPoints.push("You want to move soon, so a real long-term route may matter more than exploration");
          }
          weakPoints.push("This is not a long-term settlement route by itself");
          break;
        }
        case "family": {
          if (answers.movingWithFamily) {
            score += 26;
            reasons.push("You are already planning around family or partner movement");
          } else {
            score -= 12;
          }
          break;
        }
        case "capital":
        case "business": {
          if (answers.hasCapital || answers.hasSavings) {
            score += 16;
            reasons.push("You may have the financial base this kind of route needs");
          } else {
            score -= 12;
            weakPoints.push("This route usually works better with real capital or savings behind it");
          }
          if (income >= 5000) score += 6;
          break;
        }
        case "talent": {
          if (answers.hasExtraordinaryProfile) {
            score += 34;
            reasons.push("You may have the kind of standout profile this route expects");
          } else {
            score -= 22;
            weakPoints.push("This route usually needs unusually strong evidence, not just a good profile");
          }
          if (income >= 5000) score += 4;
          break;
        }
      }

      const finalReasons =
        reasons.length > 0 ? reasons.slice(0, 3) : path.goodIf.slice(0, 3);
      const finalWeakPoints = [...weakPoints, ...path.weakPoints].slice(0, 2);

      return {
        pathId: path.id,
        score: Math.min(99, Math.max(0, score)),
        reasons: finalReasons,
        weakPoints: finalWeakPoints,
      };
    })
    .sort((a, b) => b.score - a.score);
}

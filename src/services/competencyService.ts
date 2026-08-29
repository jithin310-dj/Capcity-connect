import { storageService } from './storageService';
import { CompetencyMatchResult, CompetencyScoreBreakdown } from '../types';

export interface CompetencySearchCriteria {
  requiredSubject: string;
  requiredSkills: string[];
  minimumExperienceYears?: number;
  minimumQualification?: string; // e.g. 'Ph.D.', 'M.Tech', 'MBA', 'Any'
}

export const competencyService = {
  /**
   * Transparent Rule-Based Competency Matching Engine
   * Scoring Breakdown:
   * 1. Skill Match: 40% (Ratio of required skills matched in trainer's skills list)
   * 2. Qualification Match: 20% (Degree depth match: Ph.D. / M.Tech / MBA / B.Tech)
   * 3. Experience Match: 20% (Years of experience vs. minimum requested threshold)
   * 4. Subject Match: 15% (Primary department / subjects taught)
   * 5. Rating & Track Record: 5% (Trainer rating out of 5)
   * Total: 100%
   */
  matchTrainers(criteria: CompetencySearchCriteria): CompetencyMatchResult[] {
    const trainers = storageService.getUsers().filter((u) => u.role === 'trainer' && u.status === 'approved');
    const { requiredSubject, requiredSkills, minimumExperienceYears = 3, minimumQualification = 'Any' } = criteria;

    const results: CompetencyMatchResult[] = trainers.map((trainer) => {
      const matchReasons: string[] = [];

      // 1. Skill Match (Max 40)
      let skillScore = 0;
      if (requiredSkills.length === 0) {
        skillScore = 35; // default base
        matchReasons.push('General skill coverage aligned with institutional competency.');
      } else {
        const trainerSkillsLower = trainer.skills.map((s) => s.toLowerCase());
        const matchedSkills = requiredSkills.filter((req) =>
          trainerSkillsLower.some((ts) => ts.includes(req.toLowerCase()) || req.toLowerCase().includes(ts))
        );
        const skillRatio = matchedSkills.length / requiredSkills.length;
        skillScore = Math.round(skillRatio * 40);
        if (matchedSkills.length > 0) {
          matchReasons.push(`Matches ${matchedSkills.length}/${requiredSkills.length} requested skills (${matchedSkills.join(', ')}).`);
        } else {
          matchReasons.push('Adjacent foundational skill domain.');
        }
      }

      // 2. Qualification Match (Max 20)
      let qualScore = 14;
      const degrees = trainer.qualifications.map((q) => q.degree.toLowerCase()).join(' ');
      if (degrees.includes('ph.d') || degrees.includes('phd') || degrees.includes('doctorate')) {
        qualScore = 20;
        matchReasons.push('Holds Doctorate / Ph.D. from premier institute.');
      } else if (degrees.includes('m.tech') || degrees.includes('m.s') || degrees.includes('mba') || degrees.includes('master')) {
        qualScore = 18;
        matchReasons.push('Holds Postgraduate / Masters degree in domain.');
      } else if (degrees.includes('b.tech') || degrees.includes('b.e') || degrees.includes('bachelor')) {
        qualScore = 15;
        matchReasons.push('Holds Engineering / Bachelor degree in domain.');
      }

      if (minimumQualification !== 'Any' && degrees.includes(minimumQualification.toLowerCase())) {
        qualScore = 20;
      }

      // 3. Experience Match (Max 20)
      let expScore = 10;
      const years = trainer.yearsOfExperience || (trainer.experience?.length ? trainer.experience.length * 3 : 5);
      if (years >= minimumExperienceYears + 5) {
        expScore = 20;
        matchReasons.push(`Extensive experience (${years} years) exceeding minimum requirement (${minimumExperienceYears}+ years).`);
      } else if (years >= minimumExperienceYears) {
        expScore = 17;
        matchReasons.push(`Meets experience threshold with ${years} years in field.`);
      } else {
        expScore = Math.max(8, Math.round((years / minimumExperienceYears) * 16));
        matchReasons.push(`Emerging practitioner with ${years} years of active training.`);
      }

      // 4. Subject Match (Max 15)
      let subjScore = 5;
      const subQuery = requiredSubject.toLowerCase();
      const trainerBio = (trainer.bio || '').toLowerCase();
      const trainerDept = (trainer.department || '').toLowerCase();
      const trainerOrg = (trainer.organization || '').toLowerCase();
      const trainerSkillsStr = trainer.skills.join(' ').toLowerCase();

      if (trainerSkillsStr.includes(subQuery) || trainerDept.includes(subQuery) || trainerBio.includes(subQuery)) {
        subjScore = 15;
        matchReasons.push(`Direct subject expertise in "${requiredSubject}".`);
      } else if (
        (subQuery.includes('python') || subQuery.includes('ml') || subQuery.includes('ai') || subQuery.includes('data')) &&
        (trainerSkillsStr.includes('python') || trainerSkillsStr.includes('machine learning') || trainerSkillsStr.includes('data'))
      ) {
        subjScore = 14;
        matchReasons.push(`Strong domain intersection with "${requiredSubject}".`);
      } else if (
        (subQuery.includes('lead') || subQuery.includes('manage') || subQuery.includes('comm')) &&
        (trainerSkillsStr.includes('leadership') || trainerSkillsStr.includes('communication') || trainerSkillsStr.includes('management'))
      ) {
        subjScore = 14;
        matchReasons.push(`Proven leadership & communication training track record.`);
      } else {
        subjScore = 10;
      }

      // 5. Rating Match (Max 5)
      const trainerRating = trainer.rating || 4.5;
      const ratingScore = Math.min(5, Math.max(3, Math.round((trainerRating / 5) * 5)));
      matchReasons.push(`Outstanding peer satisfaction rating: ${trainerRating.toFixed(2)}/5.0 ★.`);

      const breakdown: CompetencyScoreBreakdown = {
        skillMatch: skillScore,
        qualificationMatch: qualScore,
        experienceMatch: expScore,
        subjectMatch: subjScore,
        ratingMatch: ratingScore
      };

      const totalScore = skillScore + qualScore + expScore + subjScore + ratingScore;

      let recommendation: 'Highly Suitable' | 'Suitable' | 'Moderate Match' | 'Basic Match' = 'Moderate Match';
      if (totalScore >= 85) {
        recommendation = 'Highly Suitable';
      } else if (totalScore >= 72) {
        recommendation = 'Suitable';
      } else if (totalScore >= 55) {
        recommendation = 'Moderate Match';
      } else {
        recommendation = 'Basic Match';
      }

      return {
        trainer,
        totalScore,
        breakdown,
        matchReasons,
        recommendation
      };
    });

    return results.sort((a, b) => b.totalScore - a.totalScore);
  }
};

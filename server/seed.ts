import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a sample issuer
  const issuer = await prisma.issuer.create({
    data: {
      name: 'Sample Issuer',
      description: 'A sample issuer for testing',
    },
  });

  // Create a sample company
  const company = await prisma.company.create({
    data: {
      name: 'TechCorp Inc.',
      issuer_id: issuer.id,
    },
  });

  // Create a sample questionnaire
  const questionnaire = await prisma.questionnaire.create({
    data: {
      name: 'ESG Assessment Questionnaire',
      description: 'A comprehensive ESG assessment questionnaire',
    },
  });

  // Create some sample questions
  const environmentalQuestion = await prisma.question.create({
    data: {
      questionnaire_id: questionnaire.id,
      text: 'What percentage of your energy comes from renewable sources?',
      type: 'scale',
      section: 'Environmental',
      order: 1,
    },
  });

  const socialQuestion = await prisma.question.create({
    data: {
      questionnaire_id: questionnaire.id,
      text: 'Do you have a diversity and inclusion policy?',
      type: 'yes_no',
      section: 'Social',
      order: 2,
    },
  });

  const governanceQuestion = await prisma.question.create({
    data: {
      questionnaire_id: questionnaire.id,
      text: 'Do you have a code of ethics for employees?',
      type: 'yes_no',
      section: 'Governance',
      order: 3,
    },
  });

  // Create question options
  await prisma.questionOption.create({
    data: {
      question_id: environmentalQuestion.id,
      text: '0-25%',
      value: '0-25',
      score: 1,
    },
  });

  await prisma.questionOption.create({
    data: {
      question_id: environmentalQuestion.id,
      text: '26-50%',
      value: '26-50',
      score: 2,
    },
  });

  await prisma.questionOption.create({
    data: {
      question_id: environmentalQuestion.id,
      text: '51-75%',
      value: '51-75',
      score: 3,
    },
  });

  await prisma.questionOption.create({
    data: {
      question_id: environmentalQuestion.id,
      text: '76-100%',
      value: '76-100',
      score: 4,
    },
  });

  await prisma.questionOption.create({
    data: {
      question_id: socialQuestion.id,
      text: 'Yes',
      value: 'yes',
      score: 4,
    },
  });

  await prisma.questionOption.create({
    data: {
      question_id: socialQuestion.id,
      text: 'No',
      value: 'no',
      score: 1,
    },
  });

  await prisma.questionOption.create({
    data: {
      question_id: governanceQuestion.id,
      text: 'Yes',
      value: 'yes',
      score: 4,
    },
  });

  await prisma.questionOption.create({
    data: {
      question_id: governanceQuestion.id,
      text: 'No',
      value: 'no',
      score: 1,
    },
  });

  // Create sample responses
  await prisma.response.create({
    data: {
      company_id: company.id,
      question_id: environmentalQuestion.id,
      value: '76-100',
      score: 4,
    },
  });

  await prisma.response.create({
    data: {
      company_id: company.id,
      question_id: socialQuestion.id,
      value: 'yes',
      score: 4,
    },
  });

  await prisma.response.create({
    data: {
      company_id: company.id,
      question_id: governanceQuestion.id,
      value: 'yes',
      score: 4,
    },
  });

  // Create scoring configurations
  await prisma.scoringConfig.create({
    data: {
      questionnaire_id: questionnaire.id,
      section: 'Environmental',
      aggregation_method: 'average',
      weight: 1.0,
    },
  });

  await prisma.scoringConfig.create({
    data: {
      questionnaire_id: questionnaire.id,
      section: 'Social',
      aggregation_method: 'average',
      weight: 1.0,
    },
  });

  await prisma.scoringConfig.create({
    data: {
      questionnaire_id: questionnaire.id,
      section: 'Governance',
      aggregation_method: 'average',
      weight: 1.0,
    },
  });

  // Create a sample report
  const report = await prisma.report.create({
    data: {
      company_id: company.id,
      questionnaire_id: questionnaire.id,
      overall_score: 4.0,
      section_scores: JSON.stringify({
        Environmental: 4.0,
        Social: 4.0,
        Governance: 4.0,
      }),
    },
  });

  console.log('Seed data created successfully!');
  console.log('Created report with ID:', report.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
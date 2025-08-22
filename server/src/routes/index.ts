import { Router } from 'express';
import { issuerRoutes } from './issuer.routes';
import { companyRoutes } from './company.routes';
import { questionnaireRoutes } from './questionnaire.routes';
import { questionRoutes } from './question.routes';
import { responseRoutes } from './response.routes';
import { scoringConfigRoutes } from './scoringConfig.routes';
import { reportRoutes } from './report.routes';
import { userRoutes } from './user.routes';

const apiV1Router = Router();

// Public routes
apiV1Router.use('/users', userRoutes); // Login and register are public

// Protected routes (example: protect all other routes)
// apiV1Router.use('/issuers', authenticate, issuerRoutes);
// apiV1Router.use('/companies', authenticate, companyRoutes);
// ... and so on for other routes
// For now, we'll leave them open as per initial scope, but this is where you'd add protection.

apiV1Router.use('/issuers', issuerRoutes);
apiV1Router.use('/companies', companyRoutes);
apiV1Router.use('/questionnaires', questionnaireRoutes);
apiV1Router.use('/questions', questionRoutes);
apiV1Router.use('/responses', responseRoutes);
apiV1Router.use('/scoring-configs', scoringConfigRoutes);
apiV1Router.use('/reports', reportRoutes);

export { apiV1Router };
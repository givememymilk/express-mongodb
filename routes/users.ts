import express from 'express';
var router = express.Router();

// Require the controllers
import * as user_controller from '../controllers/users.ts';

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', user_controller.test);

// Authentication routes
router.post('/signup', user_controller.user_signup);
router.post('/login', user_controller.user_login);

// User routes
router.get('/:id', user_controller.user_details);
router.put('/:id/update', user_controller.user_update);
router.delete('/:id/delete', user_controller.user_delete);

export default router;
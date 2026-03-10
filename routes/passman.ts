import express from 'express';
var router = express.Router();

import * as passman_controllers from '../controllers/passman.ts';

router.post('/gen_passwd', passman_controllers.gen_passwd);

export default router;

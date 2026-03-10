import type { Request, Response, NextFunction } from 'express';

import * as passman_services from '../services/passman.ts';

export function gen_passwd(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, enc_method } = req.body;
        const passwd = passman_services.gen_passwd(enc_method);
        passman_services.save_passwd(name, passwd);
        res.json({ name, passwd });
    } catch (err) {
        next(err);
    }
}
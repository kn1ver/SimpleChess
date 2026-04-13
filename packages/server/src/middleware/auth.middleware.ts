export function registerMiddleware(req: any, res: any, next: any) {
    const { email, password, nickname } = req.body;

    if (!email) { return res.status(400).json({ error: 'Email is required' }); }
    if (!password) { return res.status(400).json({ error: 'Password is required' }); }
    if (!nickname) { return res.status(400).json({ error: 'Nickname is required' }); }

    next();
}

export function loginMiddleware(req: any, res: any, next: any) {
    const { email, password, nickname } = req.body;

    if (!email) { return res.status(400).json({ error: 'Email is required' }); }
    if (!password) { return res.status(400).json({ error: 'Password is required' }); }

    next();
}

export function errorHandler(err: any, req: any, res: any, next: any) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
}

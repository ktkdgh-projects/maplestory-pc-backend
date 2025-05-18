export interface IJwtPayload {
    type: string;
    payload: {
        sub: { id: string };
        email: string;
        role: string[];
    };
    iat: number;
    nbf: number;
    exp: number;
}

export interface IJwtPayloadData {
    sub: { id: string };
    email: string;
    role: string[];
}
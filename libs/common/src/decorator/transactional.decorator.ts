import { Connection, ClientSession } from 'mongoose';

export function Transactional() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const that = this as { connection: Connection };
            const connection = that.connection;
            if (!connection) {
                throw new Error('No mongoose connection found in "this.connection"');
            }
            const session: ClientSession = await connection.startSession();
            session.startTransaction();
            try {
                const result = await originalMethod.apply(this, [...args, session]);
                await session.commitTransaction();
                session.endSession();
                return result;
            } catch (error) {
                await session.abortTransaction();
                session.endSession();
                throw error;
            }
        };
        return descriptor;
    };
}

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WsAuthGuard extends AuthGuard('jwt') {
	constructor() {
		super();
	}

	getRequest(context: ExecutionContext) {
		const ctx = context.switchToWs();
		const client = ctx.getClient();
		// const connection = ctx.getData();
		const authToken = client.handshake?.headers?.authorization;

		return { headers: { authorization: authToken } };
	}
}

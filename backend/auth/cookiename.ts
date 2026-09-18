export function cookieName(name: string): string {
	return `__Host-Http-${name}`;
}

export const AUTH_COOKIE_NAME = cookieName("authtoken");

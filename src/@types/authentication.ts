// ----------------------------------------------------------------------

export type ActionMap<M extends { [index: string]: any }> = {
	[Key in keyof M]: M[Key] extends undefined
		? {
				type: Key
		  }
		: {
				type: Key
				payload: M[Key]
		  }
}

export type AuthUser = null | Record<string, any>

export type AuthState = {
	isAuthenticated: boolean
	isInitialized: boolean
	user: AuthUser
}

export type JWTContextType = {
	isAuthenticated: boolean
	isInitialized: boolean
	user: AuthUser
	method: 'jwt'
	login: (email: string, password: string) => Promise<void>
	register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
	logout: () => Promise<void>
	resetPassword: (email: string) => void
	updateProfile: VoidFunction
}

export type AWSCognitoContextType = {
	isAuthenticated: boolean
	isInitialized: boolean
	user: AuthUser
	method: 'cognito'
	login: (email: string, password: string) => Promise<unknown>
	register: (email: string, password: string, firstName: string, lastName: string) => Promise<unknown>
	logout: VoidFunction
	resetPassword: (email: string) => void
	updateProfile: VoidFunction
}

export type Auth0ContextType = {
	isAuthenticated: boolean
	isInitialized: boolean
	user: AuthUser
	method: 'auth0'
	login: () => Promise<void>
	logout: VoidFunction
	resetPassword: (email: string) => void
	updateProfile: VoidFunction
}

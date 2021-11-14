import { useEffect, useRef } from 'react'

// TODO: Remove this hook
// TODO: @2075 Should actually export from rmrk-team/substra-hooks helpers

export const useIsMountedRef = () => {
	const isMountedRef = useRef<null | boolean>(null)
	useEffect(() => {
		isMountedRef.current = true
		return () => {
			isMountedRef.current = false
		}
	}, [])
	return isMountedRef.current
}

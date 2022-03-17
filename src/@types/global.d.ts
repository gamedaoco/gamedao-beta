declare global {
	namespace JSX {
		interface IntrinsicElements {
			'model-viewer': {
				src: string
				'ios-src'?: string
				'camera-controls'?: boolean
				'disable-zoom'?: boolean
				'auto-rotate'?: boolean
				ar?: boolean
				autoplay?: boolean
				'shadow-intensity'?: number | string
				'ar-scale'?: number | string
				toBlob?: () => Promise<Blob>
			} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
		}
	}
}

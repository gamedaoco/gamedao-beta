import React, { PureComponent } from 'react'
import { FormikConsumer } from 'formik'

class FormikPersistor extends PureComponent {
	componentWillMount() {
		window.addEventListener('beforeunload', this.clear)
	}

	componentDidMount() {
		const { setValues, setErrors } = this.props
		const data = sessionStorage.getItem(this.storageKey)
		if (data) {
			const { values, errors } = JSON.parse(data)
			setValues(values)
			setErrors(errors)
		}
	}

	componentDidUpdate() {
		const { values, errors } = this.props
		sessionStorage.setItem(this.storageKey, JSON.stringify({ values, errors }))
	}

	componentWillUnmount() {
		window.removeEventListener('beforeunload', this.clear)
	}

	get storageKey() {
		return `formik.form.${this.props.name}`
	}

	clear = () => {
		sessionStorage.removeItem(this.storageKey)
	}

	render() {
		return null
	}
}

const FormikPersist = ({ name }) => (
	<FormikConsumer>
		{({ values, errors, setValues, setErrors }) => (
			<FormikPersistor name={name} setValues={setValues} setErrors={setErrors} values={values} errors={errors} />
		)}
	</FormikConsumer>
)

export default FormikPersist

import React from 'react'
import Form from 'antd/lib/form'

const FormHOC = WrapperredComponent => {
  class FormHOCComponent extends React.PureComponent {

    getInitialValue = k => {
      const { formData = {} } = this.props
      return formData[k]
    }

    collectData = event => {
      event.preventDefault()
      return new Promise((resolve, reject) => {
        const { form } = this.props
        form.validateFieldsAndScroll((err, values) => {
          if (err) {
            console.log('Received values of form: ', values)
            reject(values)   
          } else {
            resolve(values)
          }
        })
      })
    }

    render() {
      return <WrapperredComponent {...this.props} getInitialValue={this.getInitialValue} collectData={this.collectData}/>
    }
  }

  return Form.create({})(FormHOCComponent)
}

export default FormHOC

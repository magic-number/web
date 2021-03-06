import React from 'react';
import { Form, Input, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import FormHOC from '../../../../component/FormHOC';

class Base extends React.PureComponent {
  onSubmit = (event) => {
    const { collectData, onData } = this.props;
    collectData(event).then(vals => onData(vals));
  }

  render() {
    const { form, getInitialValue, history } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className="base" onSubmit={this.onSubmit}>
        {getFieldDecorator('id', {
          initialValue: getInitialValue('id'),
        })(
          <Input type="hidden" />,
        )}
        <Form.Item
          label="场景名称"
        >
          {getFieldDecorator('name', {
            initialValue: getInitialValue('name'),
            rules: [{
              required: true, message: '场景名称',
            }],
          })(
            <Input placeholder="场景唯一的名称标识" />,
          )}
        </Form.Item>

        <Form.Item
          label="场景备注"
        >
          {getFieldDecorator('remark', {
            initialValue: getInitialValue('remark'),
          })(
            <Input.TextArea placeholder="场景备注信息" rows={4} />,
          )}
        </Form.Item>
        <footer>
          <Button.Group>
            <Button onClick={() => history.goBack()}>返回</Button>
            <Button type="primary" onClick={this.onSubmit}>下一步</Button>
          </Button.Group>
        </footer>
      </Form>
    );
  }
}

export default withRouter(FormHOC(Base));

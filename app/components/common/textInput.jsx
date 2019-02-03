// @flow
import React, { Component } from 'react';

type Props = {
  name: string,
  onChange: () => mixed,
  onKeyPress?: () => mixed,
  placeholder?: string,
  value?: string,
  error?: string
};

export default class Input extends Component<Props> {
  render() {
    let wrapperClass = 'form-group';
    if (this.props.error && this.props.error.length > 0) {
      wrapperClass += ' ' + 'has-error';
    }

    return (
      <div className={wrapperClass}>
        <div className='field'>
          <input type='text'
            name={this.props.name}
            className='form-control'
            placeholder={this.props.placeholder}
            value={this.props.value}
            onChange={this.props.onChange}
            onKeyPress={this.props.onKeyPress}
          />
          <div className='input'>{this.props.error}</div>
        </div>
      </div>
    )
  }
}

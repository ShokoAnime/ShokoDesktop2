import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Panel extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.object.isRequired
  };

  static defaultProps = {
    title: ''
  };

  render() {
    const { title } = this.props;
    return (
      <div className="group-panel">
        <div className="header">
          Filter: <span className="title">{title}</span>
          <div className="button-container">
            <i className="button icon-refresh" />
            <i className="button icon-settings" />
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default Panel;

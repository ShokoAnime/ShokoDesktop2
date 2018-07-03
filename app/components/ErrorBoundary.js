import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false, info: null, error: '' };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true, error, info });
  }

  render() {
    if (this.state.hasError) {
      const { error, info } = this.state;
      return (
        <div style={{ marginLeft: '1rem', textAlign: 'center' }}>
          <h2>We have run into a problem:</h2>
          <h3>Error: {error.toString()}</h3>
          {info && info.componentStack ? (
            <h3>
              Trace:<pre>{info.componentStack.toString()}</pre>
            </h3>
          ) : null}
        </div>
      );
    }
    return this.props.children;
  }
}

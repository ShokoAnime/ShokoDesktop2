import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class SeriesImage extends PureComponent {
  static propTypes = {
    fallbackImage: PropTypes.string,
    host: PropTypes.string.isRequired,
    banner: PropTypes.bool,
    poster: PropTypes.bool,
    first: PropTypes.bool,
    art: PropTypes.object
  };

  static defaultProps = {
    fallbackImage: 'api/image/support/plex_404.bin',
    banner: false,
    poster: false,
    first: false,
    art: {}
  };

  render() {
    const { host, fallbackImage, banner, poster, art, first } = this.props;
    let type;
    if (banner) {
      type = 'fanart';
    } else if (poster) {
      type = 'thumb';
    }
    let imageSrc;
    try {
      if (first) {
        imageSrc = `${host}${art[type][0].url}`;
      }
      // TODO: random image
    } catch (ex) {
      imageSrc = `${host}${fallbackImage}`;
    }

    return <img src={imageSrc} alt="" />;
  }
}

function mapStateToProps(state) {
  const { api } = state;
  return {
    host: api.host
  };
}

export default connect(mapStateToProps)(SeriesImage);

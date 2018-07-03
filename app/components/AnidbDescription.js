import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AnidbLink from './AnidbLink';

const charRegex = new RegExp(
  '(http:\\/\\/anidb.net\\/c(?:h|r)[0-9]+) \\[([^\\]]+)]',
  'g'
);

class AnidbDescription extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired
  };

  render() {
    const { text } = this.props;

    const lines = [];
    let prevPos = 0;
    let pos = 0;
    let link = [];

    link = charRegex.exec(text);
    while (link !== null) {
      pos = link.index;
      lines.push(text.substring(prevPos, pos));
      prevPos = pos + link[0].length;
      lines.push(
        <AnidbLink key={pos} character url={link[1]} text={link[2]} />
      );
      link = charRegex.exec(text);
    }

    if (prevPos < text.length) {
      lines.push(text.substring(prevPos));
    }

    return <div>{lines}</div>;
  }
}

export default AnidbDescription;

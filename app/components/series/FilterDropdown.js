import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { forEach } from 'lodash';

export default class FilterDropdown extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        value: PropTypes.string
      })
    ).isRequired,
    onSelect: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.state = {
      dropdownOpen: false,
      value: 0
    };
  }

  componentDidMount() {
    this.selectOption(0);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  selectOption(index) {
    this.setState({
      value: index
    });
    this.props.onSelect(this.props.options[index]);
  }

  getOptions() {
    const options = [];
    forEach(this.props.options, (item, index) => {
      const option = (
        <DropdownItem
          onClick={() => {
            this.selectOption(index);
          }}
        >
          {item.value}
        </DropdownItem>
      );
      options.push(option);
    });
    return options;
  }

  render() {
    const { options } = this.props;
    const { value } = this.state;
    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>{options[value].value}</DropdownToggle>
        <DropdownMenu>{this.getOptions()}</DropdownMenu>
      </Dropdown>
    );
  }
}

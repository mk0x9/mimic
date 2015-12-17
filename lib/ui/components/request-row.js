import { API } from 'api/index';
import { DragSource } from 'react-dnd';
import React from 'react';
import cx from 'classnames';

import DRAG_SOURCE_TYPES from 'api/constants/drag-source-types';

const dragContract = {
  beginDrag(props) {
    return {
      requestId: props.requestId
    }
  }
};

function mapDNDToProps(connect) {
  return {
    makeDraggable: connect.dragSource()
  }
}

@DragSource(DRAG_SOURCE_TYPES.MOCKED_REQUEST, dragContract, mapDNDToProps)
export class RequestRow extends React.Component {

  static get propTypes() {
    return {
      requestId: React.PropTypes.string.isRequired,
      selected: React.PropTypes.bool,
      draggable: React.PropTypes.bool
    }
  }

  _requestRowClassName() {
    return cx('request-row', { selected: this.props.selected });
  }

  _contents() {
    return (
      <div className={ this._requestRowClassName() }>
        { this.props.children }
      </div>
    );
  }

  render() {
    return this.props.draggable
      ? this.props.makeDraggable(this._contents())
      : this._contents();
  }
}
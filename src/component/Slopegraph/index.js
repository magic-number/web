import React from 'react';

class Slopegraph extends React.PureComponent {
  static renderTextItem({
    x, y, text, ...rest
  }) {
    return <text x={x} y={y} {...rest}>{text}</text>;
  }

  static renderSlope({
    x1, x2, y1, y2, ...rest
  }) {
    return <line x1={x1} x2={x2} y1={y1} y2={y2} {...rest} />;
  }

  static createColumn(items, renderItem, topPadding, leftPadding, itemHeight, header = {}) {
    return [header, ...items].map((item, idx) => {
      const rst = idx === 0 ? header : renderItem(item, idx);
      return {
        x: leftPadding,
        y: topPadding + idx * itemHeight,
        key: idx,
        ref: React.createRef(),
        ...rst,
      };
    });
  }

  static renderLabel(item) {
    return { text: JSON.stringify(item) };
  }

  static makeSlopes(left, leftLabel, right, rightLabel, hasConnection) {
    const slopes = [];
    left.forEach((li, il) => {
      right.forEach((ri, ir) => {
        if (hasConnection(li, ri)) {
          const la = leftLabel[il + 1];
          const lb = rightLabel[ir + 1];
          slopes.push({
            key: slopes.length,
            x1: la.x + (la.ref.current && la.ref.current.getComputedTextLength()),
            y1: la.y,
            x2: lb.x,
            y2: lb.y,
            stroke: 'black',
            opacity: '0.6',
          });
        }
      });
    });
    return slopes;
  }

  static getDerivedStateFromProps(props) {
    const {
      left = [], right = [],
      renderLeftItem = Slopegraph.renderLabel,
      renderRightItem = Slopegraph.renderLabel,
      leftHeader = { text: 'left' },
      rightHeader = { text: 'right' },
      itemHeight = 10,
      leftPadding = 10,
      topPadding = 10,
      rightPadding = 10,
      bottomPadding = 10,
      width,
      hasConnection = () => false,
    } = props;


    const svgWidth = width + leftPadding + rightPadding;
    const svgHeight = Math.max(left.length, right.length) * itemHeight
    + topPadding + bottomPadding;

    const leftColumn = Slopegraph.createColumn(
      left, renderLeftItem, topPadding, svgWidth / 6 * 2, itemHeight, { textAnchor: 'end', ...leftHeader },
    );
    const rightColumn = Slopegraph.createColumn(
      right, renderRightItem, topPadding, svgWidth / 6 * 4, itemHeight, rightHeader,
    );

    const slopes = Slopegraph.makeSlopes(left, leftColumn, right, rightColumn, hasConnection);
    return {
      leftColumn,
      rightColumn,
      slopes,
      svgWidth,
      svgHeight,
    };
  }

  render() {
    const {
      left, right,
      renderTextItem = Slopegraph.renderTextItem,
      renderSlope = Slopegraph.renderSlope,
      renderLeftItem,
      renderRightItem,
      leftHeader,
      rightHeader,
      itemHeight,
      columnWidth,
      leftPadding,
      rightPadding,
      topPadding,
      bottomPadding,
      hasConnection,
      width,
      height,
      ...rest
    } = this.props;
    const { state = {} } = this;
    const {
      leftColumn = [], rightColumn = [], slopes = [], svgWidth = 0, svgHeight = 0,
    } = state;

    return (
      <svg width={svgWidth} height={svgHeight} {...rest} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        <g>
          {leftColumn.map(item => renderTextItem(item))}
        </g>
        <g>
          {rightColumn.map(item => renderTextItem(item))}
        </g>
        <g>
          {slopes.map(item => renderSlope(item))}
        </g>
      </svg>
    );
  }
}

export default Slopegraph;

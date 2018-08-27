import React from "react"
import {List, AutoSizer} from "react-virtualized"
import LogRow from "./LogRow"

export default class LogViewer extends React.PureComponent {
  render() {
    const {logs, appendToQuery, showDetail} = this.props

    const rowRenderer = ({key, index, style}) => {
      const log = logs[index]
      const prevLog = logs[index - 1]
      return (
        <LogRow
          key={key}
          log={log}
          prevLog={prevLog}
          style={style}
          showDetail={showDetail}
          appendToQuery={appendToQuery}
        />
      )
    }

    return (
      <AutoSizer>
        {({height, width}) => (
          <List
            className="log-viewer"
            width={width}
            height={height}
            rowCount={logs.length}
            rowHeight={25}
            rowRenderer={rowRenderer}
            overscanRowCount={2}
          />
        )}
      </AutoSizer>
    )
  }
}
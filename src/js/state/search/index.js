/* @flow */

import type {DateTuple} from "../../lib/TimeWindow"
import type {
  SEARCH_SPAN_ARGS_SET,
  SEARCH_SPAN_FOCUS_SET,
  SEARCH_SPAN_SET,
  SearchActions,
  SearchState,
  SpanArgs,
  SpanItemArg
} from "./types"
import type {Thunk} from "../types"
import brim, {type Span, type Ts} from "../../brim"
import selectors from "./selectors"

// search:
//   span:
//   spanArgs:
//   spanFocus:
//   input:
//   prevInput:
//   pins:
//   space:
//   cluster:

const actions = {
  setSpan(span: Span): SEARCH_SPAN_SET {
    return {type: "SEARCH_SPAN_SET", span}
  },
  setSpanArgs(spanArgs: SpanArgs): SEARCH_SPAN_ARGS_SET {
    return {type: "SEARCH_SPAN_ARGS_SET", spanArgs}
  },
  setSpanArgsFromDates(dates: DateTuple): SEARCH_SPAN_ARGS_SET {
    let spanArgs = [
      {time: brim.time(dates[0]).toTs()},
      {time: brim.time(dates[1]).toTs()}
    ]
    return {type: "SEARCH_SPAN_ARGS_SET", spanArgs}
  },
  setSpanFocus(spanFocus: ?Span): SEARCH_SPAN_FOCUS_SET {
    return {type: "SEARCH_SPAN_FOCUS_SET", spanFocus}
  }
}

const thunks = {
  computeSpan(now: Date = new Date()): Thunk {
    return function(dispatch, getState) {
      let [fromArg, toArg] = selectors.getSpanArgs(getState())
      let from = computeTimeArg(fromArg, now)
      let to = computeTimeArg(toArg, now)

      dispatch(actions.setSpan([from, to]))
    }
  }
}

function computeTimeArg(arg: SpanItemArg, now: Date): Ts {
  return arg.time ? arg.time : brim.relTime(arg.relTime, now).toTs()
}

const init: SearchState = {
  span: [{sec: 0, ns: 0}, {sec: 1, ns: 0}],
  spanArgs: [{relTime: "now - 5m"}, {relTime: "now"}],
  spanFocus: null
}

function reducer(state: SearchState = init, action: SearchActions) {
  switch (action.type) {
    case "SEARCH_SPAN_SET":
      return {...state, span: action.span}
    case "SEARCH_SPAN_ARGS_SET":
      return {...state, spanArgs: action.spanArgs}
    case "SEARCH_SPAN_FOCUS_SET":
      return {...state, spanFocus: action.spanFocus}
    default:
      return state
  }
}

export default {
  ...actions,
  ...selectors,
  ...thunks,
  reducer
}

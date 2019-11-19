/* @flow */

import type {Thunk} from "../state/types"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "../searches/programs"
import {issueSearch} from "../searches/issueSearch"
import {parallelizeProcs} from "../lib/Program"
import Log from "../models/Log"
import search from "../state/search"

export const UID_CORRELATION_LIMIT = 100

export const fetchTuplesByUid = (log: Log): Thunk => (dispatch, getState) => {
  let uid = log.correlationId()
  if (uid) {
    return dispatch(
      issueSearch({
        name: "UidSearch",
        tag: "detail",
        program: uid + " | head " + UID_CORRELATION_LIMIT,
        span: search.getSpanAsDates(getState())
      })
    )
  }
}

export const fetchByMd5 = (log: Log): Thunk => (dispatch, getState) => {
  let md5 = log.get("md5")

  if (md5) {
    return dispatch(
      issueSearch({
        name: "Md5Search",
        tag: "detail",
        program: parallelizeProcs([
          filenameCorrelation(md5),
          md5Correlation(md5),
          rxHostsCorrelation(md5),
          txHostsCorrelation(md5)
        ]),
        span: search.getSpanAsDates(getState())
      })
    )
  }
}

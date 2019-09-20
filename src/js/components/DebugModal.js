/* @flow */
import {useSelector} from "react-redux"
import Prism from "prismjs"
import React, {useState} from "react"

import {Input} from "./form/Inputs"
import {getSearchProgram} from "../state/selectors/searchBar"
import Form from "./form/Form"
import Modal from "./Modal"
import TextContent from "./TextContent"
import brim from "../brim"

export function DebugModal() {
  let searchProgram = useSelector(getSearchProgram)
  let [program, setProgram] = useState(searchProgram)

  return (
    <Modal
      name="debug"
      title="Debug Query"
      buttons="Done"
      className="debug-modal"
    >
      <TextContent>
        <p>
          Type a query in the text box to see the parsed abstract syntax tree
          (AST).
        </p>
        <Form>
          <Input
            label="Query"
            className="mono"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          />
        </Form>
        <pre
          className="language-js"
          dangerouslySetInnerHTML={{__html: formatAst(program)}}
        />
      </TextContent>
    </Modal>
  )
}

function formatAst(program) {
  if (!program.length) {
    return Prism.highlight(
      JSON.stringify({}, null, 4),
      Prism.languages.js,
      "JSON"
    )
  }

  let [ast, error] = parseAst(program)

  if (ast) {
    return Prism.highlight(
      JSON.stringify(ast, null, 4),
      Prism.languages.js,
      "JSON"
    )
  } else if (error) {
    return error.toString()
  }
}

function parseAst(program) {
  let ast, error
  try {
    ast = brim.program(program).ast()
  } catch (e) {
    error = e
  }
  return [ast, error]
}

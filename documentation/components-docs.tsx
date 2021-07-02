import React, { Component } from "react";
import {render} from "react-dom";
import * as componentsDocsInfo from "./index.json";
import * as _ from "lodash";
import {ComponentDocInfo} from "./component-doc-info.interface";

export class EoscComponentDoc extends Component<ComponentDocInfo> {
  render() {
    return (
      <div key={_.uniqueId("eosc-component-doc")}>
        <h3>{this.props.name}</h3>
        <blockquote>
          <p dangerouslySetInnerHTML={{ __html: this.props.htmlDescription }} />
        </blockquote>

        <b>Visualization</b>
        <div dangerouslySetInnerHTML={{ __html: this.props.htmlTag }} />
        <br />

        {EoscComponentDoc._getParams(this.props.parameters)}
        {EoscComponentDoc._getFunctions(this.props.functions)}
        {EoscComponentDoc._getExamples(this.props.examples)}

        <a href="#">Go to top</a>
      </div>
    );
  }

  private static _getParams(params: any) {
    if (!params || params.length === 0) {
      return (<></>);
    }

    return (
      <>
        <b>Parameters</b>
        <ul>
          {params.map((param: any) => (
            <>
              <li key={_.uniqueId("eosc-component-doc-li")}>{param.name}</li>
              <blockquote><p dangerouslySetInnerHTML={{ __html: param.htmlDescription }} /></blockquote>
            </>
          ))}
        </ul>
      </>
    )
  }

  private static _getFunctions(functions: any) {
    if (!functions || functions.length === 0) {
      return (<></>);
    }

    return (
      <>
        <b>Functions</b>
        <ul>
          {functions.map((docFunction: any) => (
            <>
              <li key={_.uniqueId("eosc-component-doc-li")}>{docFunction.name}</li>
              <blockquote><p dangerouslySetInnerHTML={{ __html: docFunction.htmlDescription }} /></blockquote>
            </>
          ))}
        </ul>
      </>
    );
  }

  private static _getExamples(examples: any) {
    if (!examples || examples.length === 0) {
      return (<></>);
    }

    return (
      <>
        <b>Examples</b>
        <ul>
          {examples.map((example: any) => (
            <>
              <li key={_.uniqueId("eosc-component-doc-li")}>{example.isGood ? "Good" : "Bad"}</li>
              {
                !!example.htmlDescription
                  ? <blockquote><p dangerouslySetInnerHTML={{ __html: example.htmlDescription }} /></blockquote>
                  : <></>
              }
              <pre><code>{example.htmlTag}</code></pre>
            </>
          ))}
        </ul>
      </>
    );
  }
}

const EoscComponentsDocsElement = document.getElementsByTagName("eosc-components-docs")[0];
render(
  (
    <React.Fragment>
      {
        ((componentsDocsInfo as any).default as ComponentDocInfo[])
          .map((info) => {
            return <EoscComponentDoc
              key={_.uniqueId("eosc-component-doc")}
              name={info.name}
              htmlDescription={info.htmlDescription}
              htmlTag={info.htmlTag}
              examples={info.examples}
              parameters={info.parameters}
              functions={info.parameters}
            />
          })
      }
    </React.Fragment>
  ),
  EoscComponentsDocsElement
);
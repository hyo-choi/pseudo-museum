import { ReactNode, useReducer } from "react";
import "./App.css";
import classNames from "classnames";

// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes#user_action_pseudo-classes
const userActionPseudoClasses = ["hover", "active", "focus"] as const;
// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes#input_pseudo-classes
const inputCheckablePseudoClasses = ["checked"] as const;
const inputPseudoClasses = [...inputCheckablePseudoClasses];

const userActionElementNames = ["div (w. a11y)", "a", "button"] as const;
const inputCheckableElementNames = [
  "input (radio)",
  "input (checkbox)",
] as const;
const inputElementNames = [
  "input (text)",
  ...inputCheckableElementNames,
] as const;

function getIsInputCheckablePseudoClass(
  className: string
): className is (typeof inputCheckablePseudoClasses)[number] {
  return inputCheckablePseudoClasses.includes(className as any);
}

function getIsInputCheckableElementName(
  name: string
): name is (typeof inputCheckableElementNames)[number] {
  return inputCheckableElementNames.includes(name as any);
}

const pseudoClasses = [...userActionPseudoClasses, ...inputPseudoClasses];
const elementNames = [...userActionElementNames, ...inputElementNames];

const LABEL_STYLED_CHAR = `👽`;
const UNAVAILABLE_CHAR = `-`;

function App() {
  const [isDisabled, toggleIsDisabled] = useReducer((prev) => !prev, false);
  return (
    <main className="flex column">
      <section className="flex">
        <p>
          조건이 만족되면 요소에 <span className="triggered">이 스타일</span>이
          적용됩니다.
        </p>
        <label className="flex center">
          <input
            type="checkbox"
            onChange={() => toggleIsDisabled()}
            checked={isDisabled}
          />
          disable 상태로 전환
        </label>
        <table>
          <tr>
            <th>{LABEL_STYLED_CHAR}</th>
            <td>트리거되면 옆의 글자에 스타일이 적용됨</td>
          </tr>
          <tr>
            <th>{UNAVAILABLE_CHAR}</th>
            <td>해당 스타일이 있을 수 없는 요소</td>
          </tr>
        </table>
      </section>
      <section>
        <table>
          <thead>
            <tr>
              <th></th>
              {elementNames.map((elementName) => {
                return (
                  <th key={elementName}>
                    {getIsInputCheckableElementName(elementName)
                      ? `${LABEL_STYLED_CHAR} ${elementName}`
                      : elementName}
                  </th>
                );
              })}
            </tr>
          </thead>
          {pseudoClasses.map((className) => {
            function withCheckableFilter(element: ReactNode) {
              return getIsInputCheckablePseudoClass(className) ? (
                <div className="flex center">{UNAVAILABLE_CHAR}</div>
              ) : (
                element
              );
            }
            return (
              <tr>
                <th>{className}</th>
                <td>
                  {withCheckableFilter(
                    <div
                      tabIndex={0}
                      role="button"
                      className={classNames("base", className)}
                    >
                      div w. a11y
                    </div>
                  )}
                </td>
                <td>
                  {withCheckableFilter(
                    <a className={classNames("base", className)} href="#">
                      anchor
                    </a>
                  )}
                </td>
                <td>
                  {withCheckableFilter(
                    <button
                      className={classNames("base", className)}
                      disabled={isDisabled}
                    >
                      button
                    </button>
                  )}
                </td>
                <td>
                  {withCheckableFilter(
                    <input
                      type="text"
                      className={classNames("base", className)}
                      disabled={isDisabled}
                    />
                  )}
                </td>
                <td>
                  <div className="flex center between">
                    <input
                      id={`radio-${className}`}
                      type="radio"
                      className={classNames("base", className)}
                      disabled={isDisabled}
                    />
                    <p>triggered</p>
                  </div>
                </td>
                <td>
                  <div className="flex center between">
                    <input
                      id={`cb-${className}`}
                      type="checkbox"
                      className={classNames("base", className)}
                      disabled={isDisabled}
                    />
                    <p>triggered</p>
                  </div>
                </td>
              </tr>
            );
          })}
        </table>
      </section>
    </main>
  );
}

export default App;

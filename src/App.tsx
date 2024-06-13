import { useReducer } from "react";
import "./App.css";
import classNames from "classnames";

// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes#user_action_pseudo-classes
const userActionPseudoClasses = ["hover", "active", "focus"] as const;
// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes#input_pseudo-classes
const inputCheckablePseudoClasses = ["checked"] as const;
const inputPseudoClasses = [...inputCheckablePseudoClasses];

const userActionElementLabels = ["div (w. a11y)", "a", "button"] as const;
const inputCheckableElementLabels = [
  "input (radio)",
  "input (checkbox)",
] as const;
const inputElementLabels = [
  "input (text)",
  ...inputCheckableElementLabels,
] as const;

const pseudoClasses = [...userActionPseudoClasses, ...inputPseudoClasses];
const elementLabels = [...userActionElementLabels, ...inputElementLabels];

type ElementLabel = (typeof elementLabels)[number];
type PseudoClass = (typeof pseudoClasses)[number];

const LABEL_ALIEN_CHAR = `👽`;
const UNAVAILABLE_CHAR = `-`;

interface MuseumElement {
  label: ElementLabel;
  availableClasses: Array<PseudoClass>;
  isAlien?: boolean;
}

const elementInfos: Array<MuseumElement> = [
  { label: "div (w. a11y)", availableClasses: [...userActionPseudoClasses] },
  { label: "a", availableClasses: [...userActionPseudoClasses] },
  { label: "button", availableClasses: [...userActionPseudoClasses] },
  { label: "input (text)", availableClasses: [...userActionPseudoClasses] },
  { label: "input (radio)", isAlien: true, availableClasses: pseudoClasses },
  { label: "input (checkbox)", isAlien: true, availableClasses: pseudoClasses },
];

function App() {
  const [isDisabled, toggleIsDisabled] = useReducer((prev) => !prev, false);
  return (
    <main className="flex column gap-lg">
      <section className="flex column gap-md">
        <p>
          조건이 만족되면 요소에 <span className="triggered">이 스타일</span>이
          적용됩니다.
        </p>
        <label className="flex center gap-sm">
          <input
            type="checkbox"
            onChange={() => toggleIsDisabled()}
            checked={isDisabled}
          />
          disable 상태로 전환
        </label>
        <table>
          <tr>
            <th>{LABEL_ALIEN_CHAR}</th>
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
              {elementInfos.map(({ label, isAlien }) => {
                return (
                  <th key={label}>
                    {isAlien ? `${LABEL_ALIEN_CHAR} ${label}` : label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pseudoClasses.map((className) => (
              <tr key={className}>
                <th>{className}</th>
                {elementInfos.map(({ label, availableClasses }) => {
                  return (
                    <td key={label}>
                      {availableClasses.includes(className) ? (
                        (() => {
                          switch (label) {
                            case "a":
                              return (
                                <a
                                  className={classNames("base", className)}
                                  href="#"
                                >
                                  anchor
                                </a>
                              );
                            case "button":
                              return (
                                <button
                                  className={classNames("base", className)}
                                  disabled={isDisabled}
                                >
                                  button
                                </button>
                              );
                            case "div (w. a11y)":
                              return (
                                <div
                                  tabIndex={0}
                                  role="button"
                                  className={classNames("base", className)}
                                >
                                  div w. a11y
                                </div>
                              );
                            case "input (text)":
                              return (
                                <input
                                  type="text"
                                  className={classNames("base", className)}
                                  disabled={isDisabled}
                                />
                              );
                            case "input (checkbox)":
                            case "input (radio)":
                              return (
                                <div className="flex center between">
                                  <input
                                    id={`radio-${className}`}
                                    type={
                                      label === "input (checkbox)"
                                        ? "checkbox"
                                        : "radio"
                                    }
                                    className={classNames("base", className)}
                                    disabled={isDisabled}
                                  />
                                  <p>triggered</p>
                                </div>
                              );
                          }
                        })()
                      ) : (
                        <div className="flex center">{UNAVAILABLE_CHAR}</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default App;

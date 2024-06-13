import { useReducer } from "react";
import "./App.css";
import classNames from "classnames";

// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes#user_action_pseudo-classes
const userActionPseudoClasses = ["hover", "active", "focus"] as const;
// https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes#input_pseudo-classes
const inputCheckablePseudoClasses = ["checked"] as const;
const inputPseudoClasses = [...inputCheckablePseudoClasses];

const userActionElementLabels = [
  "div (w. a11y)",
  "a",
  "input (button)",
] as const;
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

interface MuseumElement<
  ElementType extends keyof JSX.IntrinsicElements,
  Element extends HTMLElement = HTMLElement,
  Attribute extends
    React.HTMLAttributes<Element> = React.HTMLAttributes<Element>,
> {
  tableLabel: ElementLabel;
  elementType: ElementType;
  attributes?: Attribute;
  availableClasses: Array<PseudoClass>;
  isAlien?: boolean;
  canDisable?: boolean;
}

// interface MuseumInputElement extends MuseumElement {
//   elementType: "input";
//   attributes?: React.InputHTMLAttributes<HTMLInputElement>;
//   canDisable: true;
// }
// interface MuseumAnchorElement extends MuseumElement {
//   elementType: "a";
//   attributes?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
//   canDisable: false;
// }

const elementInfos: Array<
  | MuseumElement<"div", HTMLDivElement>
  | MuseumElement<
      "a",
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement>
    >
  | MuseumElement<
      "input",
      HTMLInputElement,
      React.InputHTMLAttributes<HTMLInputElement>
    >
> = [
  {
    tableLabel: "div (w. a11y)",
    elementType: "div",
    availableClasses: [...userActionPseudoClasses],
    attributes: {
      tabIndex: 0,
      role: "button",
      children: "div",
    },
  },
  {
    tableLabel: "a",
    elementType: "a",
    availableClasses: [...userActionPseudoClasses],
    attributes: {
      href: "#",
      children: "anchor",
    },
  },
  {
    tableLabel: "input (button)",
    elementType: "input",
    availableClasses: [...userActionPseudoClasses],
    attributes: {
      type: "button",
      value: "button",
    },
    canDisable: true,
  },
  {
    tableLabel: "input (text)",
    elementType: "input",
    attributes: {
      type: "text",
    },
    availableClasses: [...userActionPseudoClasses],
    canDisable: true,
  },
  {
    tableLabel: "input (radio)",
    elementType: "input",
    attributes: {
      type: "radio",
    },
    isAlien: true,
    availableClasses: pseudoClasses,
    canDisable: true,
  },
  {
    tableLabel: "input (checkbox)",
    elementType: "input",
    attributes: {
      type: "checkbox",
    },
    isAlien: true,
    availableClasses: pseudoClasses,
    canDisable: true,
  },
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
              {elementInfos.map(({ tableLabel, isAlien }) => {
                return (
                  <th key={tableLabel}>
                    {isAlien ? `${LABEL_ALIEN_CHAR} ${tableLabel}` : tableLabel}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pseudoClasses.map((className) => (
              <tr key={className}>
                <th>{className}</th>
                {elementInfos.map(
                  ({
                    elementType,
                    attributes,
                    tableLabel,
                    availableClasses,
                    isAlien,
                    canDisable,
                  }) => {
                    return (
                      <td key={tableLabel}>
                        {availableClasses.includes(className) ? (
                          (() => {
                            const Element = elementType;
                            const core = (
                              <Element
                                className={classNames("base", className)}
                                disabled={canDisable ? isDisabled : undefined}
                                // FIXME: fix type
                                {...(attributes as any)}
                              />
                            );
                            if (isAlien) {
                              return (
                                <div className="flex center between">
                                  {core}
                                  <p>triggered</p>
                                </div>
                              );
                            }
                            return core;
                          })()
                        ) : (
                          <div className="flex center">{UNAVAILABLE_CHAR}</div>
                        )}
                      </td>
                    );
                  }
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default App;

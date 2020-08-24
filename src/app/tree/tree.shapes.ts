import { dia, shapes, attributes } from "@clientio/rappid";
import { Direction, ElementAttrs, FormType } from "./types";

declare module "@clientio/rappid" {
  namespace shapes {
    namespace rao {
      class AppNode extends dia.Element {}
      class Element extends dia.Element {}
      class Link extends dia.Link {}
    }
  }
}

export interface ExtendedStaticMethods {
  /**
   * Returns true if the node have some error.
   * @note Link doesn't have this method.
   */
  isError: () => boolean;
  isHidden: () => boolean;
  /**
   * Returns true if the element is collapsed.
   * @description direction is required for appNode
   */
  isCollapsed: (direction: Direction) => boolean;
  setError: (value: boolean, errorMessage?: string) => void;
  setTitle: (title: string) => void;
  toggleCollapsePosition?: () => void;
  toggleCollapseSign: (plus: boolean, direction: Direction) => void;
  toggleCollapseVisibility: (visible: boolean) => void;
  /**
   * Private function for internal use only. Use `toggleCollapseVisibility` instead.
   * @note Only AppNode have this method.
   */
  _toggleLeftCollapseVisibility?: (graph: dia.Graph) => void;
  /**
   * Private function for internal use only. Use `toggleCollapseVisibility` instead.
   * @note Only AppNode have this method.
   */
  _toggleRightCollapseVisibility?: (graph: dia.Graph) => void;
  /**
   * Update the Wrapper which could be either rect or circle.
   * @condition
   * contentType == Role (rect) |
   * contentType == Other (circle)
   * @note AppNode element doesn't have this method.
   */
  updateResourceWrapper?: () => void;
  /**
   * Update various internal attributes depending
   * upon current state of element.
   * @note AppNode element doesn't have this method.
   */
  updateAttrs?: () => void;
}

const fontFamily = "Noto Sans CJK JP";

const collapse: Record<string, attributes.SVGAttributes> = {
  button: {
    cursor: "pointer",
    fill: "#fff",
    stroke: "#9C9C9C",
    strokeWidth: 1.5,
    refX: "100%",
    refY: "50%",
  },
  buttonBody: {
    width: 20,
    height: 20,
    rx: 20,
    ry: 20,
    event: "element:collapse",
  },
  buttonIcon: {
    refX: 5,
    refY: 5,
    stroke: "#001D6D",
    strokeWidth: 2,
    event: "element:collapse",
  },
};

const AppNode = dia.Element.define(
  "rao.AppNode",
  {
    size: { width: 360, height: 64 },
    attrs: {
      body: {
        refWidth: "100%",
        refHeight: "100%",
        fill: "transparent",
      },
      appWrapper: {
        refX2: +21.5,
      },
      appContainer: {
        refHeight: "100%",
        refWidth: "88%",
        fill: "#fff",
        stroke: "#9C9C9C",
        rx: 40,
        ry: 40,
      },
      nodeError: {
        width: 12,
        refX: 158,
        refY: 50,
        xlinkHref: "assets/warning.svg",
        cursor: "pointer",
      },
      appLogo: {
        width: 35,
        refX: 30,
        refY: 12,
      },
      appNameLabel: {
        refX: 85,
        refY: 15,
        fontFamily,
        fontSize: 12,
        lineHeight: 16,
        fill: "#606060",
        text: "Application Name",
      },
      appNameText: {
        refX: 85,
        refY: 31,
        fontFamily,
        fontSize: 16,
        lineHeight: 20,
        fill: "#333333",
        textWrap: {
          width: 120, // equivalent to 15 c
          maxLineCount: 1,
          ellipsis: true,
        },
      },
      appVersionLabel: {
        refX: 237,
        refY: 15,
        fontFamily,
        fontSize: 12,
        lineHeight: 16,
        fill: "#606060",
        text: "Version",
      },
      appVersionText: {
        refX: 237,
        refY: 31,
        fontFamily,
        fontSize: 16,
        lineHeight: 20,
        fill: "#333333",
      },
      leftCollapseButton: {
        ...collapse.button,
        refX: 0,
        refX2: -22,
        refY: "50%",
        refY2: -10,
      },
      leftCollapseButtonBody: {
        ...collapse.buttonBody,
        collapseType: Direction.LEFT,
      },
      leftCollapseButtonIcon: {
        ...collapse.buttonIcon,
        collapseType: Direction.LEFT,
      },
      rightCollapseButton: {
        ...collapse.button,
        refX2: -41,
        refY2: -10,
      },
      rightCollapseButtonBody: {
        ...collapse.buttonBody,
        collapseType: Direction.RIGHT,
      },
      rightCollapseButtonIcon: {
        ...collapse.buttonIcon,
        collapseType: Direction.RIGHT,
      },
      tooltip: {
        // Used for tooltip.
      },
      leftCollapseTooltip: {
        text: "Collapse all",
      },
      rightCollapseTooltip: {
        text: "Collapse all",
      },
      errorTooltip: {
        text: "Something went wrong!",
      },
    } as Record<string, attributes.SVGAttributes>,
  },
  {
    markup: [
      {
        tagName: "rect",
        selector: "body",
      },
      {
        tagName: "g",
        selector: "appWrapper",
        children: [
          {
            tagName: "rect",
            selector: "appContainer",
          },
          {
            tagName: "image",
            selector: "nodeError",
            children: [
              {
                tagName: "title",
                selector: "errorTooltip",
              },
            ],
          },
          {
            tagName: "image",
            selector: "appLogo",
          },
          {
            tagName: "text",
            selector: "appNameLabel",
          },
          {
            tagName: "text",
            selector: "appNameText",
          },
          {
            tagName: "text",
            selector: "appVersionLabel",
          },
          {
            tagName: "text",
            selector: "appVersionText",
          },
          {
            tagName: "title",
            selector: "tooltip",
          },
          {
            tagName: "g",
            selector: "leftCollapseButton",
            children: [
              {
                tagName: "rect",
                selector: "leftCollapseButtonBody",
              },
              {
                tagName: "path",
                selector: "leftCollapseButtonIcon",
              },
              {
                tagName: "title",
                selector: "leftCollapseTooltip",
              },
            ],
          },
          {
            tagName: "g",
            selector: "rightCollapseButton",
            children: [
              {
                tagName: "rect",
                selector: "rightCollapseButtonBody",
              },
              {
                tagName: "path",
                selector: "rightCollapseButtonIcon",
              },
              {
                tagName: "title",
                selector: "rightCollapseTooltip",
              },
            ],
          },
        ],
      },
    ] as dia.MarkupJSON,

    PLUS_SIGN: "M 1 5 9 5 M 5 1 5 9",
    MINUS_SIGN: "M 2 5 8 5",

    isError() {
      const error = this.get(ElementAttrs.ERROR);
      return !!error;
    },

    isHidden() {
      const hidden = this.get(ElementAttrs.HIDDEN);
      return !!hidden;
    },

    isCollapsed(direction: Direction) {
      let collapsed;
      if (direction === Direction.LEFT) {
        collapsed = this.get(ElementAttrs.COLLAPSED_LEFT);
      } else {
        collapsed = this.get(ElementAttrs.COLLAPSED_RIGHT);
      }
      return !!collapsed;
    },

    async toggleCollapseVisibility() {
      // If visible is true, then the appNode is no longer the leaf node.
      const self = this as dia.Element & ExtendedStaticMethods;
      self._toggleLeftCollapseVisibility(self.graph);
      self._toggleRightCollapseVisibility(self.graph);
    },

    async _toggleLeftCollapseVisibility(graph: dia.Graph) {
      // If the neighbors belongs to left direction, then leftCollapse is visible.
      const leftNeighbors = graph
        .getNeighbors(this as dia.Element)
        .filter((elem) => elem.get(ElementAttrs.DIRECTION) === Direction.LEFT);
      this.attr("leftCollapseButton", {
        display: leftNeighbors.length ? "block" : "none",
      });
    },

    _toggleRightCollapseVisibility(graph: dia.Graph) {
      // If the neighbors belongs to right direction, then rightCollapse is visible.
      const rightNeighbors = graph
        .getNeighbors(this as dia.Element)
        .filter((elem) => elem.get(ElementAttrs.DIRECTION) === Direction.RIGHT);
      this.attr("rightCollapseButton", {
        display: rightNeighbors.length ? "block" : "none",
      });
    },

    toggleCollapseSign(plus: boolean, direction: Direction) {
      const collapseTypeIcon =
        direction === Direction.LEFT
          ? "leftCollapseButtonIcon"
          : "rightCollapseButtonIcon";
      if (!plus) {
        this.attr(collapseTypeIcon, {
          d: this.PLUS_SIGN,
          strokeWidth: 2,
        });
      } else {
        this.attr(collapseTypeIcon, {
          d: this.MINUS_SIGN,
          strokeWidth: 2,
        });
      }
    },

    setError(value: boolean, errorMessage?: string) {
      const self = this as dia.Element;
      self.attr({
        nodeError: {
          display: value ? "block" : "none",
        },
        errorTooltip: {
          text: errorMessage || "Something went wrong!",
        },
      });
      self.set(ElementAttrs.ERROR, value);
    },

    setTitle(title: string) {
      const self = this as dia.Element;
      self.attr({
        appNameText: {
          text: title,
        },
        tooltip: {
          text: title,
        },
      });
    },
  },
);

const Element = dia.Element.define(
  "rao.Element",
  {
    size: { height: 90, width: 110 },
    attrs: {
      body: {
        refWidth: "100%",
        refHeight: "100%",
        fill: "transparent",
      },
      line: {
        d: "m 0 45 h 80",
        stroke: "#9C9C9C",
        strokeWidth: 1,
      },
      resourceWrapper: {
        refX: 23,
        refY: 18,
        fill: "#fff",
        stroke: "#9C9C9C",
      },
      resourceBodyRect: {
        width: 63,
        height: 48,
        rx: 6,
        ry: 6,
      },
      resourceBodyCircle: {
        cx: 31,
        cy: 25,
        r: 25,
        display: "none",
      },
      resourceIcon: {
        // Dynamic values.
        // Height: 36/24
        // Width: 36/24
        refX: 14,
        refY: 7,
      },
      nodeError: {
        width: 11,
        refX: 50,
        refY: 3,
        xlinkHref: "assets/warning.svg",
        cursor: "pointer",
      },
      collapseButton: {
        ...collapse.button,
        refX2: -20,
        refY2: -10,
      },
      collapseButtonBody: {
        ...collapse.buttonBody,
      },
      collapseButtonIcon: {
        ...collapse.buttonIcon,
      },
      toggleError: {
        width: 11,
        refX: 5,
        refY: 4,
        xlinkHref: "assets/warning.svg",
        cursor: "pointer",
        display: "none",
        event: "element:collapse",
      },
      labelWrapper: {
        refX: 5,
        refY: 73,
        fill: "#EBEBEB",
      },
      labelBody: {
        width: 100,
        height: 16,
        rx: 6,
        ry: 6,
      },
      labelText: {
        fontFamily,
        fontSize: 10,
        lineHeight: 15,
        fill: "#000000",
        textWrap: {
          width: -15,
          maxLineCount: 1,
          ellipsis: true,
        },
        // Center the text.
        refX: "45%",
        refY: "1%",
        dominantBaseline: "middle",
        textAnchor: "middle",
      },
      tooltip: {
        // Used for tooltip
      },
      collapseTooltip: {},
      errorTooltip: {
        text: "Something went wrong!",
      },
    } as Record<string, attributes.SVGAttributes>,
  },
  {
    markup: [
      {
        tagName: "rect",
        selector: "body",
      },
      {
        tagName: "path",
        selector: "line",
      },
      {
        tagName: "g",
        selector: "resourceWrapper",
        children: [
          {
            tagName: "rect",
            selector: "resourceBodyRect",
          },
          {
            tagName: "circle",
            selector: "resourceBodyCircle",
          },
          {
            tagName: "image",
            selector: "resourceIcon",
          },
          {
            tagName: "image",
            selector: "nodeError",
            children: [
              {
                tagName: "title",
                selector: "errorTooltip",
              },
            ],
          },
        ],
      },
      {
        tagName: "g",
        selector: "collapseButton",
        children: [
          {
            tagName: "rect",
            selector: "collapseButtonBody",
          },
          {
            tagName: "path",
            selector: "collapseButtonIcon",
          },
          {
            tagName: "image",
            selector: "toggleError",
          },
          {
            tagName: "title",
            selector: "collapseTooltip",
          },
        ],
      },
      {
        tagName: "g",
        selector: "labelWrapper",
        children: [
          {
            tagName: "rect",
            selector: "labelBody",
          },
          {
            tagName: "text",
            selector: "labelText",
          },
        ],
      },
      {
        // Used for tooltip
        tagName: "title",
        selector: "tooltip",
      },
    ] as dia.MarkupJSON,

    PLUS_SIGN: "M 1 5 9 5 M 5 1 5 9",
    MINUS_SIGN: "M 2 5 8 5",

    // Static methods
    updateAttrs() {
      const self = this as dia.Element & ExtendedStaticMethods;
      self.updateResourceWrapper();
      self.toggleCollapsePosition();
    },

    isError() {
      const error = this.get(ElementAttrs.ERROR);
      return !!error;
    },

    isHidden() {
      const hidden = this.get("hidden");
      return !!hidden;
    },

    isCollapsed() {
      const collapsed = this.get("collapsed");
      return !!collapsed;
    },

    toggleCollapseVisibility(visible: boolean) {
      const self = this as dia.Element;
      const direction = self.get(ElementAttrs.DIRECTION);
      self.attr({
        collapseButton: { display: visible ? "block" : "none" },
        /**
         * If the collapse/expand button is visible,
         * expand the line to the end of element.
         */
        ...(visible
          ? {
              line: {
                d:
                  direction === Direction.LEFT
                    ? "m 110 45 h -110"
                    : // Draw the path to the opposite direction.
                      "m 0 45 h 110",
              },
            }
          : {
              /**
               * If the collapse/expand button is hidden,
               * line path to the end of elem needs to be reduced.
               */
              line: {
                d:
                  direction === Direction.LEFT
                    ? "m 110 45 h -80"
                    : // Draw the path to the opposite direction.
                      "m 0 45 h 80",
              },
            }),
      });
    },

    toggleCollapseSign(plus) {
      const self = this as dia.Element;
      const error = self.graph
        .getElements()
        .filter((elem: dia.Element & ExtendedStaticMethods) => elem.isError());
      if (!plus) {
        if (!error.length) {
          self.attr({
            collapseButtonIcon: {
              display: "block",
              d: this.PLUS_SIGN,
              strokeWidth: 1.6,
            },
            toggleError: { display: "none" },
            collapseTooltip: { text: "Expand all" },
          });
          return;
        }
        self.attr({
          toggleError: { display: "block" },
          collapseButtonIcon: { display: "none" },
          collapseTooltip: { text: "Something went wrong!" },
        });
      } else {
        self.attr({
          collapseButtonIcon: {
            display: "block",
            d: this.MINUS_SIGN,
            strokeWidth: 1.8,
          },
          toggleError: { display: "none" },
          collapseTooltip: { text: "Collapse all" },
        });
      }
    },

    toggleCollapsePosition() {
      const self = this as dia.Element & ExtendedStaticMethods;
      const direction = self.get(ElementAttrs.DIRECTION);
      if (direction === Direction.LEFT) {
        self.attr({
          collapseButton: { refX: 0, refX2: 0 },
        });
      } else if (direction === Direction.RIGHT) {
        self.attr({
          collapseButton: { refX: "100%", refX2: -20 },
        });
      }
    },

    updateResourceWrapper() {
      const self = this as dia.Element;
      // Show the circle and hide the rect if its other than role form.
      if (self.attributes.linkedAttrs.contentType !== FormType.RoleForm) {
        self.attr({
          resourceBodyRect: { display: "none" },
          resourceBodyCircle: { display: "block" },
          nodeError: { refX: 26, refY: 38 },
          resourceIcon: { refX: 19, refY: 10 },
        });
      }
    },

    setError(value: boolean, errorMessage?: string) {
      const self = this as dia.Element;
      self.attr({
        nodeError: {
          display: value ? "block" : "none",
        },
        errorTooltip: {
          text: errorMessage || "Something went wrong!",
        },
      });
      self.set(ElementAttrs.ERROR, value);
    },

    setTitle(title: string) {
      const self = this as dia.Element;
      self.attr({
        labelText: {
          text: title,
        },
        tooltip: {
          text: title,
        },
      });
    },
  },
);

const Link = dia.Link.define(
  "rao.Link",
  {
    attrs: {
      root: {
        cursor: "pointer",
      },
      line: {
        fill: "none",
        connection: true,
        stroke: "#9c9c9c",
        strokeWidth: 1,
        // target arrow.
        // targetMarker: {
        //   type: "path",
        //   d: "M 10 -5 0 0 10 5 z",
        // },
      },
    } as Record<string, attributes.SVGAttributes>,
  },
  {
    markup: [
      {
        tagName: "path",
        selector: "line",
      },
    ],

    isHidden() {
      // If the target element is collapsed, we don't want to
      // show the link either
      const targetElement = this.getTargetElement();
      return !targetElement || targetElement.isHidden();
    },
  },
);

Object.assign(shapes, {
  rao: {
    AppNode,
    Element,
    Link,
  },
});

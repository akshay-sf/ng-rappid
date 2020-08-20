import "./collapsible.shapes";

import { Component, OnInit, AfterViewInit } from "@angular/core";
import { dia, layout, shapes, ui } from "@clientio/rappid";
import { each, isFunction, isObject } from "lodash";
import { data } from "./seed";
import * as $ from 'jquery';

@Component({
  selector: "app-collapsible",
  templateUrl: "./collapsible.component.html",
  styleUrls: ["./collapsible.component.scss"],
})
export class CollapsibleComponent implements OnInit, AfterViewInit {
  constructor() {}

  private graph: dia.Graph;
  private paper: dia.Paper;
  private treeLayout: layout.TreeLayout;
  private paperScroller: ui.PaperScroller;
  private toolbar: ui.Toolbar;

  // Watch viewport area
  viewportOverlap = 50;
  viewportRect;

  ngOnInit() {
    const graph = (this.graph = this.buildGraphFromObject(data));

    this.treeLayout = new layout.TreeLayout({
      graph,
      siblingGap: 18,
      parentGap: 50,
      direction: "R",
      filter: (siblings) => {
        // Layout will skip elements which have been collapsed
        return siblings.filter((sibling) => {
          return !(sibling as any).isHidden();
        });
      },
      updateAttributes: (_, model) => {
        // Update some presentation attributes during the layout
        (model as any).toggleButtonVisibility(!graph.isSink(model));
        (model as any).toggleButtonSign(!(model as any).isCollapsed());
      },
    });

    const paper = (this.paper = new dia.Paper({
      gridSize: 1,
      model: graph,
      // Stop all cell rendering for now
      frozen: true,
      async: true,
      interactive: false,
      sorting: dia.Paper.sorting.APPROX,
      defaultAnchor: { name: "modelCenter" },
      defaultConnectionPoint: { name: "boundary" },
      defaultConnector: { name: "rounded" },
      background: { color: "#F3F7F6" },
      viewport: (view) => {
        const model = view.model;
        // Hide elements and links which are currently collapsed
        if (model.isHidden()) {
          return false;
        }
        // Hide elements and links which are not in the viewport
        const bbox = model.getBBox();
        if (model.isLink()) {
          // vertical/horizontal links have zero width/height
          bbox.inflate(1);
        }
        return !!this.viewportRect.intersect(bbox);
      },
    }));

    const paperScroller = (this.paperScroller = new ui.PaperScroller({
      paper,
      padding: 50,
      cursor: "grab",
    }));

    document.getElementById("canvas").appendChild(this.paperScroller.el);
    this.paperScroller.render();
    this.paperScroller.zoom(1, { absolute: true });

    this.viewportRect = paperScroller
      .getVisibleArea()
      .inflate(this.viewportOverlap);
    paperScroller.el.onscroll = () => {
      this.viewportRect = paperScroller
        .getVisibleArea()
        .inflate(this.viewportOverlap);
    };

    const toolbar = (this.toolbar = new ui.Toolbar({
      theme: "modern",
      tools: [
        {
          type: "zoom-slider",
          min: 10,
          max: 400,
          step: 10,
          value: this.paperScroller.zoom() * 100,
        },
        {
          type: "button",
          name: "png",
          text: "Export PNG",
        },
      ],
      references: {
        paperScroller: this.paperScroller,
      },
    }));

    toolbar.on("png:pointerclick", () => {
      // First dump all views that are not in the viewport but keep
      // the collapsed elements hidden
      paper.dumpViews({
        viewport: (view) => {
          return !view.model.isHidden();
        },
      });
      // Now, when all the elements are rendered, export the paper to PNG
      paper.openAsPNG({
        useComputedStyles: false,
        stylesheet: (window as any).paperStyleSheet,
      });
    });

    document.getElementById("tools").appendChild(toolbar.el);
    toolbar.render();

    const start = new Date().getTime();
    this.layoutAndFocus();
    paper.unfreeze({
      progress: (done) => {
        if (!done) {
          return;
        }
        this.log(
          "Layout and Render Time: <b>",
          new Date().getTime() - start,
          "ms</b>",
        );
        this.log("Number of Cells: <b>", graph.getCells().length, "</b>");
        // remove the progress callback
        paper.unfreeze({ batchSize: 50 });
      },
    });
  }

  ngAfterViewInit() {
    this.registerEvents();
  }

  registerEvents() {
    const { paper } = this;
    paper.on("element:collapse", (view, evt) => {
      evt.stopPropagation();
      this.toggleBranch(view.model);
    });

    paper.on("blank:pointerdown", (evt, x, y) => {
      this.paperScroller.startPanning(evt);
    });
  }

  toggleBranch(root) {
    const shouldHide = !root.isCollapsed();
    root.set({ collapsed: shouldHide });
    this.graph.getSuccessors(root).forEach((successor) => {
      successor.set({
        hidden: shouldHide,
        collapsed: false,
      });
    });
    this.layoutAndFocus(this.viewportRect.center());
  }

  // Helpers

  private layoutAndFocus(focusPoint?: any) {
    this.treeLayout.layout();
    const center = focusPoint || this.treeLayout.getLayoutBBox().center();
    this.resizePaper();
    this.paperScroller.center(center.x, center.y);
  }

  private resizePaper() {
    this.paper.fitToContent({
      useModelGeometry: true,
      allowNewOrigin: "any",
      padding: 30,
      contentArea: this.treeLayout.getLayoutBBox(),
    });
  }

  private buildGraphFromObject(obj) {
    const cells = [];
    this.buildCellsFromObject(cells, "", obj);
    const graph = new dia.Graph();
    graph.resetCells(cells);
    return graph;
  }

  private buildCellsFromObject(cells, rootName, obj, parent?: any) {
    if (!parent) {
      parent = this.makeElement(rootName);
      parent.attr({
        body: {
          visibility: "hidden",
        },
        button: {
          width: 20,
          x: 0,
        },
      });
      cells.push(parent);
    }

    each(obj, (value, key) => {
      const keyElement = this.makeElement(key);
      cells.push(keyElement);

      if (parent) {
        const link = this.makeLink(parent, keyElement);
        cells.push(link);
      }

      if (!isFunction(value) && (isObject(value) || Array.isArray(value))) {
        each(value, (childValue, childKey) => {
          const childKeyElement = this.makeElement(childKey);
          cells.push(childKeyElement);
          let link = this.makeLink(keyElement, childKeyElement);
          cells.push(link);
          if (
            !isFunction(childValue) &&
            (isObject(childValue) || Array.isArray(childValue))
          ) {
            this.buildCellsFromObject(
              cells,
              rootName,
              childValue,
              childKeyElement,
            );
          } else {
            // Leaf.
            const grandChildElement = this.makeElement(childValue);
            cells.push(grandChildElement);
            link = this.makeLink(childKeyElement, grandChildElement);
            cells.push(link);
          }
        });
      } else {
        // Leaf.
        const childKeyElement = this.makeElement(value);
        cells.push(childKeyElement);
        const link = this.makeLink(keyElement, childKeyElement);
        cells.push(link);
      }
    });
  }

  private makeElement(label) {
    return new shapes.collapsible.Model({
      attrs: {
        root: {
          title: label,
        },
        label: {
          textWrap: {
            text: label,
          },
        },
      },
      size: {
        width: typeof label === "number" ? 27 : 70,
        height: 35,
      },
    });
  }

  private makeLink(el1, el2) {
    return new shapes.collapsible.Link({
      source: { id: el1.id },
      target: { id: el2.id },
    });
  }

  private log(...args) {
    $("<div/>").html(Array.from(arguments).join("")).appendTo("#info");
  }
}

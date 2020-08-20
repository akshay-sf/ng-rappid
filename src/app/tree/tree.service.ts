import { Injectable } from "@angular/core";
import { dia, shapes, ui, layout, g } from "@clientio/rappid";
import "./tree.shapes";
import { ExtendedStaticMethods } from "./tree.shapes";
import { isFunction } from "lodash";
import { ResourceItem, Direction } from "./types";

export enum ToggleTooltip {
  EXPAND = "Expand all",
  COLLAPSE = "Collapse all",
}

@Injectable({
  providedIn: "root",
})
export class TreeService {
  constructor() {}

  // Watch viewport area
  viewportOverlap = 200;
  viewportRect: g.Rect;
  appNodeCollapseType: Direction;

  // ===============================
  // ======== Create Layouts =======
  // ===============================
  public createPaper(graph: dia.Graph): dia.Paper {
    const paper = new dia.Paper({
      model: graph,
      height: document.documentElement.clientHeight - 100, // 100px for action-container
      width: document.documentElement.clientWidth,
      drawGrid: {
        name: "dot",
      },
      gridSize: 10,
      background: {
        color: "#FFFFFF",
      },
      frozen: true,
      async: true,
      defaultConnector: {
        name: "rounded",
      },
      defaultAnchor: {
        name: "modelCenter",
      },
      defaultConnectionPoint: {
        name: "boundary",
      },
      defaultLink: () => new shapes.rao.Link(),
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
    });
    return paper;
  }

  public createPaperScroller(paper: dia.Paper) {
    const paperScroller = new ui.PaperScroller({
      paper,
      autoResizePaper: true,
      cursor: "grab",
      contentOptions: {
        padding: 100,
        allowNewOrigin: "any",
        useModelGeometry: true,
      },
    });
    paperScroller.render();
    this.viewportRect = paperScroller
      .getVisibleArea()
      .inflate(this.viewportOverlap);
    return paperScroller;
  }

  public createTreeLayout(graph: dia.Graph) {
    const treeLayout = new layout.TreeLayout({
      graph,
      parentGap: 75,
      siblingGap: 41,
      // No documentation provided on site.
      updateAttributes: (_, model: dia.Element & ExtendedStaticMethods) => {
        // Update some presentation attributes during the layout
        model.toggleCollapseVisibility(!graph.isSink(model), graph);
        // Check if appNode and apply collapse behavior on both sides.
        model.toggleCollapseSign(
          !model.isCollapsed(this.appNodeCollapseType),
          this.appNodeCollapseType,
        );
        // Update the toggle position on every tree update for non-appNode.
        if (isFunction(model.updateAttrs)) {
          model.updateAttrs();
        }
      },
      filter: (children) => {
        // Layout will skip elements which have been collapsed
        return children.filter((child: dia.Element & ExtendedStaticMethods) => {
          return !child.isHidden();
        });
      },
    });
    return treeLayout;
  }

  public createTreeViewLayout(paper: dia.Paper, model: layout.TreeLayout) {
    const treeView = new ui.TreeLayoutView({
      paper,
      model,
      useModelGeometry: true,
      previewAttrs: {
        parent: {
          rx: 40,
          ry: 40,
        },
      },
    });
    return treeView;
  }

  // ===============================
  // ======= Create Elements =======
  // ===============================
  public createLink(source: dia.Element, target: dia.Element) {
    return new shapes.rao.Link({
      source: { id: source.id },
      target: { id: target.id },
    });
  }

  public createAppNode(
    logo: string,
    label: string,
    version: string,
    linkedAttrs,
  ) {
    const appNode = new shapes.rao.AppNode({
      position: { x: 100, y: 100 },
      attrs: {
        appLogo: {
          xlinkHref: logo,
        },
        appNameText: {
          text: label,
        },
        appVersionText: {
          text: version,
        },
        tooltip: {
          text: label,
        },
        leftCollapseTooltip: {
          text: ToggleTooltip.EXPAND,
        },
        rightCollapseTooltip: {
          text: ToggleTooltip.COLLAPSE,
        },
      },
      linkedAttrs,
    });
    return appNode as dia.Element & ExtendedStaticMethods;
  }

  public createMember(linkedAttrs: Partial<ResourceItem>) {
    const member = new shapes.rao.Element({
      position: { x: 500, y: 100 },
      attrs: {
        resourceIcon: {
          xlinkHref: linkedAttrs.imgSrc,
        },
        labelText: {
          text: linkedAttrs.label,
        },
        tooltip: {
          text: linkedAttrs.label,
        },
        collapseTooltip: {
          text: ToggleTooltip.EXPAND,
        },
      },
      linkedAttrs,
    });
    return member as dia.Element & ExtendedStaticMethods;
  }
}

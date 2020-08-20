import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { dia, ui, layout, g } from "@clientio/rappid";
import "./tree.shapes";
import { MatMenu, MatSelectChange } from "@angular/material";
import { resourceList } from "./resource-list";
import {
  FormType,
  ResourceItem,
  ResourceKeys,
  Direction,
  ElementAttrs,
} from "./types";
import { ExtendedStaticMethods } from "./tree.shapes";
import { TreeService, ToggleTooltip } from "./tree.service";
import { isString } from "lodash";

const Directions = [
  {
    label: "Right-Left",
    value: Direction.LEFT,
  },
  {
    label: "Left-Right",
    value: Direction.RIGHT,
  },
  {
    label: "Bottom-Top",
    value: Direction.TOP,
  },
  {
    label: "Top-Bottom",
    value: Direction.BOTTOM,
  },
];

const Highlighter = {
  highlighter: {
    name: "stroke",
    options: {
      padding: 5,
      rx: 5,
      ry: 5,
      attrs: {
        "stroke-width": 1,
        stroke: "#011d6d",
      },
    },
  },
};

@Component({
  selector: "app-tree",
  templateUrl: "./tree.component.html",
  styleUrls: ["./tree.component.scss"],
})
export class TreeComponent implements OnInit, AfterViewInit {
  constructor(private treeService: TreeService) {}
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("elements") elements: MatMenu;

  private graph: dia.Graph;
  private paper: dia.Paper;
  private paperScroller: ui.PaperScroller;
  private treeLayout: layout.TreeLayout;

  private _sliderValue = 100;
  get sliderValue() {
    return this._sliderValue;
  }
  set sliderValue(value) {
    this._sliderValue = value;
    this.paperScroller.zoom(value / 100, { absolute: true });
  }

  nodeSelected: (dia.Element & ExtendedStaticMethods) | undefined = undefined;
  formTypes = FormType;
  directions = Directions;

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.paper.setDimensions(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight - 100,
    );
    this.layoutAndFocus();
  }

  ngOnInit() {
    const graph = (this.graph = new dia.Graph());

    const paper = (this.paper = this.treeService.createPaper(graph));

    this.paperScroller = this.treeService.createPaperScroller(paper);

    const appNode = this.treeService.createAppNode(
      "assets/sf-logo.png",
      "Omni Care Infra",
      "1.10.00",
      resourceList.appNode,
    );

    appNode.position(
      (this.paper.options.width as number) / 2 - appNode.size().width / 2, // 314/2 = 157 (appNode width)
      (this.paper.options.height as number) / 2 - appNode.size().height / 2, // 64/2 = 32 (appNode height); 100 = action-container (height)
    );

    appNode.setError(false);

    this.graph.addCell(appNode);

    setTimeout(() => {
      this.addElement("role", appNode as dia.Element & ExtendedStaticMethods);
    });
  }

  ngAfterViewInit() {
    const { paper, canvas, graph } = this;
    canvas.nativeElement.appendChild(this.paperScroller.el);
    paper.unfreeze();

    const treeLayout = (this.treeLayout = this.treeService.createTreeLayout(
      graph,
    ));
    this.treeService.createTreeViewLayout(paper, treeLayout);
    this.layoutAndFocus();
    this.registerEvents();
  }

  private registerEvents() {
    const { paper, paperScroller } = this;

    // Single click on the element.
    paper.on("element:pointerup", (elementView: dia.ElementView) => {
      this.unHighlightAll();
      elementView.highlight(null, Highlighter);
      // console.log(elementView.model.get(ElementAttrs.DIRECTION));
      this.nodeSelected = elementView.model as dia.Element &
        ExtendedStaticMethods;
      this.paperScroller.scrollToElement(elementView.model, {
        animation: true,
      });
    });

    // Single click on the paper.
    paper.on("blank:pointerclick", () => {
      // Un-highlight all the elements of the mesh.
      this.unHighlightAll();
    });

    // Paper click pressed continuously.
    paper.on("blank:pointerdown", (evt: dia.Event) =>
      this.paperScroller.startPanning(evt),
    );

    // Collapse click
    paper.on(
      "element:collapse",
      (elementView: dia.ElementView, evt: dia.Event) => {
        // console.log(evt);
        evt.stopPropagation();
        this.toggleCollapse(
          elementView.model as dia.Element & ExtendedStaticMethods,
          evt,
        );
        this.layoutAndFocus(this.treeService.viewportRect.center());
      },
    );

    // On scroll event.
    paperScroller.el.onscroll = () => {
      this.treeService.viewportRect = paperScroller
        .getVisibleArea()
        .inflate(this.treeService.viewportOverlap);
    };
  }

  // ====================================
  // ========= Helper Functions =========
  // ====================================

  layoutAndFocus(focusPoint?: g.Point) {
    this.treeLayout.layout();
    (this.paperScroller as any).adjustPaper();
  }

  addElement(evt: ResourceKeys, source = this.nodeSelected) {
    const attr: ResourceItem = resourceList[evt];
    const newMember = this.treeService.createMember(attr);
    let direction: Direction = Direction.RIGHT;
    if (newMember.attributes.linkedAttrs.contentType === FormType.RoleForm) {
      // Check for total neighbors
      const neighbors = this.graph.getNeighbors(source);
      if (neighbors.length) {
        direction = this.getDirectionForCurrentMember(neighbors);
        this.treeService.appNodeCollapseType = direction;
      }
    } else {
      direction = this.getDirectionForParentMember(source);
    }
    newMember.updateAttrs();
    newMember.set(ElementAttrs.DIRECTION, direction);
    const newConnection = this.treeService.createLink(source, newMember);
    this.graph.addCells([newMember, newConnection]);
    // If the source of the newMember is collapsed, then expand all its successors.
    if (source.isCollapsed(direction)) {
      this.toggleCollapse(source, direction);
    }
    this.layoutAndFocus();
  }

  removeElement(node: dia.Element) {
    // This will return all the parents. Will pick the first one due to dfs algo.
    const parent = this.graph.getPredecessors(node)[0];
    this.graph.getSuccessors(node).forEach((elem) => {
      elem.remove();
    });
    node.remove();
    this.unHighlightAll();
    if (
      parent.attributes.linkedAttrs.contentType !== FormType.ApplicationForm
    ) {
      parent.findView(this.paper).highlight(null, Highlighter);
      this.nodeSelected = parent as dia.Element & ExtendedStaticMethods;
    }
    this.layoutAndFocus();
  }

  unHighlightAll() {
    const { graph, paper } = this;
    graph.getElements().forEach((element) => {
      const view = element.findView(paper);
      if (view) {
        view.unhighlight(null, Highlighter);
      }
    });
    this.nodeSelected = undefined;
  }

  // Toggle Collapse and Expand for non-app node.
  toggleCollapse(
    root: dia.Element & ExtendedStaticMethods,
    evt: dia.Event | string,
  ) {
    if (root.attributes.linkedAttrs.contentType === FormType.ApplicationForm) {
      this.toggleAppNodeCollapse(root, evt);
      return;
    }
    const shouldHide = !root.isCollapsed(root.get(ElementAttrs.DIRECTION));
    root.set({
      [ElementAttrs.COLLAPSED]: shouldHide,
    });
    root.attr(
      "collapseTooltip/text",
      shouldHide ? ToggleTooltip.EXPAND : ToggleTooltip.COLLAPSE,
    );
    this.graph.getSuccessors(root).forEach((successor) => {
      successor.set({
        [ElementAttrs.HIDDEN]: shouldHide,
        [ElementAttrs.COLLAPSED]: false,
      });
    });
  }

  // Toggle collapse & expand for app-node.
  toggleAppNodeCollapse(
    root: dia.Element & ExtendedStaticMethods,
    evt: dia.Event | string,
  ) {
    // Get the collapse-type
    // https://stackoverflow.com/questions/30850158/i-need-value-from-a-named-node-map
    const collapseType: Direction = isString(evt)
      ? evt
      : evt.target.getAttribute("collapse-type");
    this.treeService.appNodeCollapseType = collapseType;
    const shouldHide = !root.isCollapsed(collapseType);
    root.set({
      ...(collapseType === Direction.LEFT
        ? { [ElementAttrs.COLLAPSED_LEFT]: shouldHide }
        : { [ElementAttrs.COLLAPSED_RIGHT]: shouldHide }),
    });
    // Set tooltip
    if (collapseType === Direction.LEFT) {
      root.attr(
        "leftCollapseTooltip/text",
        shouldHide ? ToggleTooltip.EXPAND : ToggleTooltip.COLLAPSE,
      );
    } else {
      root.attr(
        "rightCollapseTooltip/text",
        shouldHide ? ToggleTooltip.EXPAND : ToggleTooltip.COLLAPSE,
      );
    }
    this.graph
      .getSuccessors(root)
      .filter((model) => model.get(ElementAttrs.DIRECTION) === collapseType)
      .forEach((successor) => {
        successor.set({
          [ElementAttrs.HIDDEN]: shouldHide,
          [ElementAttrs.COLLAPSED]: false,
        });
      });
  }

  // Direction drop-down menu event.
  onDirectionChange(event: MatSelectChange) {
    this.treeLayout.set(ElementAttrs.DIRECTION, event.value);
    this.layoutAndFocus();
  }

  getDirectionForParentMember(parent: dia.Element) {
    return parent.get(ElementAttrs.DIRECTION);
  }

  getDirectionForCurrentMember(neighbors: dia.Element[]): Direction {
    const { leftNeighbors, rightNeighbors } = this.getDirectionalNeighbors(
      neighbors,
    );
    if (leftNeighbors.length < rightNeighbors.length) {
      return Direction.LEFT;
    } else {
      return Direction.RIGHT;
    }
  }

  getDirectionalNeighbors(neighbors: dia.Element[]) {
    const leftNeighbors: dia.Element[] = [];
    const rightNeighbors: dia.Element[] = [];
    neighbors.forEach((elem) => {
      if (elem.get(ElementAttrs.DIRECTION) === Direction.LEFT) {
        leftNeighbors.push(elem);
      } else if (elem.get(ElementAttrs.DIRECTION) === Direction.RIGHT) {
        rightNeighbors.push(elem);
      } else {
        // Do Nothing
      }
    });
    return { leftNeighbors, rightNeighbors };
  }
}

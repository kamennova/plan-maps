import { AssertionError } from "assert";
import { InnerPlanNode } from "./PlanNode";
import { PlanChart } from "./PlanChart";
import { Branch } from "./Branch";
import { PlanNodeContainer } from "./PlanNodeContainer";
import { Stage } from "./Stage";
import { Step } from "./Step";
import { userInnerPlanNode } from "./userInnerPlanNode";

type InnerPlanNodeToLink = { id: string, node: InnerPlanNode, next: string[] };

export class StageStructObjParser {
    private readonly stage: Stage;

    constructor(stage: Stage) {
        this.stage = stage;
    }

    /**
     * Links each of nodes[] to its next nodes, if next is specified
     *
     * @param nodes
     */
    public static linkInnerPlanNodes(nodes: InnerPlanNodeToLink[]) {
        for (const obj of nodes) {
            if (obj.next.length === 0) {
                continue;
            }

            StageStructObjParser.linkObjToNodes(obj, nodes);
        }
    }

    public static linkObjToNodes(obj: InnerPlanNodeToLink, nodes: InnerPlanNodeToLink[]) {
        for (const nextId of obj.next) {
            for (const otherObj of nodes) {
                if (otherObj === obj || otherObj.id !== nextId) {
                    continue;
                }

                if (otherObj.node instanceof Step) {
                    obj.node.next.push(otherObj.node);
                    otherObj.node.prev.push(obj.node);
                } else {
                    throw new AssertionError({ message: 'Nodes of "next" property must be of type Step' });
                }
            }
        }
    }

    /**
     * Builds stage nodes structure from user-specified object obj
     * @param obj
     */
    public parseStructObject(obj: userInnerPlanNode[]) {
        // helper array of nodes to link
        const nodesToLink: InnerPlanNodeToLink[] = this.parseUserStageStruct(obj);
        StageStructObjParser.linkInnerPlanNodes(nodesToLink);
    }

    public parseUserStageStruct(struct: userInnerPlanNode[]) {
        return this.parseContainerStructure(this.stage, struct);
    }

    public parseContainerStructure(container: PlanNodeContainer, containerStruct: userInnerPlanNode[])
        : InnerPlanNodeToLink[] {
        let nodesToLink: InnerPlanNodeToLink[] = [];

        for (const nodeObj of containerStruct) {
            const innerNode: InnerPlanNode = PlanChart.newInnerPlanNode(nodeObj, container);
            nodesToLink.push({ id: nodeObj.id, node: innerNode, next: nodeObj.next });

            if (PlanChart.isHeadNodeObj(nodeObj)) {
                container.head.push(innerNode);
            }

            if (innerNode instanceof Branch && nodeObj.structure !== undefined) {
                nodesToLink = nodesToLink.concat(this.parseContainerStructure(innerNode, nodeObj.structure));
            }
        }

        return nodesToLink;
    }
}

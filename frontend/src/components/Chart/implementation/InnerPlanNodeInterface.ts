import {PlanNode} from "./PlanNode";
import {Stage} from "./Stage";

export interface InnerPlanNodeInterface {
    parentStage(): Stage;

    /**
     * Get node which visually goes after this node.
     * If this node is in its container's head, returns container.
     * Else returns one of next nodes
     *
     * @return PlanNode
     */
    parentNode(): PlanNode;
    isStageHead(): boolean;
}

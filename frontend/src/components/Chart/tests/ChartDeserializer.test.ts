import { Stage } from "../implementation";
import { Branch } from "../implementation/Branch";
import { PlanNode } from "../implementation/PlanNode";
import { Step } from "../implementation/Step";
import { chartExample } from "../serializedChartExample";
import { instantiateNodes, linkNodesToContainers, linkNodesToNext } from "../structureParser";

test('node instantiating', () => {
    const instancesToLink = instantiateNodes(chartExample.nodes);
    expect(instancesToLink[0].node).toBeInstanceOf(Stage);
    expect(instancesToLink[3].node).toBeInstanceOf(Step);
    expect(instancesToLink[4].node).toBeInstanceOf(Branch);
    expect(instancesToLink[5].next[0]).toBe("2");
    expect(instancesToLink[4].containerId).toBe('4');
});

test('node linking to next', () => {
    const instancesToLink = instantiateNodes(chartExample.nodes);
    const nodesToStructurize = linkNodesToNext(instancesToLink);
    expect((nodesToStructurize[12].node as Stage).next).toBeInstanceOf(Stage);
});

test('node linking to container', () => {
    const instancesToLink = instantiateNodes(chartExample.nodes);
    const nodesToStructurize: PlanNode[] = linkNodesToContainers(instancesToLink);
    expect((nodesToStructurize[0] as Stage).head.length).toBe(2);
    expect((nodesToStructurize[2] as Stage).head.length).toBe(3);
    expect((nodesToStructurize[3] as Step).container.id).toBe('4');
    expect((nodesToStructurize[4] as Branch).head.length).toBe(2);
    expect((nodesToStructurize[4] as Branch).container.id).toBe('4');
});

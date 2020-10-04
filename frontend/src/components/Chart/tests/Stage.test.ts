import {Branch} from "../implementation/Branch";
import {Stage} from "../implementation/Stage";
import {stepsOneLevel} from "../implementation/structExamples";
import {Task} from "../implementation/Task";

test('Creates Stage', () => {
    const newStage = new Stage(new Task('Task name'), stepsOneLevel);

    expect(newStage.head.length).toBe(3);

    for (const node of newStage.head) {
        expect(node.next.length).toBe(0);
    }

    for (const node of newStage.head) {
        if (node instanceof Branch) {
            expect(node.prev).toBe(null);
            continue;
        }

        for (const prev of node.prev) {
            expect(prev.next).toContain(node);
        }
    }
});

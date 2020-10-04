import { SerializedChart } from "flowcharts-common";

export const chartExample: SerializedChart =
    {
        "id": '1',
        "goal": {
            "name": "chart goal",
            "state": 'notStarted',
            "id": '1'

        },
        "users": [
            {
                "id": 2,
                "role": 'owner',
                invitedBy: 2,
            }
        ],
        "nodes": [
            {
                "task": {
                    "name": "Stage 1 task",
                    "state": 'notStarted',
                    "id": '4',
                },
                "type": "stage",
                "id": '4',
                next: ['12334'],
                "containerId": null,
            }, {
                "task": {
                    "name": "Step, st 1 head",
                    "state": 'notStarted',
                    "id": '4',
                },
                "containerId": "4",
                "type": "step",
                "id": '5',
                "next": []
            },
            {
                "task": {
                    "name": "Branch, st 1 head",
                    "state": "inProgress",
                    "id": '4',
                },
                "type": "branch",
                "id": '3',
                "next": [],
                "containerId": "4",
            },

            {
                "task": {
                    "name": "!!!Step task",
                    "state": "inProgress",
                    "id": "3",
                },
                "containerId": "3",
                "type": "step",
                "id": '1',
                "next": [
                    '2'
                ]
            },
            {
                "task": {
                    "name": "Step 2 task",
                    "state": 'notStarted',
                    "id": "2"
                },
                "type": "step",
                "id": '2',
                "next": [],
                "containerId": "3",
            },

            {
                task: {
                    name: 'oops',
                    state: 'notStarted',
                    id: "1",
                },
                type: 'stage',
                id: '12334',
                next: ['6'],
                containerId: null,
            },
            {
                "task": {
                    "name": "Stage 2",
                    "state": 'notStarted',
                    id: "3"
                },
                "type": "stage",
                "id": '6',
                "next": [],
                containerId: null
            },

            {
                "task": {
                    id: "4",
                    "name": "Step, st 2 head",
                    "state": 'notStarted'
                },
                "type": "step",
                "id": '7',
                "next": [],
                containerId: "6"
            },
            {
                "task": {
                    id: "8",
                    "name": "Branch, st 2 head",
                    "state": 'notStarted'
                },
                "type": "branch",
                "id": '9',
                "next": [],
                containerId: "6"
            },
            {
                "task": {
                    id: "8",
                    "name": "Branch, st 2 head",
                    "state": 'notStarted'
                },
                "type": "branch",
                "id": '8',
                "next": [],
                containerId: "6"
            },

            {
                "task": {
                    "name": "step 1",
                    id: "9",
                    "state": 'notStarted'
                },
                "type": "step",
                "id": '10',
                "next": [],
                containerId: "8"
            },
            {
                "task": {
                    id: "8",
                    "name": "branch 2",
                    "state": 'notStarted'
                },
                "type": "branch",
                "id": '11',
                containerId: "8",
                "next": []
            },

            {
                "task": {
                    id: "8",
                    "name": "Branch",
                    "state": 'notStarted'
                },
                "type": "branch",
                "id": '12',
                "next": [],
                containerId: "11"
            },

            {
                "task": {
                    id: "8",
                    "name": "Step 11",
                    "state": 'notStarted'
                },
                containerId: "12",
                "type": "step",
                "id": '13',
                "next": []
            },
            {
                "task": {
                    id: "8",
                    "name": "Step 12",
                    "state": 'notStarted'
                },
                "type": "step",
                "id": '14',
                "next": [],
                containerId: "12"
            },
            {
                "task": {
                    id: "8",
                    "name": "Step 12",
                    "state": 'notStarted'
                },
                "type": "step",
                "id": '15',
                "next": ['13'],
                containerId: "12"
            },
            {
                "task": {
                    id: "8",
                    "name": "Step 12",
                    "state": 'notStarted'
                },
                "type": "step",
                "id": '16',
                "next": ['15'],
                containerId: "12"
            }
        ],
        "isPublic": false,
        "isDefaultHeadStage": false,
        "style": {}
    };
